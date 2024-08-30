import { MeasureType } from './measureType'

export type ListMeasuresByCustomerResponse = {
   measure_type: MeasureType
   measure_uuid: string
   measure_datetime: Date
   has_confirmed: boolean
   image_url: string
}
