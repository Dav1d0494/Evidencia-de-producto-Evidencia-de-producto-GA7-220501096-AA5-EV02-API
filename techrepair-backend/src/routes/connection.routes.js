const express = require('express');
const router = express.Router();
const connectionCtrl = require('../controllers/connectionController');

// Rutas CRUD básicas
router.post('/', connectionCtrl.create);
router.get('/', connectionCtrl.getAll);
router.get('/:id', connectionCtrl.getById);
router.put('/:id', connectionCtrl.update);
router.delete('/:id', connectionCtrl.delete);

// Generación y validación de códigos
router.post('/generate', connectionCtrl.generateCode);
router.get('/validate/:accessCode', connectionCtrl.validateCode);

// Gestión de conexiones
router.post('/connect/:accessCode', connectionCtrl.connectTechnician);
router.put('/permissions/:accessCode', connectionCtrl.updatePermissions);
router.put('/end/:accessCode', connectionCtrl.endSession);

// Historial
router.get('/history', connectionCtrl.getHistory);

module.exports = router;
