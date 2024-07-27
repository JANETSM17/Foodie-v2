const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: "foodiecloudinary",
    api_key: "787165235955262",
    api_secret: "-tKrrgc8Hkphik5kbI0jkrim3KI"
})

module.exports = cloudinary