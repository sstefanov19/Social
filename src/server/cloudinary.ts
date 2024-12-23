import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'posts' },
      (error, result) => {
        if (error) {
          reject(new Error(error.message));
        } else {
            if(result){
                resolve(result.secure_url);
            }
        }
      }
    );
    const webStream = file.stream();
    const readableStream = Readable.from(webStream as unknown as AsyncIterable<Uint8Array>);
    readableStream.pipe(uploadStream);
  });
}
