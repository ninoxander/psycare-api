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
 * /reports:
 *   post:
 *     summary: Crear un nuevo reporte de soporte técnico
 *     description: Permite a un usuario crear un nuevo reporte de soporte técnico.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Reportes de Soporte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Error en la página de inicio"
 *               body:
 *                 type: string
 *                 example: "No puedo iniciar sesión en la plataforma."
 *               page:
 *                 type: string
 *                 example: "/login"
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report_id:
 *                   type: integer
 *                   example: 1
 *                 folio:
 *                   type: string
 *                   example: "REP-12345"
 *       500:
 *         description: Error del servidor
 */
router.post("/", async (req, res) => {
    const { reason, body, page } = req.body;
    const userId = req.userId;

    // Generar un folio único
    const folio = `REP-${Math.floor(Math.random() * 1000000).toString().padStart(6, "0")}`;

    try {
        const report = await prisma.support_reports.create({
            data: {
                user_id: userId,
                reason,
                body,
                page,
                folio,
                status: "enviado", // Estado inicial
            },
        });

        res.status(201).json({
            report_id: report.report_id,
            folio: report.folio,
        });
    } catch (error) {
        console.error("Error al crear el reporte:", error);
        res.status(500).json({ error: "Error al crear el reporte" });
    }
});

module.exports = router;