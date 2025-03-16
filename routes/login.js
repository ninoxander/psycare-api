const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { generateToken } = require("../utils/auth");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Permite a los usuarios iniciar sesión con su email y contraseña.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ninoxander@ninoxit.me"
 *               password:
 *                 type: string
 *                 example: "passwordsegura"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Faltan campos obligatorios
 *       401:
 *         description: Contraseña incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post("/", async (req, res) => {
    const { email, password } = req.body;
    console.log("Datos recibidos:", { email, password });

    try {
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        const token = generateToken(user.user_id);

        res.json({
            token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                created_at: user.created_at,
            },
        });
    } catch (error) {
        console.error("Error en /login:", error);
        res.status(500).json({ error: "Error al iniciar sesión", details: error.message });
    }
});

module.exports = router;