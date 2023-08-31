const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.urlUsuarios = '/api/usuarios';

        // Midlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();
    }

    middlewares(){
        // Directorio publico
        this.app.use(cors());
        // Lectura y parseo del body - Es obligatorio,
        // es para aceptar peticiones en formato JSON a mi backend
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes(){
       this.app.use(this.urlUsuarios, require('../routes/usuariosRouter'))
    }

    listen(){
        this.app.listen(this.port, ()=> {
            console.log('Servidor levantado en el puerto', this.port);
        })
    }
}


module.exports = Server;