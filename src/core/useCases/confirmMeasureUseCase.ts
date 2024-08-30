import { MeasureRepository } from '../repositories/MeasureRepository'
import { ConfirmMeasureRequestDTO, ConfirmMeasureResponseDTO } from '../dtos/confirmMeasureDTO'
import { ServiceError } from '../../types/ServiceError'

export class ConfirmMeasureUseCase {
   constructor(private measureRepository: MeasureRepository) { }

   async execute(
      data: ConfirmMeasureRequestDTO
   ): Promise<ConfirmMeasureResponseDTO | ServiceError> {
      const verifyMeasure = checkMeasureData(data)

      if (!verifyMeasure.isValid) {
         return {
            error_status: 400,
            error_code: 'INVALID_DATA',
            error_description: verifyMeasure.message!
         }
      }

      const measure = await this.measureRepository.findByUuid({ measure_uuid: data.measure_uuid })

      if (!measure) {
         return {
            error_status: 404,
            error_code: 'MEASURE_NOT_FOUND',
            error_description: 'Leitura não encontrada'
         }
      }

      if (measure.has_confirmed) {
         return {
            error_status: 404,
            error_code: 'CONFIRMATION_DUPLICATE',
            error_description: 'Leitura do mês já realizada'
         }
      }

      await this.measureRepository.confirmMeasure({
         measure_uuid: data.measure_uuid,
         confirmed_value: data.confirmed_value,
         has_confirmed: true
      })

      return { success: true }
   }
}

function checkMeasureData(data: ConfirmMeasureRequestDTO) {
   const requiredKeys = ['measure_uuid', 'confirmed_value']
   const hasAllKeys = requiredKeys.every((key) => key in data)

   console.log({ data, m: typeof data.measure_uuid, dif: typeof data.measure_uuid !== 'string' })

   if (!hasAllKeys)
      return {
         isValid: false,
         message: 'Verifique os campos enviados, alguns campos estão faltando.'
      }

   if (typeof data.measure_uuid !== 'string') {
      return {
         isValid: false,
         message: 'O identificados deve ser enviado corretamente.'
      }
   }

   if (typeof data.confirmed_value !== 'number') {
      return {
         isValid: false,
         message: 'O valor deve ser enviado corretamente, numérico'
      }
   }

   const valueIsInteger = Number.isInteger(data.confirmed_value)

   return {
      isValid: valueIsInteger,
      ...(!valueIsInteger && {
         message: 'O valor enviado precisa ser um numero inteiro.'
      })
   }
}
