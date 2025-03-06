import pool from '../config/connection';

class ProductoModelo {

    // Método para listar productos
    public async list() {
        const result = await pool.then(async (connection) => {
            return await connection.query("SELECT id, nombre, descripcion, precio, stock, categoria_id FROM tbl_producto");
        });
        return result;
    }

    // Método para agregar un producto con validación para no duplicar
    public async add(producto: any) {
        // Verificar si ya existe un producto con el mismo nombre, descripción y categoría
        const existingProduct = await pool.then(async (connection) => {
            const query = "SELECT * FROM tbl_producto WHERE nombre = ? AND descripcion = ? AND categoria_id = ?";
            return await connection.query(query, [producto.nombre, producto.descripcion, producto.categoria_id]);
        });

        if (existingProduct.length > 0) {
            throw new Error("Ya existe un producto con la misma información.");
        }

        // Si no existe, insertamos el producto
        const result = await pool.then(async (connection) => {
            return await connection.query("INSERT INTO tbl_producto SET ?", [producto]);
        });
        return result;
    }

    // Método para actualizar un producto con validación de existencia y no duplicidad
    public async update(producto: any) {
        // Verificar si el producto existe
        const existingProduct = await pool.then(async (connection) => {
            const query = "SELECT * FROM tbl_producto WHERE id = ?";
            return await connection.query(query, [producto.id]);
        });

        if (existingProduct.length === 0) {
            throw new Error("El producto que deseas actualizar no existe.");
        }

        // Verificar si ya existe otro producto con el mismo nombre, descripción y categoría (excepto el producto actual)
        const duplicateProduct = await pool.then(async (connection) => {
            const query = "SELECT * FROM tbl_producto WHERE nombre = ? AND descripcion = ? AND categoria_id = ? AND id != ?";
            return await connection.query(query, [producto.nombre, producto.descripcion, producto.categoria_id, producto.id]);
        });

        if (duplicateProduct.length > 0) {
            throw new Error("Ya existe un producto con los mismos datos (nombre, descripción y categoría).");
        }

        // Si todo está bien, se actualiza el producto
        const query = "UPDATE tbl_producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ? WHERE id = ?";
        const result = await pool.then(async (connection) => {
            return await connection.query(query, [producto.nombre, producto.descripcion, producto.precio, producto.stock, producto.categoria_id, producto.id]);
        });
        return result;
    }

    // Método para eliminar un producto con validación de existencia
    public async delete(id: number) {
        // Verificar si el producto existe
        const existingProduct = await pool.then(async (connection) => {
            const query = "SELECT * FROM tbl_producto WHERE id = ?";
            return await connection.query(query, [id]);
        });

        if (existingProduct.length === 0) {
            throw new Error("El producto que deseas eliminar no existe.");
        }

        // Si existe, se elimina el producto
        const result = await pool.then(async (connection) => {
            return await connection.query("DELETE FROM tbl_producto WHERE id = ?", [id]);
        });
        return result;
    }
}

const model = new ProductoModelo();
export default model;
