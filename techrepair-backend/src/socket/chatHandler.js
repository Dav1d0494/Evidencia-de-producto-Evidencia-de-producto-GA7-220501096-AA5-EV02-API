const Connection = require('../models/Connection');
const logger = require('../utils/logger');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Unirse a una sala usando el código de acceso
    socket.on('join', async ({ accessCode, type }) => {
      try {
        const connection = await Connection.findOne({ 
          accessCode,
          status: 'active',
          expiresAt: { $gt: new Date() }
        });

        if (!connection) {
          socket.emit('error', { message: 'Código inválido o expirado' });
          return;
        }

        // Unirse a la sala usando el código como identificador
        socket.join(accessCode);
        
        // Notificar la conexión
        const event = type === 'technician' ? 'technicianJoined' : 'clientJoined';
        io.to(accessCode).emit(event, { accessCode });
        
        logger.info(`${type} joined room ${accessCode}`);
      } catch (err) {
        logger.error('Error joining room:', err);
        socket.emit('error', { message: 'Error al unirse a la sala' });
      }
    });

    // Enviar mensaje en la sala
    socket.on('message', async ({ accessCode, content, senderType }) => {
      try {
        const connection = await Connection.findOne({ 
          accessCode,
          status: 'active' 
        });

        if (!connection) {
          socket.emit('error', { message: 'Conexión no encontrada o inactiva' });
          return;
        }

        // Emitir mensaje a todos en la sala
        io.to(accessCode).emit('message', {
          content,
          senderType,
          createdAt: new Date()
        });

      } catch (err) {
        logger.error('Error sending message:', err);
        socket.emit('error', { message: 'Error al enviar mensaje' });
      }
    });

    // Actualización de permisos
    socket.on('permissionsUpdate', ({ accessCode, permissions }) => {
      io.to(accessCode).emit('permissionsUpdated', permissions);
    });

    // Desconexión
    socket.on('disconnect', () => {
      socket.rooms.forEach(room => {
        io.to(room).emit('userDisconnected', { room });
      });
    });
  });
};
