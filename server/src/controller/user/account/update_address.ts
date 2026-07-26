import { Response } from 'express';
import { ZodError } from 'zod';
import { AuthenticatedRequest } from '../../../middleware/auth.js';
import { User } from '../../../models/user.js';
import { update_address_schema } from '../../../validations/user.js';

import { normalizeDefaultAddress } from '../../../utils/address_helper.js';

export async function update_address(
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

    const zod_result = update_address_schema.safeParse(req.body);

    if (!zod_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: zod_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { _id, ...update_fields } = zod_result.data;

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

    const address_subdoc = user.saved_address.find(
      (addr) => addr._id && addr._id.toString() === _id
    );

    if (!address_subdoc) {
      res.status(404).json({
        success: false,
        message: 'Address not found with the provided _id.',
      });
      return;
    }

    if (update_fields.tag !== undefined) address_subdoc.tag = update_fields.tag;
    if (update_fields.line_1 !== undefined)
      address_subdoc.line_1 = update_fields.line_1;
    if (update_fields.line_2 !== undefined)
      address_subdoc.line_2 = update_fields.line_2;
    if (update_fields.landmark !== undefined)
      address_subdoc.landmark = update_fields.landmark;
    if (update_fields.state !== undefined)
      address_subdoc.state = update_fields.state;
    if (update_fields.pincode !== undefined)
      address_subdoc.pincode = update_fields.pincode;
    if (update_fields.country !== undefined)
      address_subdoc.country = update_fields.country;
    if (update_fields.is_default !== undefined)
      address_subdoc.is_default = update_fields.is_default;

    normalizeDefaultAddress(
      user.saved_address,
      update_fields.is_default === true ? _id : undefined
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully.',
      data: {
        updated_address: address_subdoc,
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
