const path = require('path');
const { request } = require('express');
const { v4: uuidv4 } = require('uuid');

const subirArchivos = (file, carpeta = '',  extensionesPermitidas = ['png', 'jpg', 'jpeg', 'gif']) => {

    return new Promise((resolve, reject) => {

        const {archivo} = file;
    
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
    
        if(!extensionesPermitidas.includes(extension)){
            return reject(`La extension ${extension} no es valida, Permitidas: ${extensionesPermitidas}`);
        }
    
    
        const nombreTemp = uuidv4() + '.' + extension;
        const uploaadPath = path.join(__dirname, `../uploads/${carpeta}`, nombreTemp);
    
        archivo.mv(uploaadPath, (err) => {
            if(err){
                console.log(err);
                return reject('Error al subir el archivo')
            }
            resolve(nombreTemp);
        })
    })
}


module.exports = {
    subirArchivos
}