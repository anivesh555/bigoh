const multer = require("multer");
const fs = require("fs");
const path = require('path');
const constants = require("../utilities/constants");
const { customResponse } = require("../utilities/helper");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        fileUrlPath = req.baseUrl.split("/").pop()
        let storagePath = path.join(__dirname, "../../" + "public/files/" + fileUrlPath);
        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath, { recursive: true });
        }
        cb(null, storagePath);
    },
    filename: function (req, file, cb) {
        fileExtension = file.originalname.split(".").pop()
        if (!constants.FILE_EXTENSIONS.includes(fileExtension)) {
            return cb(TypeError("Only PNG files are allowed."), null);
        }
        let storagePath = req?.decodedUser?.user_id + "_" + new Date().getTime() + "." + fileExtension;

        if (req.uploadedImages && Array.isArray(req.uploadedImages)) {
            req.uploadedImages.push(storagePath);
        } else {
            req.uploadedImages = [storagePath];
        }
        cb(null, storagePath);
    },
});

const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
    upload.any('images')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(err?.code ? err.code : constants.HTTP_500_CODE).send(
                customResponse({
                    code: err?.code ? err.code : constants.HTTP_500_CODE,
                    message: err?.message ? err.message : constants.SOMETHING_WRONG_MSG,
                    err: err,
                })
            );
        } else if (err) {
            return res.status(err?.code ? err.code : constants.HTTP_500_CODE).send(
                customResponse({
                    code: err?.code ? err.code : constants.HTTP_500_CODE,
                    message: err?.message ? err.message : constants.SOMETHING_WRONG_MSG,
                    err: err,
                })
            );
        }
        next();
    });
};

module.exports = { uploadMiddleware };
