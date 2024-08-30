import { Router } from 'express'
import { uploadMeasureFunction } from '../function/uploadMeasureFunction'
import { listMeasureFunction } from '../function/listMeasureFunction'
import { confirmMeasureFunction } from '../function/confirmMeasureFunction'
import { multipartMiddleware } from '../middleware/multpart.middleware'


const router = Router()

router.post('/upload', multipartMiddleware.upload().single('image'), (req, res) =>
   uploadMeasureFunction.handle(req, res)
)

router.patch('/confirm', (req, res) => confirmMeasureFunction.handle(req, res))
router.get('/:customer_code/list', (req, res) => listMeasureFunction.handle(req, res))
export default router
