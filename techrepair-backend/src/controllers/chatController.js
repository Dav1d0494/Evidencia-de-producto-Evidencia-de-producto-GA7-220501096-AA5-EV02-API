const Message = require('../models/Message');
const Connection = require('../models/Connection');
const logger = require('../utils/logger');

// Obtener mensajes de una conexión
exports.getMessages = async (req, res) => {
  try {
    const { accessCode } = req.params;
    
    const connection = await Connection.findOne({ accessCode });
    if (!connection) {
      return res.status(404).json({ message: 'Conexión no encontrada' });
    }

    const messages = await Message.find({ connectionId: accessCode })
      .sort('createdAt')
      .select('senderType content createdAt');

    res.json(messages);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Crear nuevo mensaje
exports.sendMessage = async (req, res) => {
  try {
    const { accessCode } = req.params;
    const { content, senderType } = req.body;

    const connection = await Connection.findOne({ 
      accessCode, 
      status: 'active' 
    });
    
    if (!connection) {
      return res.status(404).json({ message: 'Conexión no encontrada o inactiva' });
    }

    const message = await Message.create({
      connectionId: accessCode,
      content,
      senderType
    });

    // Emitir el mensaje vía Socket.io (será implementado en chatHandler.js)
    req.io.to(accessCode).emit('message', {
      id: message._id,
      content: message.content,
      senderType: message.senderType,
      createdAt: message.createdAt
    });

    res.status(201).json(message);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
