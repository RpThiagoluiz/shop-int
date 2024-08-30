import { type CreateMeasureResponse } from '../../types/createMeasureResponse'
import { FindMeasureById } from '../../types/findMeasuseById'
import { ListMeasuresByCustomerResponse } from '../../types/listMeasureResponse'
import { type MeasureType } from '../../types/measureType'
import { MeasureEntity } from '../entities/measureEntity'

export interface MeasureRepository {
   findByUuid({ measure_uuid }: { measure_uuid: string }): Promise<FindMeasureById>
   save({ data }: { data: MeasureEntity }): Promise<CreateMeasureResponse>
   confirmMeasure({
      measure_uuid,
      confirmed_value,
      has_confirmed,
   }: {
      measure_uuid: string
      confirmed_value: number
      has_confirmed: boolean
   }): Promise<void>
   listMeasuresByCustomer({
      customer_code,
      measure_type
   }: {
      customer_code: string
      measure_type?: MeasureType
   }): Promise<ListMeasuresByCustomerResponse[] | []>
}
