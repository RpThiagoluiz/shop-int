import { MeasureType } from '../../types/measureType'
import { MeasureEntity } from '../entities/measureEntity'

export interface MeasureRepository {
   findByUuid({ measureUuid }: { measureUuid: string }): Promise<MeasureEntity>
   save({ measure }: { measure: MeasureEntity }): Promise<void>
   confirmMeasure({
      measureUuid,
      confirmedValue
   }: {
      measureUuid: string
      confirmedValue: number
   }): Promise<void>
   listMeasuresByCustomer({
      customerCode,
      measureType
   }: {
      customerCode: string
      measureType?: MeasureType
   }): Promise<MeasureEntity[]>
}
