// Rutas de autenticación de usuarios
// Gestiona registro e inicio de sesión

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * POST /api/users/register
 * Registra un nuevo usuario en el sistema
 * Body: { email, password, name }
 */
router.post('/register', authController.register);

/**
 * POST /api/users/login
 * Inicia sesión de un usuario existente
 * Body: { email, password }
 */
router.post('/login', authController.login);

module.exports = router;