import router from '@adonisjs/core/services/router'

const ProductsController = () => import('#controllers/products_controller')

router.resource('products', ProductsController).only(['index', 'store', 'show'])
