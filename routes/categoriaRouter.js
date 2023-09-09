
const { Router } = require('express');

const { obtenerCategoria, obtenerCategoriaPorID, crearCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categoriaController');
const { validarJWT, validarCampos, esAdminRole } = require('../middleware');
const { check } = require('express-validator');
const { existeCategoria } = require('../helpers/db-validators');


const router = Router();


// Obtener todas las categorias - publico
router.get('/', obtenerCategoria)

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id').custom((id) => existeCategoria(id)),
    validarCampos
], obtenerCategoriaPorID)

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre debe ser caracteres').isAlpha(),
    validarCampos
], crearCategoria)

// Actualizar categoria - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('id', 'No es un id valido - id').isMongoId(),
    check('id').custom((id) => existeCategoria(id)),
    validarCampos
], actualizarCategoria)

// Borrar categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido - id').isMongoId(),
    check('id').custom((id) => existeCategoria(id)),
    validarCampos
], eliminarCategoria)



module.exports = router;