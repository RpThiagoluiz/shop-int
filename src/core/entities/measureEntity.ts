import { type MeasureType } from '../../types/measureType'

type MeasureData = {
   measure_uuid: string
   customer_code: string
   measure_datetime: Date
   measure_type: MeasureType
   measure_value: number
   // has_confirmed: boolean -> banco que envia esse dado como default false
   image_url: string
}

export class MeasureEntity {
   public readonly measure_uuid: string
   public readonly customer_code: string
   public readonly measure_datetime: Date
   public readonly measure_type: MeasureType
   public readonly measure_value: number
   public readonly image_url: string

   public constructor(data: MeasureData) {
      this.measure_uuid = data.measure_uuid
      this.customer_code = data.customer_code
      this.measure_datetime = data.measure_datetime
      this.measure_type = data.measure_type
      this.measure_value = data.measure_value
      this.image_url = data.image_url
   }

}
