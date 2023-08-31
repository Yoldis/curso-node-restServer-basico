const {Router} = require('express');
const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarioController');

const router = Router();


router.get('/', usuariosGet);

router.post('/', usuariosPost);

// Los parametros es el valor que se le pasa en la url
// Ejemplo /:id en este caso se definio un parametro llamado id que recibira cualquier valor
router.put('/:id', usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/', usuariosDelete);


module.exports = router;