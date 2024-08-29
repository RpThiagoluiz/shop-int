import { type MeasureType } from '../../types/measureType'

export type UploadMeasureRequestDTO = {
   image: string
   customer_code: string
   measure_datetime: Date
   measure_type: MeasureType
}

export type UploadMeasureResponseDTO = {
   image_url: string
   measure_value: number
   measure_uuid: string
}
