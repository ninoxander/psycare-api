const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { generateToken } = require("../utils/auth");

const prisma = new PrismaClient();
const router = express.Router();


/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Permite a los usuarios registrarse en la plataforma proporcionando su nombre, email y contraseña.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Daniela"
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 example: "daniela@example.com"
 *                 description: Email del usuario (debe ser único)
 *               password:
 *                 type: string
 *                 example: "contraseña_segura"
 *                 description: Contraseña del usuario (se almacenará cifrada)
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT generado para el usuario
 *                 users:
 *                   type: object
 *                   properties:
 *                     users_id:
 *                       type: integer
 *                       description: ID único del usuario
 *                     name:
 *                       type: string
 *                       description: Nombre del usuario
 *                     email:
 *                       type: string
 *                       description: Email del usuario
 *                     password:
 *                       type: string
 *                       description: Contraseña cifrada del usuario
 *       400:
 *         description: Error en la solicitud (por ejemplo, campos faltantes o email ya registrado)
 *       500:
 *         description: Error del servidor al procesar la solicitud
 */
router.post("/", async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Datos recibidos:", { name, email, password });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const users = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        const token = generateToken(users.users_id);
        res.json({ token, users });
    } catch (error) {
        console.error("Error completo:", error); 
        res.status(500).json({ 
            error: "Error al registrar el usuario", 
            details: error.message, 
            wholeError: error 
        });
    }
});

module.exports = router;