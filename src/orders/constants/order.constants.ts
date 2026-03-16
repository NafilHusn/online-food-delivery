import { FieldPermission } from '../../permission/guards/field-permission.guard';

export const ORDER_FIELD_PERMISSIONS: Record<string, FieldPermission> = {
  paymentMethod: { permissions: ['order:payment:method:update'] },
  status: { permissions: ['order:status:update'] },
  paymentStatus: { permissions: ['order:payment:status:update'] },
};
