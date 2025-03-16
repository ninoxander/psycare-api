// utils/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "24h", 
    });
};

const authenticate = (req, res, next) => {
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

module.exports = { authenticate, generateToken };