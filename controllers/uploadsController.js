const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const { request, response } = require("express");
const { subirArchivos } = require("../helpers/subirArchivos");

const {Usuario, Producto} = require('../models');


const cargaArchivo = async(req = request,  res = response) => {

    try {
        const nombre = await subirArchivos(req.files, 'usuarios');
        res.status(200).json({nombre});
    } catch (msg) {
        res.status(500).json({msg})
    }
}


const subirArchivoDB = async(req =request, res = response) => {

    const{id, coleccion} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`No se encontro ningun usuario con id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`No se encontro ningun producto con id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg:'Error al subir archivo'
            })  
    }

    if(modelo.img){
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivos(req.files, coleccion, undefined);
    modelo.img = nombre;
    await modelo.save();

    res.status(200).json({
        modelo
    })
}


const subirArchivoCloudinary = async(req =request, res = response) => {

    const{id, coleccion} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`No se encontro ningun usuario con id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`No se encontro ningun producto con id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg:'Error al subir archivo'
            })  
    }

    if(modelo.img){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
    await modelo.save();

    res.status(200).json({
        modelo
    })
}


const mostrarImagen = async(req =request, res = response) => {

    const{coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`No se encontro ningun usuario con id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:`No se encontro ningun producto con id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg:'Error al subir archivo'
            })  
    }

    if(modelo.img){
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)
        }
    }

    const pathImagenNoFound = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathImagenNoFound)
}

module.exports = {
    cargaArchivo,
    subirArchivoDB,
    subirArchivoCloudinary,
    mostrarImagen
}