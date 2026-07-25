import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ProductRepository from '#repositories/product_repository'
import VariantRepository from '#repositories/variant_repository'
import VariantService from '#services/variant_service'
import { createVariantValidator, updateStockValidator } from '#validators/variant'

@inject()
export default class VariantsController {
  constructor(
    private productRepository: ProductRepository,
    private variantRepository: VariantRepository,
    private variantService: VariantService
  ) {}

  async index({ params, response }: HttpContext) {
    const productId = Number(params.productId)

    const product = await this.productRepository.findById(productId)
    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    return this.variantRepository.findByProductId(productId)
  }

  async store({ params, request, response }: HttpContext) {
    const productId = Number(params.productId)

    const product = await this.productRepository.findById(productId)
    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    const payload = await request.validateUsing(createVariantValidator)
    const variant = await this.variantRepository.create({
      ...payload,
      productId,
      color: payload.color ?? null,
    })

    return response.created(variant)
  }

  async updateStock({ params, request }: HttpContext) {
    const { delta } = await request.validateUsing(updateStockValidator)

    return this.variantService.adjustStock(Number(params.id), delta)
  }
}
