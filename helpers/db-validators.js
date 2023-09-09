
const{Categoria, Role, Usuario, Producto} = require('../models/index');


const validarIdMongo = (id = '') => {
    if(id.length !== 24) {
        throw new Error(`El id ${id} no es valido`);
    }
}

// Verificar el rol si existe en la coleccion roles
const validarRol = async(rol = '') => {
    const existeElRol  = await Role.findOne({rol});
    if(!existeElRol){
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
    }
}

// Verificar si el correo existe en la coleccion de Usuarios
const emailExiste =  async(correo = '') => {
    const existeCorreo = await Usuario.findOne({correo});
    if(existeCorreo){
        throw new Error(`El correo: ${correo}, ya esta registrado`);
    }
}

// Validar que exista el usuario en DB
const existeId = async(id = '') => {
    validarIdMongo(id);
    const existeId = await Usuario.findById({_id:id});
    if(!existeId){
        throw new Error(`El id ${id} no es valido`);
    }
}

// Validar que exist la categoria en DB
const existeCategoria = async(id = '') => {
    validarIdMongo(id);
    const existe = await Categoria.findById(id);
    if(!existe){
        throw new Error('No existe la categoria')
    }
}


// Validar que existe el producto en DB
const existeProducto = async(id = '') => {
    validarIdMongo(id);
    const producto = await Producto.findById(id);
    if(!producto){
        throw new Error(`El producto no existe`)
    }
}

module.exports = {
    validarRol,
    emailExiste,
    existeId,
    existeCategoria,
    existeProducto
}