
const dbValidator = require('./db-validators');
const generarToken = require('./generarToken');
const googleVerify = require('./google.verify');
const subirArchivos = require('./subirArchivos');


module.exports = {
    ...dbValidator,
    ...generarToken,
    ...googleVerify,
    ...subirArchivos,
}