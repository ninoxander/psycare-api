const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
    res.render("status", { title: "Status", mensaje: "Todo funcionando correctamente" });
});

module.exports = router;
