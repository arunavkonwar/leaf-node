var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + '.jpg')
    }
});

var upload = multer({ storage: storage });


router.post('/', upload.single('profileImage'), function (req, res) {
    console.log(req.files);
  res.send(req.files);
  res.redirect('/articles/add');
});


module.exports = router;
