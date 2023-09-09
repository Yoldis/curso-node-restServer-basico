const { request, response } = require("express");
const Producto = require("../models/productosModel");
const categoriaModel = require("../models/categoriaModel");



const obtenerProductos = async(req = request, res = response) =>{

    const {limite = 5, desde = 0} = req.query;

    try {
        const [total, productos] = await Promise.all([
            Producto.find({estado:true}).countDocuments(),
            Producto.find({estado:true})
            .limit(limite)
            .skip(desde)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre'),
        ])

        res.status(200).json({
            msg:'Productos',
            total,
            productos
        })

    } catch (error) {
        res.status(500).json({
            msg:"Algo salio mal!"
        })
    }

}

const obtenerProductosPorId = async(req = request, res = response) => {

    const{id}= req.params;

    try {
        const producto = await Producto.findById(id)
                                        .populate('usuario', 'nombre')
                                        .populate('categoria', 'nombre')
        res.status(200).json({
            msg:'Producto',
            producto
        })
    } catch (error) {
        res.status(500).json({
            msg:'Algo salio mal'
        })
    }
}

const crearProductos = async(req =request, res = response) =>{

    const {estado, ususario, ...body} = req.body;
    body.nombre = body.nombre.toUpperCase();

    const producto = await Producto.findOne({nombre:body.nombre});
    if(producto){
        return res.status(401).json({
            msg:"Ya existe un producto con ese nombre"
        })
    }

    try {
        const data = {
            ...body,
            usuario:req.usuario._id,
        }

        const producto = new Producto(data);
        const newProducto = await Promise.all([
            producto.save(),
            Producto.findOne({nombre:body.nombre})
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
        ])

        res.status(200).json({
            msg:'Producto creado con exito',
            producto:newProducto[1]
        })

    } catch (error) {
        res.status(500).json({
            msg:'Algo salio mal al crear el producto'
        })
    }

}

const actualizarProducto = async(req = request, res = response) => {

    const id = req.params.id;
    const{estado, usuario, ...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    try {

        if(data.categoria){
            const categoria = await categoriaModel.findById(data.categoria);
            if(!categoria){
                return res.status(400).json({
                    msg:'La categoria no existe'
                })
            }
        }
        
        const producto = await Producto.findByIdAndUpdate(id, data, {new:true})
                                        .populate('usuario', 'nombre')
                                        .populate('categoria', 'nombre')

        res.status(200).json({
            msg:'Producto actualizado!',
            producto
        })

    } catch (error) {
        res.status(500).json({
            msg:'Algo salio mal'
        })
    }
    
}


const eliminarProducto = async(req = request, res = response) => {

    const {id} = req.params;

    try {
        const producto = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true});

        res.status(200).json({
            msg:'Eliminado con exito!',
            producto
        })
    } catch (error) {
        res.status(500).json({
            msg:'Algo salio mal'
        })
    }
}

module.exports = {
    obtenerProductos,
    obtenerProductosPorId,
    crearProductos,
    actualizarProducto,
    eliminarProducto
}