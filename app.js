const express = require('express');
var cors = require('cors')
const Port =process.env.Port || 8000
const mongoose =require('mongoose')
const multer = require('multer');
const path=require('path')
const feedRoutes= require('./routes/feed')
const authRoutes= require('./routes/auth')

const app=express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//extra


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "images");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },


});
const upload = multer({ storage })
app.post('/pp', upload.single('file'), (req, res) => {
  if (!req.file) {
    console.log("No file received");
    res.json({error})
    return res.send({
      success: false
    });

  } else {
    console.log('file received');
    return res.send({
      success: true
    })
  }
});

//xxxxxxxxx


// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, '/images');
//     },
//     filename: (req, file, cb) => {
//       cb(null, new Date().toISOString() + '-' + file.originalname);
//     }
//   });
const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  app.use(
    multer({ storage: storage, }).single('image')
  );
 // app.use(express.static(__dirname, 'images'));
 app.use('/images', express.static(path.join(__dirname, 'images')));



  app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data
    res.status(status).json({ message: message,data:data});
  });
  

mongoose.connect("mongodb://localhost:27017/course_api", {

  })
  .then(result => {
 console.log('Connection successfull');
  }).catch(err =>{
    console.log('Connection ERROR')
  })



//routes
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);


const server = app.listen(Port,()=>{
    console.log(`Server is running at ${Port}`)
})
const io= require('socket.io')(server)
io.on('Connection',socket =>{
  console.log('Client Connected')
})