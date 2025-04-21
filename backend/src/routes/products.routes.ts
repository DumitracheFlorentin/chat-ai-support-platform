import { Router } from 'express'
import * as productsController from '../controllers/products.controller'

const router = Router()

router.post('/', productsController.createProduct)
router.get('/', productsController.getAllProducts)
router.get('/:id', productsController.getProductById)
router.put('/:id', productsController.updateProduct)
router.delete('/:id', productsController.deleteProduct)

export default router
