// ========================================
// CONTROLADOR DE AUTENTICACIÓN
// ========================================
// Archivo: controllers/authController.js
// Descripción: Gestiona el registro e inicio de sesión de usuarios
// Funcionalidades: Validación, encriptación de contraseña y generación de tokens JWT
// Autor: Cristian David Alarcon Huerfano 
// Fecha: 20 de Noviembre de 2025

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ========================================
// FUNCIÓN: REGISTRO DE USUARIO
// ========================================
/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {string} req.body.name - Nombre del usuario
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Objeto JSON con estado y datos del usuario registrado
 */
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // VALIDACIÓN 1: Verificar que los campos no estén vacíos
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Error en la validación - todos los campos son requeridos (email, password, name)",
        success: false,
        code: "VALIDATION_ERROR"
      });
    }

    // VALIDACIÓN 2: Verificar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Error en la validación - formato de email inválido",
        success: false,
        code: "INVALID_EMAIL_FORMAT"
      });
    }

// VALIDACIÓN 3: Verificar que la contraseña tenga maximo 16 caracteres
if (password.length > 16) {
  return res.status(400).json({
    message: "Error en la validación - la contraseña debe tener maximo 16 caracteres",
    success: false,
    code: "WEAK_PASSWORD"
  });
}

    // VALIDACIÓN 4: Verificar que el usuario no exista
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        message: "Error en la validación - el usuario ya existe",
        success: false,
        code: "USER_ALREADY_EXISTS"
      });
    }

    // Encriptar contraseña con bcrypt (10 rondas de salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario en la base de datos
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Respuesta exitosa
    res.status(201).json({
      message: "Registro exitoso - usuario creado correctamente",
      success: true,
      code: "REGISTRATION_SUCCESS",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      message: "Error en el servidor durante el registro",
      success: false,
      code: "SERVER_ERROR",
      error: error.message
    });
  }
};

// ========================================
// FUNCIÓN: INICIO DE SESIÓN
// ========================================
/**
 * Autentica un usuario y genera un token JWT
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Objeto JSON con estado, token y datos del usuario
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // VALIDACIÓN 1: Verificar que los campos no estén vacíos
    if (!email || !password) {
      return res.status(400).json({
        message: "Error en la validación - email y contraseña son requeridos",
        success: false,
        code: "MISSING_CREDENTIALS"
      });
    }

    // VALIDACIÓN 2: Verificar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Error en la validación - formato de email inválido",
        success: false,
        code: "INVALID_EMAIL_FORMAT"
      });
    }

    // Buscar el usuario por email en la base de datos
    const user = await User.findOne({ email });

    // VALIDACIÓN 3: Verificar que el usuario existe
    if (!user) {
      return res.status(401).json({
        message: "Error en la autenticación - credenciales incorrectas",
        success: false,
        code: "AUTHENTICATION_FAILED"
      });
    }

    // VALIDACIÓN 4: Comparar contraseña ingresada con contraseña encriptada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Error en la autenticación - credenciales incorrectas",
        success: false,
        code: "AUTHENTICATION_FAILED"
      });
    }

    // Generar token JWT con información del usuario
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET || 'your_secret_key_change_this',
      {
        expiresIn: '24h' // Token válido por 24 horas
      }
    );

    // RESPUESTA EXITOSA: Autenticación satisfactoria
    res.status(200).json({
      message: "Autenticación satisfactoria",
      success: true,
      code: "AUTHENTICATION_SUCCESS",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      message: "Error en el servidor durante la autenticación",
      success: false,
      code: "SERVER_ERROR",
      error: error.message
    });
  }
};