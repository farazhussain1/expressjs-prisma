import { diskStorage } from 'multer';

const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/cattleImg')        
    },
    filename: function (req, file, cb) {
        // console.log(file.);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})
// const upload = multer({ storage: storage })

export default storage
