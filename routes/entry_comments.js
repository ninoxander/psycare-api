const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /forum_entry_comments:
 *   get:
 *     summary: Obtener todos los comentarios de entradas de foro
 *     description: Devuelve una lista de todos los comentarios de las entradas de foro.
 *     tags:
 *       - Foro
 *     responses:
 *       200:
 *         description: Lista de comentarios de entradas de foro
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   comment_id:
 *                     type: integer
 *                     example: 1
 *                   content:
 *                     type: string
 *                     example: "Este es un comentario sobre tecnología."
 */
router.get("/", async (req, res) => {
    try {
        const forumComments = await prisma.forum_entry_comments.findMany();
        res.json(forumComments);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum_entry_comments:
 *   post:
 *     summary: Crear un nuevo comentario en una entrada de foro
 *     description: Crea un nuevo comentario en una entrada de foro.
 *     tags:
 *       - Foro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entry_id:
 *                 type: integer
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: "Este es un comentario sobre tecnología."
 *               media_url:
 *                 type: string
 *                 example: "https://example.com/media.jpg"
 *     responses:
 *       201:
 *         description: Comentario creado
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/", async (req, res) => {
    const { entry_id, user_id, content, media_url } = req.body;
    try {
        const newComment = await prisma.forum_entry_comments.create({
            data: { entry_id, user_id, content, media_url },
        });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum_entry_comments/{id}:
 *   get:
 *     summary: Obtener un comentario de entrada de foro por ID
 *     description: Devuelve un comentario específico por ID.
 *     tags:
 *       - Foro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment_id:
 *                   type: integer
 *                   example: 1
 *                 content:
 *                   type: string
 *                   example: "Este es un comentario sobre tecnología."
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await prisma.forum_entry_comments.findUnique({
            where: { comment_id: parseInt(id) },
        });
        if (!comment) {
            return res.status(404).json({ error: "Comentario no encontrado" });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum_entry_comments/{id}:
 *   put:
 *     summary: Actualizar un comentario de entrada de foro
 *     description: Actualiza un comentario de entrada de foro específico por ID.
 *     tags:
 *       - Foro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Este es un comentario actualizado."
 *               media_url:
 *                 type: string
 *                 example: "https://example.com/updated-media.jpg"
 *     responses:
 *       200:
 *         description: Comentario actualizado
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { content, media_url } = req.body;
    try {
        const updatedComment = await prisma.forum_entry_comments.update({
            where: { comment_id: parseInt(id) },
            data: { content, media_url },
        });
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum_entry_comments/{id}:
 *   delete:
 *     summary: Eliminar un comentario de entrada de foro
 *     description: Elimina un comentario de entrada de foro específico por ID.
 *     tags:
 *       - Foro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario eliminado
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.forum_entry_comments.delete({
            where: { comment_id: parseInt(id) },
        });
        res.json({ message: "Comentario eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;
