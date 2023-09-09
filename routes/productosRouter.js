const {Router} = require('express');
const { check } = require('express-validator');

const { obtenerProductos, crearProductos, actualizarProducto, eliminarProducto, obtenerProductosPorId } = require('../controllers/productosController');
const { validarJWT, validarCampos, esAdminRole } = require('../middleware');
const { existeCategoria, existeProducto } = require('../helpers/db-validators');

const router = Router();


// Ruta Publica no se valida token
router.get('/', obtenerProductos)


router.get('/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom((id) => existeProducto(id)),
    validarCampos
], obtenerProductosPorId)

// Ruta privada hay que validar token
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre no puede ser numero').isAlpha(),
    check('categoria', 'No es un id valido - categoria').isMongoId(),
    check('categoria').custom((categoria) => existeCategoria(categoria)),
    validarCampos
], crearProductos)


// Ruta privada
router.put('/:id',[
    validarJWT,
    check('id', 'No es un id valido - id').isMongoId(),
    check('id').custom((id) => existeProducto(id)),

    validarCampos
],
actualizarProducto)


// Privada - Solo el administrador
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido - id').isMongoId(),
    check('id').custom((id) => existeProducto(id)),
    validarCampos
], eliminarProducto)


module.exports = router;