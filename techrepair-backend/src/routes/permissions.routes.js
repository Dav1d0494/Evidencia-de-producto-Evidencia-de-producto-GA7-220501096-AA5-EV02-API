const express = require('express');
const router = express.Router();
const permissionCtrl = require('../controllers/permissionController');

router.get('/', permissionCtrl.list);
router.post('/', permissionCtrl.create);

module.exports = router;
