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
 * /alerts:
 *   post:
 *     summary: Crear una nueva alerta
 *     description: Permite a un usuario crear una alerta.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Alertas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "Emergencia"
 *               description:
 *                 type: string
 *                 example: "Se ha detectado un problema de salud"
 *               status:
 *                 type: string
 *                 example: "Pendiente"
 *     responses:
 *       201:
 *         description: Alerta creada exitosamente
 */
router.post("/", async (req, res) => {
    const { type, description, status } = req.body;
    const userId = req.userId;

    try {
        const alert = await prisma.alerts.create({
            data: {
                user_id: userId,
                type,
                description,
                date: new Date(),
                status: status || "Pendiente",
            },
        });
        res.status(200).json(alert);
    } catch (error) {
        console.error("Error al crear alerta:", error);
        res.status(500).json({ error: "Error al crear alerta" });
    }
});

/**
 * @swagger
 * /alerts:
 *   get:
 *     summary: Obtener todas las alertas del usuario
 *     description: Devuelve todas las alertas creadas por el usuario autenticado.
 *     tags:
 *       - Alertas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alertas del usuario
 */
router.get("/", async (req, res) => {
    const userId = req.userId;

    try {
        const alerts = await prisma.alerts.findMany({
            where: { user_id: userId },
        });
        res.json(alerts);
    } catch (error) {
        console.error("Error al obtener alertas:", error);
        res.status(500).json({ error: "Error al obtener alertas" });
    }
});

/**
 * @swagger
 * /alerts/{id}:
 *   get:
 *     summary: Obtener una alerta por ID
 *     description: Devuelve una alerta específica del usuario autenticado.
 *     tags:
 *       - Alertas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la alerta
 *     responses:
 *       200:
 *         description: Alerta encontrada
 *       404:
 *         description: Alerta no encontrada
 */
router.get("/:id", async (req, res) => {
    const userId = req.userId;
    const alertId = parseInt(req.params.id);

    try {
        const alert = await prisma.alerts.findUnique({
            where: { alert_id: alertId },
        });

        if (!alert || alert.user_id !== userId) {
            return res.status(404).json({ error: "Alerta no encontrada" });
        }

        res.json(alert);
    } catch (error) {
        console.error("Error al obtener alerta:", error);
        res.status(500).json({ error: "Error al obtener alerta" });
    }
});

/**
 * @swagger
 * /alerts/{id}:
 *   put:
 *     summary: Actualizar una alerta
 *     description: Permite actualizar el estado o descripción de una alerta del usuario autenticado.
 *     tags:
 *       - Alertas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la alerta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Se ha resuelto el problema de salud"
 *               status:
 *                 type: string
 *                 example: "Resuelta"
 *     responses:
 *       200:
 *         description: Alerta actualizada exitosamente
 *       404:
 *         description: Alerta no encontrada
 */
router.put("/:id", async (req, res) => {
    const userId = req.userId;
    const alertId = parseInt(req.params.id);
    const { description, status } = req.body;

    try {
        const alert = await prisma.alerts.findUnique({
            where: { alert_id: alertId },
        });

        if (!alert || alert.user_id !== userId) {
            return res.status(404).json({ error: "Alerta no encontrada" });
        }

        const updatedAlert = await prisma.alerts.update({
            where: { alert_id: alertId },
            data: {
                description,
                status,
            },
        });

        res.json(updatedAlert);
    } catch (error) {
        console.error("Error al actualizar alerta:", error);
        res.status(500).json({ error: "Error al actualizar alerta" });
    }
});

/**
 * @swagger
 * /alerts/{id}:
 *   delete:
 *     summary: Eliminar una alerta
 *     description: Permite al usuario eliminar una alerta.
 *     tags:
 *       - Alertas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la alerta
 *     responses:
 *       200:
 *         description: Alerta eliminada exitosamente
 *       404:
 *         description: Alerta no encontrada
 */
router.delete("/:id", async (req, res) => {
    const userId = req.userId;
    const alertId = parseInt(req.params.id);

    try {
        const alert = await prisma.alerts.findUnique({
            where: { alert_id: alertId },
        });

        if (!alert || alert.user_id !== userId) {
            return res.status(404).json({ error: "Alerta no encontrada" });
        }

        await prisma.alerts.delete({
            where: { alert_id: alertId },
        });

        res.json({ message: "Alerta eliminada" });
    } catch (error) {
        console.error("Error al eliminar alerta:", error);
        res.status(500).json({ error: "Error al eliminar alerta" });
    }
});

module.exports = router;
