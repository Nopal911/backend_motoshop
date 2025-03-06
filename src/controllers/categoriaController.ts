import { Request, Response } from "express";
import model from "../models/categoriaModelo";

class CategoriaController {

    public async list(req: Request, res: Response) {
        try {
            const categorias = await model.list();
            return res.json({
                message: "Listado de Categorías",
                categorias: categorias,
                code: 200,
            });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async add(req: Request, res: Response) {
        try {
            const { nombre } = req.body;

            // Validación de datos
            if (!nombre || nombre.trim() === "") {
                return res.status(400).json({ message: "El nombre es requerido", code: 1 });
            }

            // Verificación de que no existe la categoría
            const existingCategory = await model.list();
            if (existingCategory.some((cat: { nombre: string }) => cat.nombre.toLowerCase() === nombre.toLowerCase())) {
                return res.status(400).json({ message: "La categoría ya existe", code: 2 });
            }

            await model.add({ nombre });

            return res.json({ message: "Categoría agregada correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { id, nombre } = req.body;

            // Validación de datos
            if (!id || !nombre || nombre.trim() === "") {
                return res.status(400).json({ message: "ID y nombre son requeridos", code: 1 });
            }

            // Verificación de que la categoría existe
            const categories = await model.list();
            const category = categories.find((cat: { id: number }) => cat.id === id);
            if (!category) {
                return res.status(404).json({ message: "Categoría no encontrada", code: 3 });
            }

            await model.update({ id, nombre });

            return res.json({ message: "Categoría actualizada correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { id } = req.body;

            // Validación de datos
            if (!id) {
                return res.status(400).json({ message: "El ID es requerido", code: 1 });
            }

            // Verificación de que la categoría existe
            const categories = await model.list();
            const category = categories.find((cat: { id: number }) => cat.id === id);
            if (!category) {
                return res.status(404).json({ message: "Categoría no encontrada", code: 3 });
            }

            await model.delete(id);
            return res.json({ message: "Categoría eliminada correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }
}

export const categoriaController = new CategoriaController();
