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
 * /records:
 *   post:
 *     summary: Crear un registro emocional
 *     description: Crea un nuevo registro emocional para el usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Registros emocionales
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emotion:
 *                 type: string
 *                 example: "Feliz"
 *               intensity:
 *                 type: integer
 *                 example: 8
 *               description:
 *                 type: string
 *                 example: "Me sentí muy bien hoy"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2023-10-01"
 *     responses:
 *       201:
 *         description: Registro emocional creado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
router.post("/", async (req, res) => {
    const { emotion, intensity, description, date } = req.body;
    const userId = req.userId; // Obtiene el user_id del token JWT

    try {
        const record = await prisma.emotional_records.create({
            data: {
                user_id: userId,
                emotion,
                intensity,
                description,
                date: date ? new Date(date) : new Date(),
            },
        });
        res.status(201).json(record);
    } catch (error) {
        console.error("Error al crear registro emocional:", error);
        res.status(500).json({ error: "Error al crear registro emocional" });
    }
});

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Obtener todos los registros emocionales del usuario
 *     description: Devuelve todos los registros emocionales del usuario autenticado.
 *     tags:
 *       - Registros emocionales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros emocionales
 *       500:
 *         description: Error del servidor
 */
router.get("/", async (req, res) => {
    const userId = req.userId;

    try {
        const records = await prisma.emotional_records.findMany({
            where: { user_id: userId },
        });
        res.json(records);
    } catch (error) {
        console.error("Error al obtener registros emocionales:", error);
        res.status(500).json({ error: "Error al obtener registros emocionales" });
    }
});

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Obtener un registro emocional por ID
 *     description: Devuelve un registro emocional específico del usuario autenticado.
 *     tags:
 *       - Registros emocionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro emocional
 *     responses:
 *       200:
 *         description: Registro emocional encontrado
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", async (req, res) => {
    const userId = req.userId;
    const recordId = parseInt(req.params.id);

    try {
        const record = await prisma.emotional_records.findUnique({
            where: { record_id: recordId },
        });

        if (!record || record.user_id !== userId) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        res.json(record);
    } catch (error) {
        console.error("Error al obtener registro emocional:", error);
        res.status(500).json({ error: "Error al obtener registro emocional" });
    }
});

/**
 * @swagger
 * /records/{id}:
 *   put:
 *     summary: Actualizar un registro emocional
 *     description: Actualiza un registro emocional específico del usuario autenticado.
 *     tags:
 *       - Registros emocionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro emocional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emotion:
 *                 type: string
 *                 example: "Triste"
 *               intensity:
 *                 type: integer
 *                 example: 3
 *               description:
 *                 type: string
 *                 example: "Me sentí mal hoy"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2023-10-01"
 *     responses:
 *       200:
 *         description: Registro emocional actualizado
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", async (req, res) => {
    const userId = req.userId;
    const recordId = parseInt(req.params.id);
    const { emotion, intensity, description, date } = req.body;

    try {
        const record = await prisma.emotional_records.findUnique({
            where: { record_id: recordId },
        });

        if (!record || record.user_id !== userId) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        const updatedRecord = await prisma.emotional_records.update({
            where: { record_id: recordId },
            data: {
                emotion,
                intensity,
                description,
                date: date ? new Date(date) : record.date,
            },
        });

        res.json(updatedRecord);
    } catch (error) {
        console.error("Error al actualizar registro emocional:", error);
        res.status(500).json({ error: "Error al actualizar registro emocional" });
    }
});

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Eliminar un registro emocional
 *     description: Elimina un registro emocional específico del usuario autenticado.
 *     tags:
 *       - Registros emocionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro emocional
 *     responses:
 *       200:
 *         description: Registro emocional eliminado
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", async (req, res) => {
    const userId = req.userId;
    const recordId = parseInt(req.params.id);

    try {
        const record = await prisma.emotional_records.findUnique({
            where: { record_id: recordId },
        });

        if (!record || record.user_id !== userId) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        await prisma.emotional_records.delete({
            where: { record_id: recordId },
        });

        res.json({ message: "Registro emocional eliminado" });
    } catch (error) {
        console.error("Error al eliminar registro emocional:", error);
        res.status(500).json({ error: "Error al eliminar registro emocional" });
    }
});

module.exports = router;