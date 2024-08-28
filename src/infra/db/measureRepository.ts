import { MeasureType } from '../../types/measureType'
import { MeasureRepository } from '../../core/repositories/MeasureRepository'
import { MeasureEntity } from '../../core/entities/measureEntity'

export class PostgresMeasureRepository implements MeasureRepository {
   findByUuid({ measureUuid }: { measureUuid: string }): Promise<MeasureEntity> {
      throw new Error('Method not implemented.')
   }
   confirmMeasure({ measureUuid, confirmedValue }: { measureUuid: string; confirmedValue: number }): Promise<void> {
      throw new Error('Method not implemented.')
   }
   listMeasuresByCustomer({ customerCode, measureType }: { customerCode: string; measureType?: MeasureType }): Promise<MeasureEntity[]> {
      throw new Error('Method not implemented.')
   }
   // findByUuid({ measureUuid }: { measureUuid: string }): Promise<MeasureEntity> {
   //    throw new Error('Method not implemented.')
   // }
   // confirmMeasure({ measureUuid, confirmedValue }: { measureUuid: string; confirmedValue: number }): Promise<void> {
   //    throw new Error('Method not implemented.')
   // }
   // listMeasuresByCustomer({ customerCode, measureType }: { customerCode: string; measureType?: MeasureType }): Promise<MeasureEntity[]> {
   //    throw new Error('Method not implemented.')
   // }

   async save({ measure }: { measure: MeasureEntity }): Promise<void> {
      console.log({ measure })
      // await this.db.insert('measures', {
      //    uuid: measure.uuid,
      //    customer_code: measure.customerCode,
      //    measure_datetime: measure.measureDatetime,
      //    measure_type: measure.measureType,
      //    measure_value: measure.measureValue,
      //    confirmed: measure.confirmed,
      //    image_url: measure.imageUrl
      // })
   }

   // async findByCustomerCodeAndMonth({
   //    customerCode,
   //    measureType
   // }: {
   //    customerCode: string
   //    measureType: MeasureType
   // }): Promise<Measure | null> {
   //    const result = await this.db
   //       .query('measures')
   //       .where({
   //          customer_code: customerCode,
   //          measure_type: measureType
   //       })
   //       .first()

   //    return result
   //       ? new Measure(
   //          result.uuid,
   //          result.customer_code,
   //          result.measure_datetime,
   //          result.measure_type,
   //          result.measure_value,
   //          result.confirmed,
   //          result.image_url
   //       )
   //       : null
   // }

   // async findByUuid({ measureUuid }: { measureUuid: string }): Promise<Measure | null> {
   //    const result = await this.db.query('measures').where({ uuid: measureUuid }).first()

   //    return result
   //       ? new Measure(
   //          result.uuid,
   //          result.customer_code,
   //          result.measure_datetime,
   //          result.measure_type,
   //          result.measure_value,
   //          result.confirmed,
   //          result.image_url
   //       )
   //       : null
   // }

   // async confirmMeasure({
   //    measureUuid,
   //    confirmedValue
   // }: {
   //    measureUuid: string
   //    confirmedValue: number
   // }): Promise<void> {
   //    await this.db
   //       .update('measures')
   //       .set({ measure_value: confirmedValue, confirmed: true })
   //       .where({ uuid: measureUuid })
   // }

   // async listMeasuresByCustomer({
   //    customerCode,
   //    measureType
   // }: {
   //    customerCode: string
   //    measureType?: MeasureType
   // }): Promise<Measure[]> {
   //    const query = this.db.query('measures').where({ customer_code: customerCode })

   //    if (measureType) {
   //       query.where({ measure_type: measureType })
   //    }

   //    const results = await query

   //    return results.map(
   //       (result) =>
   //          new Measure(
   //             result.uuid,
   //             result.customer_code,
   //             result.measure_datetime,
   //             result.measure_type,
   //             result.measure_value,
   //             result.confirmed,
   //             result.image_url
   //          )
   //    )
   // }
}
