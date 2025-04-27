import { Router } from 'express'

import * as productsController from '../controllers/products.controller'

const router = Router()

router.delete('/:id', productsController.deleteProduct)
router.get('/:id', productsController.getProductById)
router.put('/:id', productsController.updateProduct)
router.post('/', productsController.createProduct)
router.get('/', productsController.getAllProducts)

export default router
