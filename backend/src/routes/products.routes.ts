import { Router } from 'express'

import * as productsController from '../controllers/products.controller'

import { validate } from '../middlewares/validate.middleware'
import * as productsSchemas from '../validations/products.validation'

const router = Router()

router.delete('/:id', productsController.deleteProduct)
router.get('/:id', productsController.getProductById)
router.get('/', productsController.getAllProducts)
router.get('/count/total', productsController.getTotalProductsCount)
router.get(
  '/count/this-month',
  productsController.getTotalProductsCountThisMonth
)
router.get('/count/this-week', productsController.getTotalProductsCountThisWeek)

router.put(
  '/:id',
  validate(productsSchemas.UpdateProductSchema),
  productsController.updateProduct
)
router.post(
  '/',
  validate(productsSchemas.CreateProductSchema),
  productsController.createProduct
)

export default router
