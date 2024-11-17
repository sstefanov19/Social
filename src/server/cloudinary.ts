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
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Upload failed, no result returned.'));
        }
      }
    );

    const readableStream = Readable.from((async function* () {
      const reader = file.stream().pipeThrough(new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(chunk);
        }
      })).getReader();
      while (true) {
        const { done, value } = await reader.read() as ReadableStreamReadResult<Uint8Array>;
        if (done) break;
        if (value) yield value;
        if (done) break;
        yield value;
      }
    })());
    readableStream.pipe(uploadStream);
  });
}
