//image routes

const express = require('express');
const Image = require('../models/Image');
const router = express.Router();
const multer = require('multer');

//define storage for the images

const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, './public/uploads/images');
  },

  //add back the extension
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//upload parameters for multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

router.get('/imagenew', (request, response) => {
  response.render('imagenew');
});

//view route
router.get('/:slug', async (request, response) => {
  let image = await Image.findOne({ slug: request.params.slug });

  if (image) {
    response.render('imageshow', { image: image });
  } else {
    response.redirect('/');
  }
});

//route that handles new post
router.post('/', upload.single('image'), async (request, response) => {
  console.log(request.file);
  // console.log(request.body);
  let image = new Image({
    title: request.body.title,
    hashtag: request.body.hashtag,
    description: request.body.description,
    img: request.file.filename,
  });

  try {
    image = await image.save();

    response.redirect(`uploads/${image.slug}`);
  } catch (error) {
    console.log(error);
  }
});

// route that handles edit view
router.get('/imageedit/:id', async (request, response) => {
  let image = await Image.findById(request.params.id);
  response.render('imageedit', { image: image });
});

//route to handle updates
router.put('/:id', async (request, response) => {
  request.image = await Image.findById(request.params.id);
  let image = request.image;
  image.title = request.body.title;
  image.hashtag = request.body.hashtag;
  image.description = request.body.description;

  try {
    image = await image.save();
    //redirect to the view route
    response.redirect(`/uploads/${image.slug}`);
  } catch (error) {
    console.log(error);
    response.redirect(`/seuploads/imageedit/${image.id}`, { image: image });
  }
});

///route to handle delete
router.delete('/:id', async (request, response) => {
  await Image.findByIdAndDelete(request.params.id);
  response.redirect('/');
});

module.exports = router;