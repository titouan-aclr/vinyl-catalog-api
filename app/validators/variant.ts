import vine from '@vinejs/vine'

export const createVariantValidator = vine.create({
  sku: vine.string().trim().minLength(1).maxLength(64),
  format: vine.enum(['LP', 'EP', 'SINGLE', 'CD', 'CASSETTE']),
  color: vine.string().trim().maxLength(64).optional(),
  priceCents: vine.number().withoutDecimals().min(0),
  currency: vine.string().trim().fixedLength(3),
  stock: vine.number().withoutDecimals().min(0).optional(),
  status: vine.enum(['draft', 'available', 'sold_out']).optional(),
})
