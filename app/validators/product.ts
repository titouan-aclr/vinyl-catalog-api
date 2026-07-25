import vine from '@vinejs/vine'

export const createProductValidator = vine.create({
  title: vine.string().trim().minLength(1).maxLength(255),
  artist: vine.string().trim().minLength(1).maxLength(255),
  releaseYear: vine.number().withoutDecimals().min(1900).max(2100).optional(),
})
