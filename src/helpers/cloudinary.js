const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dcwcnag77',
    api_key: '649551211531975',
    api_secret: 'SECRET',
});

module.exports = cloudinary;