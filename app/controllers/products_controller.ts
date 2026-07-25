import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ProductRepository from '#repositories/product_repository'
import { createProductValidator } from '#validators/product'

@inject()
export default class ProductsController {
  constructor(private productRepository: ProductRepository) {}

  async index({ request }: HttpContext) {
    const page = Math.max(1, Number(request.input('page', 1)) || 1)
    const perPage = Math.min(100, Math.max(1, Number(request.input('perPage', 20)) || 20))

    return this.productRepository.findAll({
      limit: perPage,
      offset: (page - 1) * perPage,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)
    const product = await this.productRepository.create(payload)

    return response.created(product)
  }

  async show({ params, response }: HttpContext) {
    const product = await this.productRepository.findById(Number(params.id))

    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    return product
  }
}
