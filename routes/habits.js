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
 * /habits:
 *   post:
 *     summary: Crear un nuevo hábito
 *     description: Crea un hábito para el usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Hábitos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               habit_type:
 *                 type: string
 *                 example: "Ejercicio"
 *               description:
 *                 type: string
 *                 example: "Correr 5km cada mañana"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-10"
 *     responses:
 *       201:
 *         description: Hábito creado exitosamente
 */
router.post("/", async (req, res) => {
    const { habit_type, description, date } = req.body;
    const userId = req.userId;

    try {
        const habit = await prisma.habits.create({
            data: {
                user_id: userId,
                habit_type,
                description,
                date: date ? new Date(date) : new Date(),
                created_at: new Date(),
            },
        });
        res.status(201).json(habit);
    } catch (error) {
        console.error("Error al crear hábito:", error);
        res.status(500).json({ error: "Error al crear hábito" });
    }
});

/**
 * @swagger
 * /habits:
 *   get:
 *     summary: Obtener todos los hábitos del usuario
 *     description: Devuelve todos los hábitos del usuario autenticado.
 *     tags:
 *       - Hábitos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de hábitos del usuario
 */
router.get("/", async (req, res) => {
    const userId = req.userId;

    try {
        const habits = await prisma.habits.findMany({
            where: { user_id: userId },
        });
        res.json(habits);
    } catch (error) {
        console.error("Error al obtener hábitos:", error);
        res.status(500).json({ error: "Error al obtener hábitos" });
    }
});

/**
 * @swagger
 * /habits/{id}:
 *   get:
 *     summary: Obtener un hábito por ID
 *     description: Devuelve un hábito específico del usuario autenticado.
 *     tags:
 *       - Hábitos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del hábito
 *     responses:
 *       200:
 *         description: Hábito encontrado
 *       404:
 *         description: Hábito no encontrado
 */
router.get("/:id", async (req, res) => {
    const userId = req.userId;
    const habitId = parseInt(req.params.id);

    try {
        const habit = await prisma.habits.findUnique({
            where: { habit_id: habitId },
        });

        if (!habit || habit.user_id !== userId) {
            return res.status(404).json({ error: "Hábito no encontrado" });
        }

        res.json(habit);
    } catch (error) {
        console.error("Error al obtener hábito:", error);
        res.status(500).json({ error: "Error al obtener hábito" });
    }
});

/**
 * @swagger
 * /habits/{id}:
 *   put:
 *     summary: Actualizar un hábito
 *     description: Actualiza un hábito específico del usuario autenticado.
 *     tags:
 *       - Hábitos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del hábito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               habit_type:
 *                 type: string
 *                 example: "Meditación"
 *               description:
 *                 type: string
 *                 example: "Meditar 10 minutos diarios"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-15"
 *     responses:
 *       200:
 *         description: Hábito actualizado exitosamente
 *       404:
 *         description: Hábito no encontrado
 */
router.put("/:id", async (req, res) => {
    const userId = req.userId;
    const habitId = parseInt(req.params.id);
    const { habit_type, description, date } = req.body;

    try {
        const habit = await prisma.habits.findUnique({
            where: { habit_id: habitId },
        });

        if (!habit || habit.user_id !== userId) {
            return res.status(404).json({ error: "Hábito no encontrado" });
        }

        const updatedHabit = await prisma.habits.update({
            where: { habit_id: habitId },
            data: {
                habit_type,
                description,
                date: date ? new Date(date) : habit.date,
            },
        });

        res.json(updatedHabit);
    } catch (error) {
        console.error("Error al actualizar hábito:", error);
        res.status(500).json({ error: "Error al actualizar hábito" });
    }
});

/**
 * @swagger
 * /habits/{id}:
 *   delete:
 *     summary: Eliminar un hábito
 *     description: Elimina un hábito específico del usuario autenticado.
 *     tags:
 *       - Hábitos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del hábito
 *     responses:
 *       200:
 *         description: Hábito eliminado exitosamente
 *       404:
 *         description: Hábito no encontrado
 */
router.delete("/:id", async (req, res) => {
    const userId = req.userId;
    const habitId = parseInt(req.params.id);

    try {
        const habit = await prisma.habits.findUnique({
            where: { habit_id: habitId },
        });

        if (!habit || habit.user_id !== userId) {
            return res.status(404).json({ error: "Hábito no encontrado" });
        }

        await prisma.habits.delete({
            where: { habit_id: habitId },
        });

        res.json({ message: "Hábito eliminado" });
    } catch (error) {
        console.error("Error al eliminar hábito:", error);
        res.status(500).json({ error: "Error al eliminar hábito" });
    }
});

module.exports = router;
