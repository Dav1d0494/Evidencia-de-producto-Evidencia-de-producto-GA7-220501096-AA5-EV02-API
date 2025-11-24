const express = require('express');
const router = express.Router();
const sessionCtrl = require('../controllers/sessionController');
const auth = require('../middleware/auth.middleware');

router.use(auth);
router.get('/', sessionCtrl.list);
router.post('/', sessionCtrl.create);

module.exports = router;
