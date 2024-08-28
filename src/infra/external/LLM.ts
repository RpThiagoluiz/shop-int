import { ErrorType } from '../../types/errorType'
import { MeasureType } from '../../types/measureType';


type GeminiApiClientResponse = | {
   image_url: string
   measure_value: number
   measure_uuid: string
}

type Result = | GeminiApiClientResponse | ErrorType

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
               "image_url": `image_url MOCK`,
               "measure_uuid": 'measure_uuid MOCK',
               "measure_value": 15
            }
         }

         return {
            image_url: response.data.image_url,
            measure_uuid: response.data.measure_uuid,
            measure_value: response.data.measure_value,
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