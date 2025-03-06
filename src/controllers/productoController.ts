import { Request, Response } from "express";
import model from "../models/productoModelo";

class ProductoController {

    public async list(req: Request, res: Response) {
        try {
            const productos = await model.list();
            return res.json({
                message: "Listado de Productos",
                productos: productos,
                code: 200,
            });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async add(req: Request, res: Response) {
        try {
            const { nombre, descripcion, precio, stock, categoria_id } = req.body;

            if (!nombre || !descripcion || !precio || !stock || !categoria_id) {
                return res.status(400).json({ message: "Todos los campos son requeridos.", code: 1 });
            }

            await model.add({ nombre, descripcion, precio, stock, categoria_id });

            return res.json({ message: "Producto agregado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { id, nombre, descripcion, precio, stock, categoria_id } = req.body;

            if (!id || !nombre || !descripcion || !precio || !stock || !categoria_id) {
                return res.status(400).json({ message: "Todos los campos son requeridos.", code: 1 });
            }

            await model.update({ id, nombre, descripcion, precio, stock, categoria_id });

            return res.json({ message: "Producto actualizado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ message: "El ID es requerido", code: 1 });
            }

            await model.delete(id);
            return res.json({ message: "Producto eliminado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }
}

export const productoController = new ProductoController();
