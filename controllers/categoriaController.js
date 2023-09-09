const { response, request } = require("express");
const Categoria = require("../models/categoriaModel");



const obtenerCategoria = async( req = request, res =response) => {

    const {limit = 5, desde = 0} = req.query;

    const [catagorias, total] = await Promise.all([
        Categoria.find({estado:true}).limit(limit).skip(desde).populate('usuario', 'nombre'),
        Categoria.find({estado:true}).countDocuments(),
    ]);

    res.status(200).json({
        msg:'obtener todas las Categoria',
        total,
        catagorias,
    })
}


const obtenerCategoriaPorID = async(req = request, res =response) => {

    const{id} = req.params;
    try {
        const categoria = await Categoria.findById(id).populate('usuario');
        res.status(200).json({
            msg:'Categoria por id',
            categoria
        })   
    } catch (error) {
        res.status(500).json({
            msg:'Ocurrio un error al obtener la categoria'
        })
    }
}


const crearCategoria = async(req = request, res =response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre} existe en la DB`
        })
    }

    const data = {
        nombre,
        usuario:req.usuario._id
    }

    try {
        const categoria = new Categoria(data);
        await categoria.save();

        res.status(201).json({
            msg:'Categoria creada con exito!',
            categoria
        })
    } catch (error) {
        res.status(500).json({
            msg:'Algo salio mal al crear la categoria'
        })
    }
}


const actualizarCategoria = async(req = request, res =response) => {
    const {id} = req.params;

    const{estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario_id;

    try {
        const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});

        res.status(202).json({
            msg:'actualizar Categoria',
            categoria
        })
    } catch (error) {
        res.status(500).json({
            msg:'Error al actualizar la categoria'
        })
    }
    
}

const eliminarCategoria = async(req = request, res =response) => {
    const{id} = req.params;

    try {
        const categoria = await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true});
        res.status(200).json({
            msg:'Categoria Eliminada',
            categoria
        })    
    } catch (error) {
        res.status(500).json({
            msg:'Error al Eliminar'
        })
    }
    
}


module.exports = {
    obtenerCategoria,
    obtenerCategoriaPorID,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}