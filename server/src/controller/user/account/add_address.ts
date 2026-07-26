import { Response } from 'express';
import { ZodError } from 'zod';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { User } from '../../../models/user.js';
import { add_address_schema } from '../../../validations/user.js';

import { normalizeDefaultAddress } from '../../../utils/address_helper.js';

export async function add_address(
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

    const zod_result = add_address_schema.safeParse(req.body);

    if (!zod_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: zod_result.error.flatten().fieldErrors,
      });
      return;
    }

    const address_data = zod_result.data;

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

    user.saved_address.push({
      ...address_data,
      is_default: address_data.is_default || false,
    });

    const new_added_address = user.saved_address[user.saved_address.length - 1];

    normalizeDefaultAddress(
      user.saved_address,
      address_data.is_default && new_added_address._id
        ? new_added_address._id.toString()
        : undefined
    );

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully.',
      data: {
        added_address: new_added_address,
        saved_address: user.saved_address,
      },
    });
    return;
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: err.flatten().fieldErrors,
      });
      return;
    }
    if (err instanceof Error) {
      res.status(500).json({
        success: false,
        message: err.message || 'An unexpected system error occurred.',
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'An unexpected system error occurred.',
    });
    return;
  }
}
