const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Test
 *     description: Operaciones CRUD para el modelo Test
 */

/**
 * @swagger
 * /test:
 *   post:
 *     summary: Crear un test
 *     tags:
 *       - Test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Test creado exitosamente
 *       500:
 *         description: Error al crear test
 */
router.post("/", async (req, res) => {
    const { title, description, date } = req.body;

    try {
        const test = await prisma.test.create({
            data: {
                title,
                description,
                date: date ? new Date(date) : new Date(),
            },
        });
        res.status(201).json(test);
    } catch (error) {
        console.error("Error al crear test:", error);
        res.status(500).json({ error: "Error al crear test" });
    }
});

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Obtener todos los tests
 *     tags:
 *       - Test
 *     responses:
 *       200:
 *         description: Lista de tests
 *       500:
 *         description: Error al obtener tests
 */
router.get("/", async (req, res) => {
    try {
        const tests = await prisma.test.findMany();
        res.json(tests);
    } catch (error) {
        console.error("Error al obtener tests:", error);
        res.status(500).json({ error: "Error al obtener tests" });
    }
});

/**
 * @swagger
 * /test/{id}:
 *   get:
 *     summary: Obtener un test por ID
 *     tags:
 *       - Test
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del test
 *     responses:
 *       200:
 *         description: Test encontrado
 *       404:
 *         description: Test no encontrado
 *       500:
 *         description: Error al obtener test
 */
router.get("/:id", async (req, res) => {
    const testId = parseInt(req.params.id);

    try {
        const test = await prisma.test.findUnique({
            where: { id: testId },
        });

        if (!test) {
            return res.status(404).json({ error: "Test no encontrado" });
        }

        res.json(test);
    } catch (error) {
        console.error("Error al obtener test:", error);
        res.status(500).json({ error: "Error al obtener test" });
    }
});

/**
 * @swagger
 * /test/{id}:
 *   put:
 *     summary: Actualizar un test
 *     tags:
 *       - Test
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Test actualizado
 *       404:
 *         description: Test no encontrado
 *       500:
 *         description: Error al actualizar test
 */
router.put("/:id", async (req, res) => {
    const testId = parseInt(req.params.id);
    const { title, description, date } = req.body;

    try {
        const updated = await prisma.test.update({
            where: { id: testId },
            data: {
                title,
                description,
                date: date ? new Date(date) : undefined,
            },
        });

        res.json(updated);
    } catch (error) {
        console.error("Error al actualizar test:", error);
        res.status(500).json({ error: "Error al actualizar test" });
    }
});

/**
 * @swagger
 * /test/{id}:
 *   delete:
 *     summary: Eliminar un test
 *     tags:
 *       - Test
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del test
 *     responses:
 *       200:
 *         description: Test eliminado
 *       404:
 *         description: Test no encontrado
 *       500:
 *         description: Error al eliminar test
 */
router.delete("/:id", async (req, res) => {
    const testId = parseInt(req.params.id);

    try {
        await prisma.test.delete({
            where: { id: testId },
        });

        res.json({ message: "Test eliminado" });
    } catch (error) {
        console.error("Error al eliminar test:", error);
        res.status(500).json({ error: "Error al eliminar test" });
    }
});

module.exports = router;
