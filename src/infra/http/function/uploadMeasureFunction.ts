import { UploadMeasureController } from '../../../core/controllers/uploadMeasureController'
import { UploadMeasureUseCase } from '../../../core/useCases/uploadMeasureUseCase'
import { PostgresMeasureRepository } from '../../db/measureRepository'
import { LLMApiClient } from '../../external/LLM'

const llmApiClient = new LLMApiClient()
const measureRepository = new PostgresMeasureRepository()

const uploadMeasureUseCase = new UploadMeasureUseCase(measureRepository, llmApiClient)

export const uploadMeasureFunction = new UploadMeasureController(uploadMeasureUseCase)
