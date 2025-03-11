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
 * /articles:
 *   post:
 *     summary: Crear un nuevo artículo
 *     description: Permite a un profesional publicar un artículo.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Artículos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Cómo manejar la ansiedad"
 *               content:
 *                 type: string
 *                 example: "Este artículo explica estrategias para reducir la ansiedad."
 *               media_url:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               media_type:
 *                 type: string
 *                 example: "imagen"
 *     responses:
 *       201:
 *         description: Artículo creado exitosamente
 */
router.post("/", async (req, res) => {
    const { title, content, media_url, media_type } = req.body;
    const professional_id = req.userId;

    try {
        const article = await prisma.articles.create({
            data: {
                professional_id,
                title,
                content,
                media_url,
                media_type,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        res.status(201).json(article);
    } catch (error) {
        console.error("Error al crear artículo:", error);
        res.status(500).json({ error: "Error al crear artículo" });
    }
});

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Obtener todos los artículos
 *     description: Devuelve todos los artículos publicados.
 *     tags:
 *       - Artículos
 *     responses:
 *       200:
 *         description: Lista de artículos disponibles
 */
router.get("/", async (req, res) => {
    try {
        const articles = await prisma.articles.findMany();
        res.json(articles);
    } catch (error) {
        console.error("Error al obtener artículos:", error);
        res.status(500).json({ error: "Error al obtener artículos" });
    }
});

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Obtener un artículo por ID
 *     description: Devuelve un artículo específico.
 *     tags:
 *       - Artículos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Artículo encontrado
 *       404:
 *         description: Artículo no encontrado
 */
router.get("/:id", async (req, res) => {
    const articleId = parseInt(req.params.id);

    try {
        const article = await prisma.articles.findUnique({
            where: { article_id: articleId },
        });

        if (!article) {
            return res.status(404).json({ error: "Artículo no encontrado" });
        }

        res.json(article);
    } catch (error) {
        console.error("Error al obtener artículo:", error);
        res.status(500).json({ error: "Error al obtener artículo" });
    }
});

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Actualizar un artículo
 *     description: Permite a un profesional actualizar su artículo.
 *     tags:
 *       - Artículos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del artículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Cómo manejar el estrés"
 *               content:
 *                 type: string
 *                 example: "Estrategias para manejar el estrés de manera efectiva."
 *               media_url:
 *                 type: string
 *                 example: "https://example.com/new-image.jpg"
 *               media_type:
 *                 type: string
 *                 example: "imagen"
 *     responses:
 *       200:
 *         description: Artículo actualizado exitosamente
 *       404:
 *         description: Artículo no encontrado
 */
router.put("/:id", async (req, res) => {
    const articleId = parseInt(req.params.id);
    const { title, content, media_url, media_type } = req.body;
    const professional_id = req.userId;

    try {
        const article = await prisma.articles.findUnique({
            where: { article_id: articleId },
        });

        if (!article || article.professional_id !== professional_id) {
            return res.status(404).json({ error: "Artículo no encontrado o no autorizado" });
        }

        const updatedArticle = await prisma.articles.update({
            where: { article_id: articleId },
            data: {
                title,
                content,
                media_url,
                media_type,
                updated_at: new Date(),
            },
        });

        res.json(updatedArticle);
    } catch (error) {
        console.error("Error al actualizar artículo:", error);
        res.status(500).json({ error: "Error al actualizar artículo" });
    }
});

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Eliminar un artículo
 *     description: Permite a un profesional eliminar su artículo.
 *     tags:
 *       - Artículos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Artículo eliminado exitosamente
 *       404:
 *         description: Artículo no encontrado
 */
router.delete("/:id", async (req, res) => {
    const articleId = parseInt(req.params.id);
    const professional_id = req.userId;

    try {
        const article = await prisma.articles.findUnique({
            where: { article_id: articleId },
        });

        if (!article || article.professional_id !== professional_id) {
            return res.status(404).json({ error: "Artículo no encontrado o no autorizado" });
        }

        await prisma.articles.delete({
            where: { article_id: articleId },
        });

        res.json({ message: "Artículo eliminado" });
    } catch (error) {
        console.error("Error al eliminar artículo:", error);
        res.status(500).json({ error: "Error al eliminar artículo" });
    }
});

module.exports = router;
