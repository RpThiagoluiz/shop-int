
import { UploadMeasureController } from '../../../core/controllers/uploadMeasureController'
import { UploadMeasureUseCase } from '../../../core/useCases/uploadMeasureUseCase'
import { PostgresMeasureRepository } from '../../db/measureRepository'
import { GeminiApiClient } from '../../external/LLM'

const geminiApiClient = new GeminiApiClient()
const measureRepository = new PostgresMeasureRepository()

const uploadMeasureUseCase = new UploadMeasureUseCase(measureRepository, geminiApiClient)
export const uploadMeasureFunction = new UploadMeasureController(uploadMeasureUseCase)