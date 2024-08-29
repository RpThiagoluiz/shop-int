import { MeasureType } from '../../types/measureType'

export interface ListMeasuresRequestDTO {
   customer_code: string
   measure_type?: string
}

export interface MeasureResponseDTO {
   measure_uuid: string
   measure_datetime: Date
   measure_type: MeasureType
   has_confirmed: boolean
   image_url?: string
}

export interface ListMeasuresResponseDTO {
   customer_code: string
   measures: MeasureResponseDTO[]
}
