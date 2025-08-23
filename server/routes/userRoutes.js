const express = require('express');
const { createUser, login, logout, checkSession, getShippingAddress, updateShippingAddress } = require('../controllers/userController');

const router = express.Router();

router.post("/", createUser);
router.post("/login", login);
router.post("/logout", logout);
router.get('/session', checkSession);

//shipping address routes
router.get('/shipping-address', getShippingAddress);
router.put('/shipping-address', updateShippingAddress);

module.exports = router;