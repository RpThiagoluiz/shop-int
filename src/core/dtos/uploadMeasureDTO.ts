import { type MeasureType } from '../../types/measureType'

export type UploadMeasureRequestDTO = {
   image_temp_info: {
      protocol: string
      host: string
   }
   image: Express.Multer.File | undefined
   customer_code: string
   measure_datetime: Date
   measure_type: MeasureType
}

export type UploadMeasureResponseDTO = {
   image_url: string
   measure_value: number
   measure_uuid: string
}
