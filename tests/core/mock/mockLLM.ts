/* eslint-disable @typescript-eslint/no-unused-vars */
import { MeasureType } from '@prisma/client'
import { LLMApiClient, LLMApiClientResponse } from '../../../src/infra/external/LLM'

export const mockGetMeasureFromImage = jest.fn()

export class MockLLMApiClient extends LLMApiClient {
   async getMeasureFromImage({
      imageBase64,
      measureType
   }: {
      imageBase64: Express.Multer.File | undefined
      measureType: MeasureType
   }): Promise<LLMApiClientResponse> {
      return {
         measure_value: 123.45
      }
   }
}
