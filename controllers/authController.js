const {request, response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuarioModel');
const generarToken = require('../helpers/generarToken');
const { googleVerify } = require('../helpers/google.verify');


const loginController = async(req = request, res = response) => {
    
    const {correo, password} = req.body;

    // Verificar si el email existe
    const usuario = await Usuario.findOne({correo});
    if(!usuario) {
        return res.status(400).json({
            msg:'Usuario / Password no son correctos - correo'
        })
    }

    // Verificar si el usuario est activo
    if(!usuario.estado) {
        return res.status(400).json({
            msg:'Usuario / Password no son correctos - estado : false'
        })
    }

    // Verificar contrasena
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if(!validPassword){
        return res.status(400).json({
            msg:'Usuario / Password no son correctos - password'
        })
    }

    // Generar JWT
    const token = await generarToken(usuario.id);

    res.status(200).json({
        msg:'Login-Controller',
        usuario,
        token
    })
}

const googleController = async(req = request, res= response) => {
    const { id_token } = req.body;

    try {
        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});
        if(!usuario){
            const data = {
                nombre,
                correo,
                img,
                password:'lala',
                google:true
            }
            usuario = new Usuario(data);
            await usuario.save();
        }


        // Verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador - estado:false'
            })
        }

        // Generar JWT
        const token = await generarToken(usuario.id);

        res.status(200).json({
            msg:"Inicio de sesion con google exitoso!",
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok:false,
            msg:'Algo salio mal con la autenitcacion de google'
        })
    }
    
}

module.exports = {
    loginController,
    googleController
}