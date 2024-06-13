const router = require("express").Router();
const multer = require("multer");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: "../uploads",
    filename: function (req, file, callback) {
        // Следующая строчка исправляет кодировку (взято со stackoverflow.com)
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        callback(null, Date.now() + "_" + crypto.randomBytes(16).toString("base64url") + "_" + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 16777216, // 16Mb
        files: 10
    },
    fileFilter: function (req, file, callback) {
        /*const type = file.mimetype;

        if (type === "image/gif" || type === "image/jpeg" || type === "image/png" || type === "text/plain"
            || type === "video/mp4" || type === "application/msword" || type === "application/pdf"
            || type === "application/vnd.ms-powerpoint"
            || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            || type === "application/vnd.visio" || type === "application/vnd.visio2013"
            || type === "application/x-compressed" || type === "application/x-7z-compressed"
            || type === "application/x-zip-compressed" || type === "application/x-rar-compressed"
            || type === "application/vnd.ms-excel") {
            callback(null, true);
        } else {
            callback(new Error("Invalid file type!"), false);
        }*/
        callback(null, true);
    }
}).array("files", 10);

router.post("/upload", (req, res, next) => {
    upload(req, res, (err) => {
        if (err){
            next(err);
        }

        const filesData = [];
        for (const file of req.files) {
            filesData.push({
                name: file.originalname,
                mimetype: file.mimetype,
                path: file.path.replaceAll("\\", "/"),
                size: file.size
            });
        }

        res.json(filesData);
    });
}, (req, res, next) => {
    /*let progress = 0;
    const file_size = req.headers["content-length"];
    console.log("start");

    req.on("data", (chunk) => {
        progress += chunk.length;
        const percentage = (progress / file_size) * 100;
        console.log(percentage);

        if (percentage === 100){

        }
    });*/
});

module.exports = router;