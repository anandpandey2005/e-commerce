import { IAddress } from '../models/types/user.js';

/**
 * Normalizes default address status in user's saved_address array.
 * Ensures that if saved_address is not empty, exactly one address has is_default = true.
 * If target_default_id is provided, sets that address to true and all others to false.
 * If target_default_id is not provided:
 *   - Keeps the existing default address if exactly one exists (resetting any duplicates).
 *   - If no default address exists in the DB, sets index 0 to is_default = true.
 */
export function normalizeDefaultAddress(
  saved_address: IAddress[],
  target_default_id?: string
): void {
  if (!saved_address || saved_address.length === 0) {
    return;
  }

  if (target_default_id) {
    let targetFound = false;
    saved_address.forEach((addr) => {
      if (addr._id && addr._id.toString() === target_default_id) {
        addr.is_default = true;
        targetFound = true;
      } else {
        addr.is_default = false;
      }
    });

    if (!targetFound) {
      saved_address[0].is_default = true;
      for (let i = 1; i < saved_address.length; i++) {
        saved_address[i].is_default = false;
      }
    }
  } else {
    const existingDefaultIndex = saved_address.findIndex(
      (addr) => addr.is_default === true
    );

    if (existingDefaultIndex === -1) {
      saved_address[0].is_default = true;
      for (let i = 1; i < saved_address.length; i++) {
        saved_address[i].is_default = false;
      }
    } else {
      saved_address.forEach((addr, idx) => {
        addr.is_default = idx === existingDefaultIndex;
      });
    }
  }
}
