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
 * /sessions:
 *   post:
 *     summary: Crear una nueva sesión
 *     description: Crea una sesión entre un paciente y un profesional.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sesiones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               professional_id:
 *                 type: integer
 *                 example: 2
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-03-10T14:00:00Z"
 *               notes:
 *                 type: string
 *                 example: "El paciente mostró progreso en la terapia"
 *     responses:
 *       201:
 *         description: Sesión creada exitosamente
 */
router.post("/", async (req, res) => {
    const { professional_id, date, notes } = req.body;
    const patient_id = req.userId;

    try {
        const session = await prisma.sessions.create({
            data: {
                patient_id,
                professional_id,
                date: date ? new Date(date) : new Date(),
                notes,
                created_at: new Date(),
            },
        });
        res.status(201).json(session);
    } catch (error) {
        console.error("Error al crear sesión:", error);
        res.status(500).json({ error: "Error al crear sesión" });
    }
});

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Obtener todas las sesiones del usuario
 *     description: Devuelve todas las sesiones en las que el usuario está involucrado como paciente o profesional.
 *     tags:
 *       - Sesiones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sesiones del usuario
 */
router.get("/", async (req, res) => {
    const userId = req.userId;

    try {
        const sessions = await prisma.sessions.findMany({
            where: {
                OR: [{ patient_id: userId }, { professional_id: userId }],
            },
        });
        res.json(sessions);
    } catch (error) {
        console.error("Error al obtener sesiones:", error);
        res.status(500).json({ error: "Error al obtener sesiones" });
    }
});

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Obtener una sesión por ID
 *     description: Devuelve una sesión específica si el usuario es paciente o profesional en ella.
 *     tags:
 *       - Sesiones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sesión
 *     responses:
 *       200:
 *         description: Sesión encontrada
 *       404:
 *         description: Sesión no encontrada
 */
router.get("/:id", async (req, res) => {
    const userId = req.userId;
    const sessionId = parseInt(req.params.id);

    try {
        const session = await prisma.sessions.findUnique({
            where: { session_id: sessionId },
        });

        if (!session || (session.patient_id !== userId && session.professional_id !== userId)) {
            return res.status(404).json({ error: "Sesión no encontrada" });
        }

        res.json(session);
    } catch (error) {
        console.error("Error al obtener sesión:", error);
        res.status(500).json({ error: "Error al obtener sesión" });
    }
});

/**
 * @swagger
 * /sessions/{id}:
 *   put:
 *     summary: Actualizar una sesión
 *     description: Permite actualizar la fecha y notas de una sesión si el usuario es el paciente o profesional involucrado.
 *     tags:
 *       - Sesiones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-03-15T10:30:00Z"
 *               notes:
 *                 type: string
 *                 example: "El paciente ha mejorado en la terapia"
 *     responses:
 *       200:
 *         description: Sesión actualizada exitosamente
 *       404:
 *         description: Sesión no encontrada
 */
router.put("/:id", async (req, res) => {
    const userId = req.userId;
    const sessionId = parseInt(req.params.id);
    const { date, notes } = req.body;

    try {
        const session = await prisma.sessions.findUnique({
            where: { session_id: sessionId },
        });

        if (!session || (session.patient_id !== userId && session.professional_id !== userId)) {
            return res.status(404).json({ error: "Sesión no encontrada" });
        }

        const updatedSession = await prisma.sessions.update({
            where: { session_id: sessionId },
            data: {
                date: date ? new Date(date) : session.date,
                notes,
            },
        });

        res.json(updatedSession);
    } catch (error) {
        console.error("Error al actualizar sesión:", error);
        res.status(500).json({ error: "Error al actualizar sesión" });
    }
});

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Eliminar una sesión
 *     description: Permite eliminar una sesión si el usuario es el paciente o profesional involucrado.
 *     tags:
 *       - Sesiones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sesión
 *     responses:
 *       200:
 *         description: Sesión eliminada exitosamente
 *       404:
 *         description: Sesión no encontrada
 */
router.delete("/:id", async (req, res) => {
    const userId = req.userId;
    const sessionId = parseInt(req.params.id);

    try {
        const session = await prisma.sessions.findUnique({
            where: { session_id: sessionId },
        });

        if (!session || (session.patient_id !== userId && session.professional_id !== userId)) {
            return res.status(404).json({ error: "Sesión no encontrada" });
        }

        await prisma.sessions.delete({
            where: { session_id: sessionId },
        });

        res.json({ message: "Sesión eliminada" });
    } catch (error) {
        console.error("Error al eliminar sesión:", error);
        res.status(500).json({ error: "Error al eliminar sesión" });
    }
});

module.exports = router;
