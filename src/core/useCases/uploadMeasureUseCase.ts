import { Buffer } from 'buffer';
import { GeminiApiClient } from '../../infra/external/LLM'
import { ErrorType } from '../../types/errorType'
import { MeasureEnum } from '../../types/measureType'
import { UploadMeasureRequestDTO, UploadMeasureResponseDTO } from '../dtos/uploadMeasureDTO'
import { MeasureEntity } from '../entities/measureEntity'
import { MeasureRepository } from '../repositories/MeasureRepository'

export class UploadMeasureUseCase {
   constructor(
      private measureRepository: MeasureRepository,
      private geminiApiClient: GeminiApiClient,
   ) { }

   async execute(data: UploadMeasureRequestDTO): Promise<UploadMeasureResponseDTO | ErrorType> {

      const checkData = verifyFields(data)

      if (!checkData.isValid) {
         return {
            error_status: 400,
            error_code: 'INVALID_DATA',
            error_description: checkData.message!
         }
      }


      // Logica para validar se a data é do mesmo mês se for retorna.
      // const findMeasure = await this.measureRepository.listMeasuresByCustomer({
      //    customerCode: data.customerCode,
      //    measureType: data.measureType
      // })

      // if (findMeasure) {
      //    
      //    return {
      //       error_status: 409,
      //       error_code: 'DOUBLE_REPORT',
      //       error_description: 'Leitura do mês já realizada'
      //    }
      // }

      const LLMResponse = await this.geminiApiClient.getMeasureFromImage({
         imageBase64: data.image,
         measureType: data.measure_type
      })

      if ('error_code' in LLMResponse) {
         return {
            error_status: LLMResponse.error_status,
            error_code: LLMResponse.error_code,
            error_description: LLMResponse.error_description,

         }
      }

      const newMeasure = new MeasureEntity({
         measure_uuid: LLMResponse.measure_uuid,
         customer_code: data.customer_code,
         measure_datetime: data.measure_datetime,
         measure_type: data.measure_type,
         measure_value: LLMResponse.measure_value,
         image_url: LLMResponse.image_url
      })

      /**
       * TODO:
       * lidar com erros ao salvar no banco de dados
       * Rollback
       */

      await this.measureRepository.save({ measure: newMeasure })

      return {
         image_url: LLMResponse.image_url,
         measure_value: LLMResponse.measure_value,
         measure_uuid: LLMResponse.measure_uuid,
      }
   }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function verifyFields(data: any): {
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

   // if (!isValidImage(data.image)) {
   //    isValid = false
   //    fieldsErros.push('formato da imagem')
   // }

   if (typeof data.customer_code !== 'string') {
      isValid = false
      fieldsErros.push('código do cliente')
   }
   if (typeof data.measure_datetime !== 'string') {
      isValid = false
      fieldsErros.push('data mensurada')
   }

   if (data.measure_type !== MeasureEnum.GAS && data.measure_type !== MeasureEnum.WATER) {
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



function isValidImage(base64String: string): boolean {

   if (typeof base64String !== 'string') {
      return false
   }

   const regex = /^data:image\/(png|jpeg|WEBP|HEIC|HEIF);base64,/;
   if (!regex.test(base64String)) {
      return false;
   }

   const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

   try {
      Buffer.from(base64Data, 'base64');
      return true;
   } catch (error) {
      console.error('ERROR IN validateBase64Image', { error })
      return false;
   }
}