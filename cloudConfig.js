const { CloudinaryStorage } = require('@fluidjs/multer-cloudinary');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowerdformats : ["png", "jpg", "jpeg"],
      
    },
  });

  module.exports = {
    cloudinary,
    storage,
  };

