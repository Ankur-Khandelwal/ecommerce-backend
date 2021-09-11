const express = require('express');
const router = express.Router();
const {requireSignin, adminMiddleware} = require('../common-middleware');
const {addCategory, getCategories} = require('../controllers/category');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'))
  },
  filename: function (req, file, cb) {
    const nameBits = file.originalname.split(' ');
    const fName = nameBits.reduce((accumulator, currValue)=>{
      return accumulator+currValue;
    })
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, shortid.generate() + '-' + fName)
  }
})

const upload = multer({ storage: storage });

router.post('/category/create', requireSignin, adminMiddleware, upload.single('categoryImage'), addCategory);
router.get('/category/getcategory', getCategories);

module.exports = router;