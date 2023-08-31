const {request, response} = require('express');



const usuariosGet = (req = request, res = response) => {
    // Las query son las variables que se define en la url despues del signo de ?
    // Ejemplo: localhost:8082/api/usuarios?q=Hola
    // En este caso existe una varible q que llega en la query que tiene como valor Hola
    const {q, lala} = req.query;
    res.status(200).json({
        msg:'Peticion get - Controlador',
        q,
        lala
    })
}


const usuariosPost = (req, res = response) => {

    const body = req.body;
    res.status(201).json({
        msg:'Peticion post - Controlador',
        nombre:body.nombre,
        edad:body.edad
    })
}

const usuariosPut = (req, res = response) => {
    // Los parametros es el valor que se le pasa en la url
    // Ejemplo: localhost:8082/api/usuarios/10
    //El parametro es el 10, que depende como lo definiste en la ruta
    const {id} = req.params;

    res.status(201).json({
        msg:'Peticion put - Controlador',
        id
    })
}

const usuariosPatch = (req, res = response) => {
    res.status(200).json({
        msg:'Peticion patch - Controlador'
    })
}

const usuariosDelete = (req, res = response) => {
    res.status(200).json({
        msg:'Peticion delete - Controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}