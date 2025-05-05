const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /forum_entries:
 *   get:
 *     summary: Obtener todas las entradas de foro
 *     description: Devuelve una lista de todas las entradas de foro.
 *     tags:
 *       - Foro
 *     responses:
 *       200:
 *         description: Lista de entradas de foro
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   entry_id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Nueva Tecnología"
 *                   content:
 *                     type: string
 *                     example: "Hablemos sobre los últimos avances tecnológicos."
 */
router.get("/", async (req, res) => {
    try {
        const forumEntries = await prisma.forum_entries.findMany();
        res.json(forumEntries);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum_entries:
 *   post:
 *     summary: Crear una nueva entrada de foro
 *     description: Crea una nueva entrada de foro.
 *     tags:
 *       - Foro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               index_id:
 *                 type: integer
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Nueva Tecnología"
 *               content:
 *                 type: string
 *                 example: "Hablemos sobre los últimos avances tecnológicos."
 *               media_url:
 *                 type: string
 *                 example: "https://example.com/media.jpg"
 *     responses:
 *       201:
 *         description: Entrada de foro creada
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/", async (req, res) => {
    const { index_id, user_id, title, content, media_url } = req.body;
    try {
        const newForumEntry = await prisma.forum_entries.create({
            data: { index_id, user_id, title, content, media_url },
        });
        res.status(201).json(newForumEntry);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor", error_data: error });
    }
});

/**
 * @swagger
 * /forum_entries/{id}:
 *   get:
 *     summary: Obtener una entrada de foro por ID
 *     description: Devuelve una entrada de foro específica por ID.
 *     tags:
 *       - Foro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la entrada de foro
 *     responses:
 *       200:
 *         description: Entrada de foro encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entry_id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Nueva Tecnología"
 *                 content:
 *                   type: string
 *                   example: "Hablemos sobre los últimos avances tecnológicos."
 *       404:
 *         description: Entrada de foro no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const forumEntry = await prisma.forum_entries.findUnique({
            where: { entry_id: parseInt(id) },
        });
        if (!forumEntry) {
            return res.status(404).json({ error: "Entrada de foro no encontrada" });
        }
        res.json(forumEntry);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum_entries/{id}:
 *   put:
 *     summary: Actualizar una entrada de foro
 *     description: Actualiza una entrada de foro específica por ID.
 *     tags:
 *       - Foro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la entrada de foro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Nueva Tecnología"
 *               content:
 *                 type: string
 *                 example: "Hablemos sobre los últimos avances tecnológicos."
 *               media_url:
 *                 type: string
 *                 example: "https://example.com/media.jpg"
 *     responses:
 *       200:
 *         description: Entrada de foro actualizada
 *       404:
 *         description: Entrada de foro no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content, media_url } = req.body;
    try {
        const updatedForumEntry = await prisma.forum_entries.update({
            where: { entry_id: parseInt(id) },
            data: { title, content, media_url },
        });
        res.json(updatedForumEntry);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

/**
 * @swagger
 * /forum_entries/{id}:
 *   delete:
 *     summary: Eliminar una entrada de foro
 *     description: Elimina una entrada de foro específica por ID.
 *     tags:
 *       - Foro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la entrada de foro
 *     responses:
 *       200:
 *         description: Entrada de foro eliminada
 *       404:
 *         description: Entrada de foro no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.forum_entries.delete({
            where: { entry_id: parseInt(id) },
        });
        res.json({ message: "Entrada de foro eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;