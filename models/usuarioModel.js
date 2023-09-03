const{Schema, model} = require('mongoose');


const UsuarioSchema = Schema({

    nombre:{
        type:String,
        required:[true, 'El nombre es requerido']
    },

    correo:{
        type:String,
        required:[true, 'El correo es requerido'],
        unique:true
    },

    password:{
        type:String,
        required:[true, 'El password es requerido']
    },

    img:{
        type:String,
    },

    rol:{
        type:String,
        required:true,
        enum:['ADMIN_ROLE', 'USER_ROLE']
    },

    estado:{
        type:Boolean,
        default:true
    },

    google:{
        type:Boolean,
        default:false
    }
})

// Eliminar del objeto usuarios las propiedades __v y password
UsuarioSchema.methods.toJSON = function(){
    const{__v, password, ...usuario} = this.toObject();
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);