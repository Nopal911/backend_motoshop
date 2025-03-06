import { Request, Response } from "express";
import validator from "validator";
import model from "../models/authModelo";
import jwt from 'jsonwebtoken'
import { utils } from "../utils/utils";
import dotenv from 'dotenv';

class AuthController {

  public async iniciarSesion(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (validator.isEmpty(email.trim()) || validator.isEmpty(password.trim())) {
        return res.status(400).json({ message: "Los campos son requeridos", code: 1 });
      }

      const lstUsers = await model.getuserByEmail(email);
      if (lstUsers.length <= 0) {
        return res.status(404).json({ message: "El usuario y/o contraseña es incorrecto", code: 1 });
      }

      const result = utils.checkPassword(password, lstUsers[0].password);
      result.then((isValid) => {
        if (isValid) {
          const newUser = {
            email: lstUsers[0].email,
            role: lstUsers[0].role
          };

          const token = jwt.sign(newUser, process.env.SECRET || 'default_secret', { expiresIn: '1h' });

          return res.json({ message: "Autenticación correcta", token, code: 0 });
        } else {
          return res.status(401).json({ message: "Password Incorrecto", code: 1 });
        }
      }).catch((error) => {
        return res.status(500).json({ message: `Error en la verificación de contraseña: ${error.message}` });
      });

    } catch (error: any) {
      return res.status(500).json({ message: `Error interno: ${error.message}` });
    }
  }

  public async saludar(req: Request, res: Response) {
    const { nombre, correo, edad } = req.query;
    return res.json({ nombre, correo, edad });
  }
}
export const authController = new AuthController();
