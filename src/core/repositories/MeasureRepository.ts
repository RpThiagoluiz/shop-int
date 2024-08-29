import { MeasureType } from '../../types/measureType'
import { MeasureEntity } from '../entities/measureEntity'

export interface MeasureRepository {
   findByUuid({ measure_uuid }: { measure_uuid: string }): Promise<MeasureEntity>
   save({ measure }: { measure: MeasureEntity }): Promise<void>
   confirmMeasure({
      measure_uuid,
      confirmed_value
   }: {
      measure_uuid: string
      confirmed_value: number
   }): Promise<void>
   listMeasuresByCustomer({
      customer_code,
      measure_type
   }: {
      customer_code: string
      measure_type?: MeasureType
   }): Promise<MeasureEntity[]>
}
