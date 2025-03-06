import { Request, Response } from "express";
import validator from "validator";
import model from "../models/usuarioModelo";
import { utils } from "../utils/utils";
//import model from "../models/usuarioModel";


class UsuarioController {


  public async list(req: Request, res: Response) {
    try {
      const usuarios = await model.list();
      return res.json({
        message: "Listado de Usuario",
        usuarios: usuarios,
        code: 200,
      });
    } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
    }

  }


  public async add(req: Request, res: Response) {
    try {
        let { email, password, role } = req.body;
        //se cambio const a let, ya que let si puede cambiar su valor y es necesario para que se pueda encriptar la contraseña;


        // Validar si el email es válido
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: "Email inválido o requerido", code: 1 });
        }
        // Obtener la lista de usuarios para verificar si el email ya existe
        const usuarios = await model.list();
        const usuarioExistente = usuarios.some((usuario: any) => usuario.email === email);

        if (usuarioExistente) {
            return res.status(400).json({ message: "El email ya está en uso", code: 2 });
        }
        
        //encriptar contraseña
        //console.log(usuarioExistente);
        var encryptedText = await utils.hashPassword(password);
        password = encryptedText;
      
        // Agregar el usuario a la tabla tbl_usuario
        await model.add({ email, password, role });

        return res.json({ message: "Usuario agregado correctamente", code: 0 });
    } catch (error: any) {
        return res.status(500).json({ message: `${error.message}` });
    }
}

public async update(req: Request, res: Response) {
  try {
      const { email, password } = req.body;

      // Validar que se haya proporcionado un email
      if (!email || !validator.isEmail(email)) {
          return res.status(400).json({ message: "Email inválido o requerido", code: 1 });
      }

      // Verificar si el usuario existe
      const usuarios = await model.list();
      const usuarioExistente = usuarios.some((usuario: any) => usuario.email === email);

      if (!usuarioExistente) {
          return res.status(404).json({ message: "Usuario no encontrado", code: 3 });
      }

      // Encriptar la contraseña antes de actualizarla
      var encryptedText = await utils.hashPassword(password);
      
      // Realizar la actualización con la contraseña encriptada
      await model.update({ email, password: encryptedText });

      return res.json({ message: "Usuario actualizado correctamente", code: 0 });
  } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
  }
}

  


public async delete(req: Request, res: Response) {
  try {
      const { email } = req.body;

      // Validar que se haya proporcionado un email
      if (!email || !validator.isEmail(email)) {
          return res.status(400).json({ message: "Email inválido o requerido", code: 1 });
      }

      // Verificar si el usuario existe
      const usuarios = await model.list();
      const usuarioExistente = usuarios.some((usuario: any) => usuario.email === email);

      if (!usuarioExistente) {
          return res.status(404).json({ message: "Usuario no encontrado", code: 3 });
      }

      // Realizar la eliminación
      await model.delete(email);
      return res.json({ message: "Usuario eliminado correctamente", code: 0 });
  } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
  }
}
}
export const usuarioController = new UsuarioController();