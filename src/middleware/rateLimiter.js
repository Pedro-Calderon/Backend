const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos
    message: {
        message: "Demasiados intentos fallidos. Intenta de nuevo en 15 minutos.",
    },
    keyGenerator: (req) => req.ip,  // se usa la IP para identificar al usuario
    skipSuccessfulRequests: true, // no cuenta los intentos exitosos
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = loginLimiter;
