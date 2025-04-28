var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const { swaggerUi, specs } = require("./swagger");

var authMiddleware = require("./utils/auth");
var indexRouter = require("./routes/index");
var signupRouter = require("./routes/signup");
var loginRouter = require("./routes/login");
var emotionalrecordsRouter = require("./routes/emotionalrecords");
var habitsRouter = require("./routes/habits");
var notificationsRouter = require("./routes/notifications");
var sesionsRouter = require("./routes/sesions");
var articlesRouter = require("./routes/articles");
var questionnariesRouter = require("./routes/questionnaries");
var alertsRouter = require("./routes/alerts");
var userSettingsRouter = require("./routes/user_settings");
var userRouter = require("./routes/user");
var reportsRouter = require("./routes/reports");
var testRouter = require("./routes/test");

var app = express();

const allowedOrigins = ["https://psycare-api.onrender.com/", "http://localhost:3001"];

// Accept all
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Endpoints disponibles
app.use("/", indexRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/records", emotionalrecordsRouter);
app.use("/habits", habitsRouter);
app.use("/notifications", notificationsRouter);
app.use("/sessions", sesionsRouter);
app.use("/articles", articlesRouter);
app.use("/questionnaries", questionnariesRouter);
app.use("/alerts", alertsRouter);
app.use("/user-settings", userSettingsRouter);
app.use("/users", userRouter);
app.use("/reports", reportsRouter);
app.use("/test", testRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

module.exports = app;
