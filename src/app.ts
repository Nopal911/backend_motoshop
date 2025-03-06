import express,{Application} from 'express';
import { Producto } from './models/producto';; 
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes'
import usuarioRoutes from './routes/usuarioRoutes';
import categoriaRoutes from './routes/categoriaRoutes';

class Server {
    private app: Application;

    //inicializa clase
    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.app.listen(this.app.get("port"), () => {
          console.log("Server on port", this.app.get("port"));
      });    
    }

    //configuracion de modulos
    config(): void {
        // configuración del puerto para el servidor
      this.app.set("port", 3000);
     
      // muestra las peticiones en consola
      this.app.use(morgan("dev"));
 
      // puertos de conexión de la API
      this.app.use(cors());
 
      // solo se permiten peticiones en formato JSON
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({extended: false,}));

    }

    //configura las rutas
    routes() {
        this.app.use("/", authRoutes);
        this.app.use("/usuario", usuarioRoutes);
        this.app.use('/categorias', categoriaRoutes);
    }
}

const server = new Server();