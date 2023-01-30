const router = require("express").Router()

const multer = require("multer")

let imgName = ""

const hotira = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/public")
    },
    filename: (req, file, cb) => {
        cb(null, imgName = Date.now() + "-" + file.originalname)
    }
})

const upload = multer({storage: hotira})

router.post("/", upload.single("image"), (req, res) => {
    try {
        return res.status(201).json(imgName)
    } catch (error) {
        console.log(error);
    }
})

module.exports = router