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
 * /notifications:
 *   post:
 *     summary: Crear una nueva notificación
 *     description: Crea una notificación para el usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Notificaciones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Tienes un nuevo mensaje"
 *               type:
 *                 type: string
 *                 example: "Mensaje"
 *               read_status:
 *                 type: string
 *                 example: "No leído"
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 */
router.post("/", async (req, res) => {
    const { message, type, read_status } = req.body;
    const userId = req.userId;

    try {
        const notification = await prisma.notifications.create({
            data: {
                user_id: userId,
                message,
                type,
                read_status: read_status || "No leído",
                date: new Date(),
            },
        });
        res.status(201).json(notification);
    } catch (error) {
        console.error("Error al crear notificación:", error);
        res.status(500).json({ error: "Error al crear notificación" });
    }
});

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Obtener todas las notificaciones del usuario
 *     description: Devuelve todas las notificaciones del usuario autenticado.
 *     tags:
 *       - Notificaciones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones del usuario
 */
router.get("/", async (req, res) => {
    const userId = req.userId;

    try {
        const notifications = await prisma.notifications.findMany({
            where: { user_id: userId },
        });
        res.json(notifications);
    } catch (error) {
        console.error("Error al obtener notificaciones:", error);
        res.status(500).json({ error: "Error al obtener notificaciones" });
    }
});

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Obtener una notificación por ID
 *     description: Devuelve una notificación específica del usuario autenticado.
 *     tags:
 *       - Notificaciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación encontrada
 *       404:
 *         description: Notificación no encontrada
 */
router.get("/:id", async (req, res) => {
    const userId = req.userId;
    const notificationId = parseInt(req.params.id);

    try {
        const notification = await prisma.notifications.findUnique({
            where: { notification_id: notificationId },
        });

        if (!notification || notification.user_id !== userId) {
            return res.status(404).json({ error: "Notificación no encontrada" });
        }

        res.json(notification);
    } catch (error) {
        console.error("Error al obtener notificación:", error);
        res.status(500).json({ error: "Error al obtener notificación" });
    }
});

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     summary: Actualizar una notificación
 *     description: Actualiza una notificación específica del usuario autenticado.
 *     tags:
 *       - Notificaciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Tu pedido ha sido enviado"
 *               type:
 *                 type: string
 *                 example: "Pedido"
 *               read_status:
 *                 type: string
 *                 example: "Leído"
 *     responses:
 *       200:
 *         description: Notificación actualizada exitosamente
 *       404:
 *         description: Notificación no encontrada
 */
router.put("/:id", async (req, res) => {
    const userId = req.userId;
    const notificationId = parseInt(req.params.id);
    const { message, type, read_status } = req.body;

    try {
        const notification = await prisma.notifications.findUnique({
            where: { notification_id: notificationId },
        });

        if (!notification || notification.user_id !== userId) {
            return res.status(404).json({ error: "Notificación no encontrada" });
        }

        const updatedNotification = await prisma.notifications.update({
            where: { notification_id: notificationId },
            data: {
                message,
                type,
                read_status,
            },
        });

        res.json(updatedNotification);
    } catch (error) {
        console.error("Error al actualizar notificación:", error);
        res.status(500).json({ error: "Error al actualizar notificación" });
    }
});

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Eliminar una notificación
 *     description: Elimina una notificación específica del usuario autenticado.
 *     tags:
 *       - Notificaciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación eliminada exitosamente
 *       404:
 *         description: Notificación no encontrada
 */
router.delete("/:id", async (req, res) => {
    const userId = req.userId;
    const notificationId = parseInt(req.params.id);

    try {
        const notification = await prisma.notifications.findUnique({
            where: { notification_id: notificationId },
        });

        if (!notification || notification.user_id !== userId) {
            return res.status(404).json({ error: "Notificación no encontrada" });
        }

        await prisma.notifications.delete({
            where: { notification_id: notificationId },
        });

        res.json({ message: "Notificación eliminada" });
    } catch (error) {
        console.error("Error al eliminar notificación:", error);
        res.status(500).json({ error: "Error al eliminar notificación" });
    }
});

module.exports = router;
