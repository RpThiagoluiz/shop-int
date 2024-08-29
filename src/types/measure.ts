import { MeasureType } from './measureType'

export type Measure = {
   measure_uuid: string
   customer_code: string
   measure_datetime: string
   measure_type: MeasureType
   measure_value: number
   has_confirmed: boolean
   image_url: string
}
