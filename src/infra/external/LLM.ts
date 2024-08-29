import { ServiceError } from '../../types/ServiceError'
import { MeasureType } from '../../types/measureType'

type GeminiApiClientResponse = {
   measure_value: number
}

type Result = GeminiApiClientResponse | ServiceError

export class GeminiApiClient {
   async getMeasureFromImage({
      imageBase64,
      measureType
   }: {
      imageBase64: string
      measureType: MeasureType
   }): Promise<Result> {
      try {
         console.debug({ imageBase64, measureType })
         const response = {
            data: {
               measure_value: 15
            }
         }

         return {
            measure_value: response.data.measure_value
         }
      } catch (error) {
         console.error(error)

         return {
            error_status: 500,
            error_code: 'LLM_001',
            error_description:
               'Ocorreu um erro durante a leitura da sua image, por favor tente novamente mais tarde.'
         }
      }
   }
}

// function getMimeTypeFromBase64(base64String: string): string | null {
//    const match = base64String.match(/^data:image\/(\w+);base64,/i);
//    return match ? match[1] : null;
// }
