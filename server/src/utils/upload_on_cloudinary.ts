import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true,
});

export async function upload_to_cloudinary(
  buffer: Buffer,
  file_path: string
): Promise<{ secure_url: string; public_id: string; resource_type: string }> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
  });

  const clean_path = file_path.replace(/^\/+/, '').replace(/\+/g, '');
  const path_parts = clean_path.split('/');
  const filename = path_parts.pop() || 'avatar';
  const folder_path = path_parts.length > 0 ? path_parts.join('/') : undefined;

  const base64Data = buffer.toString('base64');
  const fileStr = `data:image/jpeg;base64,${base64Data}`;

  const upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();

  const uploadOptions: Record<string, unknown> = {
    resource_type: 'auto',
  };

  if (folder_path) {
    uploadOptions.folder = folder_path;
  }
  if (filename) {
    uploadOptions.public_id = filename;
  }

  if (upload_preset) {
   
    uploadOptions.upload_preset = upload_preset;
    uploadOptions.unsigned = true;
  } else {
    uploadOptions.overwrite = true;
  }

  try {
    const result = await cloudinary.uploader.upload(fileStr, uploadOptions);

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type || 'image',
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

export async function delete_from_cloudinary(public_id: string): Promise<void> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
  });

  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
}
