// routes/book.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const convertToWebp = require('../middleware/sharp-config')

const bookCtrl = require('../controllers/book');

router.get('/bestrating', bookCtrl.getTopBook);
router.get('/', bookCtrl.getAllBook);
router.post('/', auth, multer, convertToWebp, bookCtrl.createBook)
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, multer, convertToWebp, bookCtrl.updateBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;