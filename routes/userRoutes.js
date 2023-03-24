const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../multerconfig');
const authenticate = require('../authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/getAll', userController.getUsers);
router.get('/getOne/:id', userController.getUser);
router.patch('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

//route to handle picture upload
router.post('/upload-picture',authenticate, upload.single('uploads'), userController.uploadPicture);


module.exports = router;

