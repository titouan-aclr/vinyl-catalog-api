import router from '@adonisjs/core/services/router'

const ProductsController = () => import('#controllers/products_controller')
const VariantsController = () => import('#controllers/variants_controller')

router.resource('products', ProductsController).only(['index', 'store', 'show'])

router
  .group(() => {
    router.get('/', [VariantsController, 'index'])
    router.post('/', [VariantsController, 'store'])
  })
  .prefix('/products/:productId/variants')
