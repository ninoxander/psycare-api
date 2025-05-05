const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /forum_index:
 *   get:
 *     summary: Obtener todos los índices de foro
 *     description: Devuelve una lista de todos los índices de foro.
 *     tags:
 *       - Foro
 *     responses:
 *       200:
 *         description: Lista de índices de foro
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   index_id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Tecnología"
 *                   description:
 *                     type: string
 *                     example: "Foro de discusión sobre tecnología."
 */
router.get("/", async (req, res) => {
    try {
        const forumIndex = await prisma.forum_index.findMany();
        res.json(forumIndex);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum_index:
 *   post:
 *     summary: Crear un nuevo índice de foro
 *     description: Crea un nuevo índice de foro.
 *     tags:
 *       - Foro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tecnología"
 *               description:
 *                 type: string
 *                 example: "Foro de discusión sobre tecnología."
 *     responses:
 *       201:
 *         description: Índice de foro creado
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/", async (req, res) => {
    const { title, description } = req.body;
    try {
        const newForumIndex = await prisma.forum_index.create({
            data: { title, description },
        });
        res.status(201).json(newForumIndex);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum_index/{id}:
 *   get:
 *     summary: Obtener un índice de foro por ID
 *     description: Devuelve un índice de foro específico por ID.
 *     tags:
 *       - Foro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del índice de foro
 *     responses:
 *       200:
 *         description: Índice de foro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 index_id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Tecnología"
 *                 description:
 *                   type: string
 *                   example: "Foro de discusión sobre tecnología."
 *       404:
 *         description: Índice de foro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const forumIndex = await prisma.forum_index.findUnique({
            where: { index_id: parseInt(id) },
        });
        if (!forumIndex) {
            return res.status(404).json({ error: "Índice de foro no encontrado" });
        }
        res.json(forumIndex);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum_index/{id}:
 *   put:
 *     summary: Actualizar un índice de foro
 *     description: Actualiza un índice de foro específico por ID.
 *     tags:
 *       - Foro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del índice de foro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tecnología"
 *               description:
 *                 type: string
 *                 example: "Foro de discusión sobre tecnología."
 *     responses:
 *       200:
 *         description: Índice de foro actualizado
 *       404:
 *         description: Índice de foro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const updatedForumIndex = await prisma.forum_index.update({
            where: { index_id: parseInt(id) },
            data: { title, description },
        });
        res.json(updatedForumIndex);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum_index/{id}:
 *   delete:
 *     summary: Eliminar un índice de foro
 *     description: Elimina un índice de foro específico por ID.
 *     tags:
 *       - Foro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del índice de foro
 *     responses:
 *       200:
 *         description: Índice de foro eliminado
 *       404:
 *         description: Índice de foro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.forum_index.delete({
            where: { index_id: parseInt(id) },
        });
        res.json({ message: "Índice de foro eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;
