import { ListMeasuresController } from '../../../core/controllers/listMeasureController'
import { ListMeasuresUseCase } from '../../../core/useCases/listMeasureUseCase'
import { PostgresMeasureRepository } from '../../db/measureRepository'

const measureRepository = new PostgresMeasureRepository()

const listMeasuresUseCase = new ListMeasuresUseCase(measureRepository)
export const listMeasureFunction = new ListMeasuresController(listMeasuresUseCase)
