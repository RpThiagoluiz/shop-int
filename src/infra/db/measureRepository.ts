import { type MeasureType } from '../../types/measureType'
import { MeasureRepository } from '../../core/repositories/MeasureRepository'
import { MeasureEntity } from '../../core/entities/measureEntity'

export class PostgresMeasureRepository implements MeasureRepository {
   findByUuid({ measure_uuid }: { measure_uuid: string }): Promise<MeasureEntity> {
      const mockedData: MeasureEntity = {
         measure_uuid: measure_uuid,
         customer_code: 'params.customer_code',
         measure_datetime: '2024-08-29T11:02:02Z',
         measure_type: 'WATER',
         measure_value: 123.45,
         has_confirmed: false,
         image_url: 'https://example.com/image.jpg'
      }

      return Promise.resolve(mockedData)
   }
   confirmMeasure({
      measure_uuid,
      confirmed_value
   }: {
      measure_uuid: string
      confirmed_value: number
   }): Promise<void> {
      const mockedData: MeasureEntity = {
         measure_uuid: measure_uuid,
         customer_code: 'params.customer_code',
         measure_datetime: '2024-08-29T11:02:02Z',
         measure_type: 'WATER',
         measure_value: confirmed_value,
         has_confirmed: true,
         image_url: 'https://example.com/image.jpg'
      }

      return Promise.resolve()
   }
   listMeasuresByCustomer({
      customer_code,
      measure_type
   }: {
      customer_code: string
      measure_type?: MeasureType
   }): Promise<MeasureEntity[] | []> {
      const mockedData: MeasureEntity[] = [
         {
            measure_uuid: 'uuid1',
            customer_code: 'params.customer_code',
            measure_datetime: '2024-08-29T11:02:02Z',
            measure_type: 'WATER',
            measure_value: 123.45,
            has_confirmed: false,
            image_url: 'https://example.com/image.jpg'
         },
         {
            measure_uuid: 'uuid3',
            customer_code: 'params.customer_code',
            measure_datetime: '2024-08-29T11:02:02Z',
            measure_type: 'WATER',
            measure_value: 123.45,
            has_confirmed: false,
            image_url: 'https://example.com/image.jpg'
         },
         {
            measure_uuid: 'uuid2',
            customer_code: 'params.customer_code',
            measure_datetime: '2024-08-29T11:02:02Z',
            measure_type: 'GAS',
            measure_value: 123.45,
            has_confirmed: false,
            image_url: 'https://example.com/image.jpg'
         }
      ]

      return Promise.resolve(mockedData)
   }

   async save({ measure }: { measure: MeasureEntity }): Promise<void> {
      console.log({ measure })
      // recuperar o retorno da criação
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
