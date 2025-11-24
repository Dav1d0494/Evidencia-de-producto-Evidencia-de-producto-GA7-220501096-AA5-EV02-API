const Connection = require('../models/Connection');
const { generateAccessCode } = require('../utils/codeGenerator');
const logger = require('../utils/logger');

// Create - Crear una nueva conexión
exports.create = async (req, res) => {
  try {
    const connection = await Connection.create(req.body);
    logger.info(`Nueva conexión creada con ID: ${connection._id}`);
    res.status(201).json(connection);
  } catch (err) {
    logger.error('Error al crear conexión:', err);
    res.status(500).json({ message: 'Error al crear la conexión' });
  }
};

// Read - Obtener todas las conexiones
exports.getAll = async (req, res) => {
  try {
    const connections = await Connection.find();
    res.json(connections);
  } catch (err) {
    logger.error('Error al obtener conexiones:', err);
    res.status(500).json({ message: 'Error al obtener las conexiones' });
  }
};

// Read - Obtener una conexión por ID
exports.getById = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);
    if (!connection) {
      return res.status(404).json({ message: 'Conexión no encontrada' });
    }
    res.json(connection);
  } catch (err) {
    logger.error('Error al obtener conexión:', err);
    res.status(500).json({ message: 'Error al obtener la conexión' });
  }
};

// Update - Actualizar una conexión
exports.update = async (req, res) => {
  try {
    const connection = await Connection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!connection) {
      return res.status(404).json({ message: 'Conexión no encontrada' });
    }
    logger.info(`Conexión actualizada: ${connection._id}`);
    res.json(connection);
  } catch (err) {
    logger.error('Error al actualizar conexión:', err);
    res.status(500).json({ message: 'Error al actualizar la conexión' });
  }
};

// Delete - Eliminar una conexión
exports.delete = async (req, res) => {
  try {
    const connection = await Connection.findByIdAndDelete(req.params.id);
    if (!connection) {
      return res.status(404).json({ message: 'Conexión no encontrada' });
    }
    logger.info(`Conexión eliminada: ${connection._id}`);
    res.json({ message: 'Conexión eliminada correctamente' });
  } catch (err) {
    logger.error('Error al eliminar conexión:', err);
    res.status(500).json({ message: 'Error al eliminar la conexión' });
  }
};

// Generar nuevo código de acceso
exports.generateCode = async (req, res) => {
  try {
    let code;
    let existing;
    
    // Generar código único
    do {
      code = generateAccessCode();
      existing = await Connection.findOne({ accessCode: code });
    } while (existing);

    // Crear conexión con expiración de 24 horas
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const connection = await Connection.create({
      accessCode: code,
      expiresAt,
      status: 'active'
    });

    res.status(201).json({ 
      accessCode: connection.accessCode,
      expiresAt: connection.expiresAt 
    });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validar código de acceso
exports.validateCode = async (req, res) => {
  try {
    const { accessCode } = req.params;
    const connection = await Connection.findOne({ 
      accessCode,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (!connection) {
      return res.status(404).json({ 
        valid: false,
        message: 'Código inválido o expirado'
      });
    }

    res.json({ 
      valid: true,
      connection: {
        accessCode: connection.accessCode,
        permissions: connection.permissions,
        status: connection.status
      }
    });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Conexión de técnico
exports.connectTechnician = async (req, res) => {
  try {
    const { accessCode } = req.params;
    const { technicianId } = req.body;

    const connection = await Connection.findOne({ 
      accessCode,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (!connection) {
      return res.status(404).json({ message: 'Código inválido o expirado' });
    }

    if (connection.technician) {
      return res.status(400).json({ message: 'Ya hay un técnico conectado' });
    }

    connection.technician = technicianId;
    connection.startTime = new Date();
    await connection.save();

    res.json({ 
      message: 'Conexión establecida',
      connection: {
        accessCode: connection.accessCode,
        permissions: connection.permissions,
        startTime: connection.startTime
      }
    });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Actualizar permisos
exports.updatePermissions = async (req, res) => {
  try {
    const { accessCode } = req.params;
    const { permissions } = req.body;

    const connection = await Connection.findOne({ accessCode, status: 'active' });
    if (!connection) {
      return res.status(404).json({ message: 'Conexión no encontrada' });
    }

    connection.permissions = { ...connection.permissions, ...permissions };
    await connection.save();

    res.json({ permissions: connection.permissions });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Finalizar sesión
exports.endSession = async (req, res) => {
  try {
    const { accessCode } = req.params;
    const { description } = req.body;

    const connection = await Connection.findOne({ accessCode, status: 'active' });
    if (!connection) {
      return res.status(404).json({ message: 'Conexión no encontrada' });
    }

    connection.status = 'completed';
    connection.endTime = new Date();
    connection.description = description;
    await connection.save();

    res.json({ 
      message: 'Sesión finalizada',
      connection: {
        accessCode: connection.accessCode,
        startTime: connection.startTime,
        endTime: connection.endTime,
        description: connection.description
      }
    });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Obtener historial
exports.getHistory = async (req, res) => {
  try {
    const { accessCode } = req.query;
    
    const filter = accessCode 
      ? { accessCode, status: 'completed' }
      : { status: 'completed' };
      
    const connections = await Connection.find(filter)
      .sort('-endTime')
      .select('accessCode technician startTime endTime description');

    res.json(connections);

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
