const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Foro
 *   description: API para gestionar etiquetas de entradas del foro
 */

/**
 * @swagger
 * /forum-entry-tags:
 *   post:
 *     summary: Crear una nueva etiqueta
 *     tags: [Foro]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entry_id
 *               - tag
 *             properties:
 *               entry_id:
 *                 type: integer
 *               tag:
 *                 type: string
 *     responses:
 *       201:
 *         description: Etiqueta creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/", async (req, res) => {
    const { entry_id, tag } = req.body;
    try {
        const newTag = await prisma.forum_entry_tags.create({
            data: { entry_id, tag },
        });
        res.status(201).json(newTag);
    } catch (error) {
        console.error("Error al crear etiqueta:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum-entry-tags:
 *   get:
 *     summary: Obtener todas las etiquetas
 *     tags: [Foro]
 *     responses:
 *       200:
 *         description: Lista de etiquetas
 *       500:
 *         description: Error del servidor
 */
router.get("/", async (_req, res) => {
    try {
        const tags = await prisma.forum_entry_tags.findMany();
        res.json(tags);
    } catch (error) {
        console.error("Error al obtener etiquetas:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum-entry-tags/{id}:
 *   get:
 *     summary: Obtener una etiqueta por ID
 *     tags: [Foro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Etiqueta encontrada
 *       404:
 *         description: Etiqueta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", async (req, res) => {
    const tagId = parseInt(req.params.id);
    try {
        const tag = await prisma.forum_entry_tags.findUnique({
            where: { tag_id: tagId },
        });

        if (!tag) {
            return res.status(404).json({ error: "Etiqueta no encontrada" });
        }

        res.json(tag);
    } catch (error) {
        console.error("Error al obtener etiqueta:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum-entry-tags/{id}:
 *   put:
 *     summary: Actualizar una etiqueta existente
 *     tags: [Foro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Etiqueta actualizada
 *       404:
 *         description: Etiqueta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", async (req, res) => {
    const tagId = parseInt(req.params.id);
    const { tag } = req.body;

    try {
        const updatedTag = await prisma.forum_entry_tags.update({
            where: { tag_id: tagId },
            data: { tag },
        });

        res.json(updatedTag);
    } catch (error) {
        console.error("Error al actualizar etiqueta:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum-entry-tags/{id}:
 *   delete:
 *     summary: Eliminar una etiqueta por ID
 *     tags: [Foro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Etiqueta eliminada
 *       404:
 *         description: Etiqueta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", async (req, res) => {
    const tagId = parseInt(req.params.id);

    try {
        await prisma.forum_entry_tags.delete({
            where: { tag_id: tagId },
        });
        res.json({ message: "Etiqueta eliminada exitosamente" });
    } catch (error) {
        console.error("Error al eliminar etiqueta:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;
