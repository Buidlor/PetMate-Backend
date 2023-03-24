const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //set the destination folder for user-specific pictures
        const destPath = path.join(__dirname, 'uploads', req.user.username);

        //check if the destination folder exists, if not create it
        fs.mkdir(destPath, { recursive: true }, (err) => {
            if (err) {
                cb(err);
            }else{
                cb(null, destPath);
            }
        });
                
    },
    filename: (req, file, cb) => {
        //set the filename, you can customize it based on your requirements
        cb(null, Date.now() + '-' + file.originalname);
    },
});

//filter to allow only specific file types
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG and GIF image files are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: {
        fileSize: 2048 * 1024 * 5 //10MB file limit
    },
});

module.exports = upload;