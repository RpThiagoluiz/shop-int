import { MeasureRepository } from '../repositories/MeasureRepository'
import { ListMeasuresRequestDTO, ListMeasuresResponseDTO } from '../dtos/listMeasureDTO'
import { ServiceError } from '../../types/ServiceError'
import { MeasureEnum, MeasureType } from '../../types/measureType'

export class ListMeasuresUseCase {
  constructor(private measureRepository: MeasureRepository) { }

  async execute(
    queryParams: ListMeasuresRequestDTO
  ): Promise<ListMeasuresResponseDTO | ServiceError> {
    const filterMeasureType = checkMeasureType(queryParams.measure_type)

    if (!filterMeasureType.isValid) {
      return {
        error_status: 400,
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida'
      }
    }

    const measures = await this.measureRepository.listMeasuresByCustomer({
      customer_code: queryParams.customer_code,
      ...(queryParams.measure_type && { measure_type: filterMeasureType.measure_type })
    })

    if (measures.length === 0) {
      return {
        error_status: 404,
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada'
      }
    }

    return {
      customer_code: queryParams.customer_code,
      measures: measures.map((measure) => ({
        measure_uuid: measure.measure_uuid,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image_url
      }))
    }
  }
}

function checkMeasureType(measureType?: string): {
  isValid: boolean
  measure_type?: MeasureType
} {



  if (measureType) {
    const measureTypeUpperCase = measureType.toUpperCase()
    const isValid = measureTypeUpperCase === MeasureEnum.WATER || measureTypeUpperCase === MeasureEnum.GAS
    return {
      isValid,
      ...(isValid && { measure_type: measureTypeUpperCase as MeasureType })
    }
  }

  return {
    isValid: true
  }
}
