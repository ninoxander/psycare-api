const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const router = express.Router();

const _auth = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: "Acceso no autorizado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};
router.use(_auth);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     description: Devuelve la información del usuario autenticado, incluyendo bio y pronouns.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Juan Pérez"
 *                 email:
 *                   type: string
 *                   example: "juan@example.com"
 *                 bio:
 *                   type: string
 *                   example: "Amante de la tecnología y el café."
 *                 pronouns:
 *                   type: string
 *                   example: "él/ella"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-10T12:00:00Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-10T12:00:00Z"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/", async (req, res) => {
    const userId = req.userId;

    try {
        const user = await prisma.users.findUnique({
            where: { user_id: userId },
            select: {
                user_id: true,
                name: true,
                email: true,
                bio: true,
                pronouns: true,
                created_at: true,
                updated_at: true,
                age: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error al obtener información del usuario:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Actualizar información del usuario autenticado
 *     description: Actualiza la información del usuario autenticado, incluyendo bio y pronouns.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 example: "juan@example.com"
 *               bio:
 *                 type: string
 *                 example: "Amante de la tecnología y el café."
 *               pronouns:
 *                 type: string
 *                 example: "él/ella"
 *     responses:
 *       200:
 *         description: Información del usuario actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Juan Pérez"
 *                 email:
 *                   type: string
 *                   example: "juan@example.com"
 *                 bio:
 *                   type: string
 *                   example: "Amante de la tecnología y el café."
 *                 pronouns:
 *                   type: string
 *                   example: "él/ella"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-10T12:00:00Z"
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.put("/", async (req, res) => {
    const userId = req.userId;
    const { name, email, bio, pronouns } = req.body;

    try {
        const updatedUser = await prisma.users.update({
            where: { user_id: userId },
            data: {
                name,
                email,
                bio,
                pronouns,
                updated_at: new Date(),
            },
            select: {
                user_id: true,
                name: true,
                email: true,
                bio: true,
                pronouns: true,
                updated_at: true,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error("Error al actualizar información del usuario:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Eliminar cuenta del usuario autenticado
 *     description: Elimina la cuenta del usuario autenticado y todos sus datos asociados.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta eliminada exitosamente
 *       500:
 *         description: Error del servidor
 */
router.delete("/", async (req, res) => {
    const userId = req.userId;

    try {
        await prisma.users.delete({
            where: { user_id: userId },
        });

        res.json({ message: "Cuenta eliminada exitosamente" });
    } catch (error) {
        console.error("Error al eliminar cuenta:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;