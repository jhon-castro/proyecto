const { Router } = require('express');
const router = Router();
const photo = require('../models/photo');
const cloudinary = require('cloudinary');

// logearse en cloudinary 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})
// file system
const fs = require('fs-extra');

router.get('/', async (req,res) =>{
    const photos = await photo.find(); // traera las fotos guardadas en mongoDB
    // console.log(photos);
    res.render('images', {photos:photos},() =>{
         console.log(photos.imageURL);
    });
})
router.get('/images/add', (req,res) => {
    res.render('image_form');
});

router.post('/images/add', async (req,res) =>{
    const {title,description} = req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path).catch(()=>{
        console.log('error');
    })    
    const newPhoto = new photo({
        title,
        description,
        imageURL : result.url,
        public_id : result.public_id,
    })
    await newPhoto.save(); // guarda el archivo en la base de datos 
    await fs.unlink(req.file.path); // elimina el archivo de se guarda en la carpeta ( public/uploads)
    res.send('/images');
})

module.exports = router;