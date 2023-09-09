
const {Schema, model} = require('mongoose');


const CategoriaSchema = Schema({

    nombre:{
        type:String,
        requerid:[true, 'El nombre es requerida'],
        unique:true
    },
    
    estado:{
        type:Boolean,
        default:true,
        required:true
    },

    usuario:{
        type:Schema.Types.ObjectId,
        // Referencia a la coleccion
        ref:'Usuario',
        requerid:true
    }
})

CategoriaSchema.methods.toJSON = function(){
    const{__v, estado, ...data} = this.toObject();
    return data;
}


module.exports = model('Categoria', CategoriaSchema);