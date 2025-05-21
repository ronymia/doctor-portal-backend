import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import { ICloudinaryResponse, IUploadFille } from '../interfaces/file';
// import { ICloudinaryResponse, IUploadFille } from '../interfaces/file';
// Configuration
cloudinary.config({
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadToCloudinary = async (
  file: IUploadFille,
): Promise<ICloudinaryResponse> => {
  // Upload an image
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,

      (uploadError: Error, uploadResult: ICloudinaryResponse) => {
        // REMOVE LOCAL FILE
        fs.unlinkSync(file.path);

        if (uploadError) {
          console.log({ uploadError: uploadError });
          reject(uploadError);
        } else {
          console.log({ uploadResult });
          resolve(uploadResult);
        }
      },
    );
  });
};

const upload = multer({ storage: storage });

export const FileUploadHelper = {
  uploadToCloudinary,
  upload,
};
