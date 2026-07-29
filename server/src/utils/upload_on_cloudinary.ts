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
  file_path: string,
  mimetype: string = 'image/jpeg'
): Promise<{ secure_url: string; public_id: string; resource_type: string }> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
  });

  const clean_path = file_path.replace(/^\/+/, '').replace(/\+/g, '');
  const path_parts = clean_path.split('/');
  const filename_raw = path_parts.pop() || 'file';
  // Strip extension for clean Cloudinary public_id
  const filename = filename_raw.replace(/\.[^/.]+$/, '');
  const folder_path = path_parts.length > 0 ? path_parts.join('/') : undefined;

  const mime = mimetype || 'image/jpeg';
  const base64Data = buffer.toString('base64');
  const fileStr = `data:${mime};base64,${base64Data}`;

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

/**
 * Normalizes Multer file inputs (req.files array/object or req.file) into a flat array and field map
 */
export function extract_multer_files(req: {
  file?: Express.Multer.File;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}): {
  all_files: Express.Multer.File[];
  files_by_field: Map<string, Express.Multer.File[]>;
} {
  const all_files: Express.Multer.File[] = [];
  const files_by_field = new Map<string, Express.Multer.File[]>();

  if (req.file) {
    all_files.push(req.file);
    const field = req.file.fieldname || 'file';
    files_by_field.set(field, [req.file]);
  }

  if (req.files) {
    if (Array.isArray(req.files)) {
      req.files.forEach((f) => {
        all_files.push(f);
        const field = f.fieldname || 'files';
        const existing = files_by_field.get(field) || [];
        existing.push(f);
        files_by_field.set(field, existing);
      });
    } else if (typeof req.files === 'object') {
      Object.entries(req.files).forEach(([fieldname, file_list]) => {
        if (Array.isArray(file_list)) {
          file_list.forEach((f) => {
            all_files.push(f);
            const existing = files_by_field.get(fieldname) || [];
            existing.push(f);
            files_by_field.set(fieldname, existing);
          });
        }
      });
    }
  }

  return { all_files, files_by_field };
}

/**
 * Uploads an array of Multer files to Cloudinary concurrently in parallel
 */
export async function upload_multiple_to_cloudinary(
  files: Express.Multer.File[],
  folder_prefix: string
): Promise<{ secure_url: string; public_id: string; resource_type: string }[]> {
  if (!files || files.length === 0) return [];

  const upload_promises = files.map((file, idx) => {
    const orig_name = file.originalname ? file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_') : 'file';
    const filename = `${Date.now()}_${idx}_${orig_name}`;
    return upload_to_cloudinary(file.buffer, `${folder_prefix}/${filename}`, file.mimetype);
  });

  return Promise.all(upload_promises);
}


