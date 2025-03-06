import pool from '../config/connection';

class CategoriaModelo {
    
    public async list() {
        const result = await pool.then(async (connection) => {
            return await connection.query("SELECT id, nombre FROM tbl_categoria");
        });
        return result;
    }

    public async add(categoria: any) {
        const result = await pool.then(async (connection) => {
            return await connection.query("INSERT INTO tbl_categoria SET ?", [categoria]);
        });
        return result;
    }

    public async update(categoria: any) {
        const query = "UPDATE tbl_categoria SET nombre = ? WHERE id = ?";
        const result = await pool.then(async (connection) => {
            return await connection.query(query, [categoria.nombre, categoria.id]);
        });
        return result;
    }

    public async delete(id: number) {
        const result = await pool.then(async (connection) => {
            return await connection.query("DELETE FROM tbl_categoria WHERE id = ?", [id]);
        });
        return result;
    }
}

const model = new CategoriaModelo();
export default model;
