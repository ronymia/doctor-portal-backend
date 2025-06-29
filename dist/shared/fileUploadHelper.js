"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadHelper = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
// import { ICloudinaryResponse, IUploadFille } from '../interfaces/file';
// Configuration
cloudinary_1.v2.config({
    cloud_name: 'dtliti6vi',
    api_key: '296692227137798',
    api_secret: '41LXWp96mcprxF1hgE8kyVkn12g', // Click 'View API Keys' above to copy your API secret
});
// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url('shoes', {
//   fetch_format: 'auto',
//   quality: 'auto'
// });
// console.log(optimizeUrl);
// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url('shoes', {
//   crop: 'auto',
//   gravity: 'auto',
//   width: 500,
//   height: 500
// });
// console.log(autoCropUrl);
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    // Upload an image
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file.path, (uploadError, uploadResult) => {
            // REMOVE LOCAL FILE
            fs_1.default.unlinkSync(file.path);
            if (uploadError) {
                console.log({ uploadError: uploadError });
                reject(uploadError);
            }
            else {
                console.log({ uploadResult });
                resolve(uploadResult);
            }
        });
    });
});
const upload = (0, multer_1.default)({ storage: storage });
exports.FileUploadHelper = {
    uploadToCloudinary,
    upload,
};
