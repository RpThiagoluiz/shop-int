import { LLMApiClient } from '../../infra/external/LLM'
import { ServiceError } from '../../types/ServiceError'
import { ListMeasuresByCustomerResponse } from '../../types/listMeasureResponse'
import { MeasureEnum, MeasureType } from '../../types/measureType'
import {
   type UploadMeasureRequestDTO,
   type UploadMeasureResponseDTO
} from '../dtos/uploadMeasureDTO'
import { MeasureEntity } from '../entities/measureEntity'
import { MeasureRepository } from '../repositories/MeasureRepository'

export class UploadMeasureUseCase {
   constructor(
      private measureRepository: MeasureRepository,
      private llmApiClient: LLMApiClient
   ) { }

   async execute({
      data
   }: {
      data: UploadMeasureRequestDTO
   }): Promise<UploadMeasureResponseDTO | ServiceError> {
      const checkData = this.verifyFields(data)

      if (!checkData.isValid) {
         return {
            error_status: 400,
            error_code: 'INVALID_DATA',
            error_description: checkData.message!
         }
      }

      const findMeasure = await this.measureRepository.listMeasuresByCustomer({
         customer_code: data.customer_code,
         measure_type: data.measure_type
      })

      if (this.hasDoubleMeasureByMonth({ measures: findMeasure, newMeasure: data })) {
         return {
            error_status: 409,
            error_code: 'DOUBLE_REPORT',
            error_description: 'Leitura do mês já realizada'
         }
      }

      //TODO: erro de encontrar a imagem
      const image_url = `${data.image_temp_info.protocol}://${data.image_temp_info.host}/temp/${data.image!.filename}`

      const LLMResponse = await this.llmApiClient.getMeasureFromImage({
         imageBase64: data.image,
         measureType: data.measure_type
      })

      if (this.isServiceError(LLMResponse)) {
         return {
            error_status: LLMResponse.error_status,
            error_code: LLMResponse.error_code,
            error_description: LLMResponse.error_description
         }
      }

      const newMeasure = new MeasureEntity({
         customer_code: data.customer_code,
         measure_datetime: data.measure_datetime,
         measure_type: data.measure_type.toUpperCase() as MeasureType,
         measure_value: LLMResponse.measure_value,
         image_url: image_url
      })

      const measureInsert = await this.measureRepository.save({ data: newMeasure })

      return {
         image_url: measureInsert.image_url,
         measure_value: measureInsert.measure_value,
         measure_uuid: measureInsert.measure_uuid
      }
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   private verifyFields(data: any): {
      message?: string
      isValid: boolean
   } {
      const requiredKeys = ['image', 'customer_code', 'measure_datetime', 'measure_type']
      const hasAllKeys = requiredKeys.every((key) => key in data)

      if (!hasAllKeys)
         return {
            isValid: false,
            message: 'Verifique os campos enviados, alguns campos estão faltando.'
         }

      const fieldsErros: string[] = []
      let isValid = true

      if (typeof data.customer_code !== 'string') {
         isValid = false
         fieldsErros.push('código do cliente')
      }

      if (!this.isValidISO8601(data.measure_datetime)) {
         isValid = false
         fieldsErros.push('data mensurada(ISO8601)')
      }

      if (
         data.measure_type.toUpperCase() !== MeasureEnum.GAS &&
         data.measure_type.toUpperCase() !== MeasureEnum.WATER
      ) {
         isValid = false
         fieldsErros.push('tipo mensurado')
      }

      if (!isValid) {
         return {
            isValid,
            message:
               fieldsErros.length > 1
                  ? `Os campo informados precisam ser corrigidos, ${fieldsErros.pop()}.`
                  : `Campo precisa ser corrigido, ${fieldsErros[0]}.`
         }
      }

      return {
         isValid
      }
   }

   private isValidISO8601(dateString: string): boolean {
      const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:.\d+)?Z$/
      return regex.test(dateString)
   }

   private hasDoubleMeasureByMonth({
      measures,
      newMeasure
   }: {
      measures: ListMeasuresByCustomerResponse[] | []
      newMeasure: UploadMeasureRequestDTO
   }): boolean {
      const newMeasureDate = new Date(newMeasure.measure_datetime);
      const newMeasureMonth = newMeasureDate.getMonth();
      const newMeasureYear = newMeasureDate.getFullYear();

      const existingMeasuresForMonth = measures.filter((measure) => {
         const measureDate = new Date(measure.measure_datetime);
         const measureMonth = measureDate.getMonth();
         const measureYear = measureDate.getFullYear();
         return measure.measure_type === newMeasure.measure_type &&
            measureMonth === newMeasureMonth &&
            measureYear === newMeasureYear;
      });

      return existingMeasuresForMonth.length > 0;
   }

   //Poderia ser refatorado para um metodo mais abrangente
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   private isServiceError(response: any): response is ServiceError {
      return response && 'error_code' in response
   }
}
