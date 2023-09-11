const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:'/api/auth',
            buscar:'/api/buscar',
            categorias:'/api/categorias',
            productos:'/api/productos',
            usuarios:'/api/usuarios',
            uploads:'/api/uploads',
        }

        // Conectar a base de datos
        this.conectarDB();
        
        // Midlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        // Usamos la configuracion de cors, para que el frontend tenga persmisos a hacer solicitudes al backend
        this.app.use(cors());
        // Lectura y parseo del body - Es obligatorio,
        // es para aceptar peticiones en formato JSON a mi backend
        this.app.use(express.json());
        // Para mostrar contenido estatico desde el backend, lo agregamos en la carpeta public
        this.app.use(express.static('public'));

        // Manejar Carga de archivo, instalar npm i express-fileupload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));
    }

    routes(){
        // Aqui agregamos todas nuestra rutas
        this.app.use(this.paths.auth, require('../routes/authRouter'));
        this.app.use(this.paths.buscar, require('../routes/buscarRouter'));
        this.app.use(this.paths.categorias, require('../routes/categoriaRouter'));
        this.app.use(this.paths.productos, require('../routes/productosRouter'));
        this.app.use(this.paths.usuarios, require('../routes/usuariosRouter'));
        this.app.use(this.paths.uploads, require('../routes/uploadsRouter'));
    }

    listen(){
        this.app.listen(this.port, ()=> {
            console.log('Servidor levantado en el puerto', this.port);
        })
    }
}


module.exports = Server;