import { Router } from 'express'
import { uploadMeasureFunction } from '../function/uploadMeasureFunction'


const router = Router()

router.get('/healthApi', (req, res) => {
  res.send('Health').status(200)
})

// uploadMeasureFunction.handle(req, res)
router.post('/upload', (req, res) => uploadMeasureFunction.handle(req, res))
// router.patch('/confirm', (req, res) => confirmMeasureController.handle(req, res));
// router.get('/:customer_code/list', (req, res) => listMeasuresController.handle(req, res));

export default router

