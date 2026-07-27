import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { User } from '../../../models/user.js';
import {
    upload_to_cloudinary,
    delete_from_cloudinary,
} from '../../../utils/upload_on_cloudinary.js';

export async function add_avatar(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
            return;
        }

        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No avatar image file provided.',
            });
            return;
        }

        const user = await User.findOne({
            _id: req.user._id,
            is_deleted: false,
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User account not found.',
            });
            return;
        }

        
        const old_public_id = user.avatar?.public_id || null;

        const country_code = user.phone?.country_code || '';
        const number = user.phone?.number || '';
        const phone = `${country_code}${number}`.replace(/[^a-zA-Z0-9_-]/g, '');

        const file_path = `user/${phone}/avatar_${Date.now()}`;

        const result = await upload_to_cloudinary(req.file.buffer, file_path);
        const new_public_id = result.public_id;

        user.avatar = {
            public_id: result.public_id,
            secure_url: result.secure_url,
            resource_type: result.resource_type || 'image',
        };

        try {
            await user.save();
        } catch (saveError) {
            if (new_public_id) {
                try {
                    await delete_from_cloudinary(new_public_id);
                } catch (rollbackError) {
                    console.error(
                        'Failed to delete newly uploaded image after DB error:',
                        rollbackError
                    );
                }
            }
            throw saveError;
        }

        if (old_public_id && old_public_id !== new_public_id) {
            try {
                await delete_from_cloudinary(old_public_id);
            } catch (destroyError) {
                console.error('Failed to destroy old avatar on Cloudinary:', destroyError);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Avatar updated successfully.',
            data: {
                avatar: user.avatar,
            },
        });
        return;
    } catch (err: any) {
        console.error('Error in add_avatar controller:', err);

        const error_message =
            err?.message ||
            (typeof err === 'string' ? err : 'An error occurred while updating avatar.');

        res.status(500).json({
            success: false,
            message: error_message,
        });
        return;
    }
}
