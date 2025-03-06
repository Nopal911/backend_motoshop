import { Router } from "express";
import { categoriaController } from "../controllers/categoriaController";

class CategoriaRoutes {

    public router: Router;

    constructor() {
        this.router = Router();
        this.config();
    }

    private config() {
        this.router.get('/', categoriaController.list);
        this.router.post('/', categoriaController.add);
        this.router.put('/', categoriaController.update);
        this.router.delete('/', categoriaController.delete);
    }
}

const categoriaRoutes = new CategoriaRoutes();
export default categoriaRoutes.router;
