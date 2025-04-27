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
 * /user-settings:
 *   post:
 *     summary: Crear configuración de usuario
 *     description: Permite a un usuario configurar sus preferencias de notificaciones y privacidad.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Configuración de Usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notification_preferences:
 *                 type: object
 *                 example: { "email": true, "sms": false }
 *               privacy_settings:
 *                 type: object
 *                 example: { "profile_visible": true, "share_activity": false }
 *     responses:
 *       201:
 *         description: Configuración guardada exitosamente
 */
router.post("/", async (req, res) => {
    const { notification_preferences, privacy_settings } = req.body;
    const userId = req.userId;

    try {
        const settings = await prisma.user_settings.create({
            data: {
                user_id: userId,
                notification_preferences,
                privacy_settings,
                created_at: new Date(),
            },
        });
        res.status(201).json(settings);
    } catch (error) {
        console.error("Error al guardar configuración:", error);
        res.status(500).json({ error: "Error al guardar configuración" });
    }
});

/**
 * @swagger
 * /user-settings:
 *   get:
 *     summary: Obtener configuración de usuario
 *     description: Devuelve la configuración de usuario autenticado.
 *     tags:
 *       - Configuración de Usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuración del usuario
 *       404:
 *         description: Configuración no encontrada
 */
router.get("/", async (req, res) => {
    const userId = req.userId;

    try {
        const settings = await prisma.user_settings.findUnique({
            where: { user_id: userId },
        });

        if (!settings) {
            return res.status(404).json({ error: "Configuración no encontrada" });
        }

        res.json(settings);
    } catch (error) {
        console.error("Error al obtener configuración:", error);
        res.status(500).json({ error: "Error al obtener configuración" });
    }
});

/**
 * @swagger
 * /user-settings:
 *   put:
 *     summary: Actualizar configuración de usuario
 *     description: Permite actualizar las preferencias de notificaciones y privacidad.
 *     tags:
 *       - Configuración de Usuario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notification_preferences:
 *                 type: object
 *                 example: { "email": false, "sms": true }
 *               privacy_settings:
 *                 type: object
 *                 example: { "profile_visible": false, "share_activity": true }
 *     responses:
 *       200:
 *         description: Configuración actualizada exitosamente
 *       404:
 *         description: Configuración no encontrada
 */
router.put("/", async (req, res) => {
    const userId = req.userId;
    const { notification_preferences, privacy_settings } = req.body;

    try {
        const settings = await prisma.user_settings.findUnique({
            where: { user_id: userId },
        });

        if (!settings) {
            return res.status(404).json({ error: "Configuración no encontrada" });
        }

        const updatedSettings = await prisma.user_settings.update({
            where: { user_id: userId },
            data: {
                notification_preferences,
                privacy_settings,
            },
        });

        res.json(updatedSettings);
    } catch (error) {
        console.error("Error al actualizar configuración:", error);
        res.status(500).json({ error: "Error al actualizar configuración" });
    }
});

/**
 * @swagger
 * /user-settings:
 *   delete:
 *     summary: Eliminar configuración de usuario
 *     description: Permite al usuario eliminar su configuración de notificaciones y privacidad.
 *     tags:
 *       - Configuración de Usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuración eliminada exitosamente
 *       404:
 *         description: Configuración no encontrada
 */
router.delete("/", async (req, res) => {
    const userId = req.userId;

    try {
        const settings = await prisma.user_settings.findUnique({
            where: { user_id: userId },
        });

        if (!settings) {
            return res.status(404).json({ error: "Configuración no encontrada" });
        }

        await prisma.user_settings.delete({
            where: { user_id: userId },
        });

        res.json({ message: "Configuración eliminada" });
    } catch (error) {
        console.error("Error al eliminar configuración:", error);
        res.status(500).json({ error: "Error al eliminar configuración" });
    }
});

module.exports = router;
