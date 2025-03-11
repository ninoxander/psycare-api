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
 * /questionnaires:
 *   post:
 *     summary: Crear un nuevo cuestionario
 *     description: Permite a un usuario registrar un cuestionario con sus respuestas.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cuestionarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "Ansiedad"
 *               responses:
 *                 type: object
 *                 example: { "pregunta_1": "Sí", "pregunta_2": "No", "pregunta_3": "A veces" }
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-10"
 *     responses:
 *       201:
 *         description: Cuestionario creado exitosamente
 */
router.post("/", async (req, res) => {
    const { type, responses, date } = req.body;
    const userId = req.userId;

    try {
        const questionnaire = await prisma.questionnaires.create({
            data: {
                user_id: userId,
                type,
                responses,
                date: date ? new Date(date) : new Date(),
                created_at: new Date(),
            },
        });
        res.status(201).json(questionnaire);
    } catch (error) {
        console.error("Error al crear cuestionario:", error);
        res.status(500).json({ error: "Error al crear cuestionario" });
    }
});

/**
 * @swagger
 * /questionnaires:
 *   get:
 *     summary: Obtener todos los cuestionarios del usuario
 *     description: Devuelve todos los cuestionarios del usuario autenticado.
 *     tags:
 *       - Cuestionarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cuestionarios del usuario
 */
router.get("/", async (req, res) => {
    const userId = req.userId;

    try {
        const questionnaires = await prisma.questionnaires.findMany({
            where: { user_id: userId },
        });
        res.json(questionnaires);
    } catch (error) {
        console.error("Error al obtener cuestionarios:", error);
        res.status(500).json({ error: "Error al obtener cuestionarios" });
    }
});

/**
 * @swagger
 * /questionnaires/{id}:
 *   get:
 *     summary: Obtener un cuestionario por ID
 *     description: Devuelve un cuestionario específico del usuario autenticado.
 *     tags:
 *       - Cuestionarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cuestionario
 *     responses:
 *       200:
 *         description: Cuestionario encontrado
 *       404:
 *         description: Cuestionario no encontrado
 */
router.get("/:id", async (req, res) => {
    const userId = req.userId;
    const questionnaireId = parseInt(req.params.id);

    try {
        const questionnaire = await prisma.questionnaires.findUnique({
            where: { questionnaire_id: questionnaireId },
        });

        if (!questionnaire || questionnaire.user_id !== userId) {
            return res.status(404).json({ error: "Cuestionario no encontrado" });
        }

        res.json(questionnaire);
    } catch (error) {
        console.error("Error al obtener cuestionario:", error);
        res.status(500).json({ error: "Error al obtener cuestionario" });
    }
});

/**
 * @swagger
 * /questionnaires/{id}:
 *   put:
 *     summary: Actualizar un cuestionario
 *     description: Permite actualizar las respuestas de un cuestionario del usuario autenticado.
 *     tags:
 *       - Cuestionarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cuestionario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               responses:
 *                 type: object
 *                 example: { "pregunta_1": "No", "pregunta_2": "Sí", "pregunta_3": "Frecuentemente" }
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-15"
 *     responses:
 *       200:
 *         description: Cuestionario actualizado exitosamente
 *       404:
 *         description: Cuestionario no encontrado
 */
router.put("/:id", async (req, res) => {
    const userId = req.userId;
    const questionnaireId = parseInt(req.params.id);
    const { responses, date } = req.body;

    try {
        const questionnaire = await prisma.questionnaires.findUnique({
            where: { questionnaire_id: questionnaireId },
        });

        if (!questionnaire || questionnaire.user_id !== userId) {
            return res.status(404).json({ error: "Cuestionario no encontrado" });
        }

        const updatedQuestionnaire = await prisma.questionnaires.update({
            where: { questionnaire_id: questionnaireId },
            data: {
                responses,
                date: date ? new Date(date) : questionnaire.date,
            },
        });

        res.json(updatedQuestionnaire);
    } catch (error) {
        console.error("Error al actualizar cuestionario:", error);
        res.status(500).json({ error: "Error al actualizar cuestionario" });
    }
});

/**
 * @swagger
 * /questionnaires/{id}:
 *   delete:
 *     summary: Eliminar un cuestionario
 *     description: Permite al usuario eliminar uno de sus cuestionarios.
 *     tags:
 *       - Cuestionarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cuestionario
 *     responses:
 *       200:
 *         description: Cuestionario eliminado exitosamente
 *       404:
 *         description: Cuestionario no encontrado
 */
router.delete("/:id", async (req, res) => {
    const userId = req.userId;
    const questionnaireId = parseInt(req.params.id);

    try {
        const questionnaire = await prisma.questionnaires.findUnique({
            where: { questionnaire_id: questionnaireId },
        });

        if (!questionnaire || questionnaire.user_id !== userId) {
            return res.status(404).json({ error: "Cuestionario no encontrado" });
        }

        await prisma.questionnaires.delete({
            where: { questionnaire_id: questionnaireId },
        });

        res.json({ message: "Cuestionario eliminado" });
    } catch (error) {
        console.error("Error al eliminar cuestionario:", error);
        res.status(500).json({ error: "Error al eliminar cuestionario" });
    }
});

module.exports = router;
