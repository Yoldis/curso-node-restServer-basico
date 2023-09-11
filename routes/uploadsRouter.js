
const {Router} = require('express');
const { check } = require('express-validator');
const { cargaArchivo, subirArchivoDB, mostrarImagen, subirArchivoCloudinary } = require('../controllers/uploadsController');
const {validarCampos, validarArchivo} = require('../middleware/index');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const router = Router();

router.post('/', validarArchivo, cargaArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id no es valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos

    // check('archivo', 'El archivo no puede ser vacio').notEmpty(),
    // check('coleccion', 'La coleccion no es valida').isIn(['usuarios', 'productos']),
], subirArchivoCloudinary)
// ], subirArchivoDB)

router.get('/:coleccion/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)



module.exports = router;