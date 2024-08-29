import { ConfirmMeasureController } from '../../../core/controllers/confirmMeasureController'
import { ConfirmMeasureUseCase } from '../../../core/useCases/confirmMeasureUseCase'
import { PostgresMeasureRepository } from '../../db/measureRepository'

const measureRepository = new PostgresMeasureRepository()

const confirmMeasuresUseCase = new ConfirmMeasureUseCase(measureRepository)
export const confirmMeasureFunction = new ConfirmMeasureController(confirmMeasuresUseCase)
