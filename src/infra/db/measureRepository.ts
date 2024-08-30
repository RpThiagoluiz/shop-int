import { type MeasureType } from '../../types/measureType'
import { MeasureRepository } from '../../core/repositories/MeasureRepository'
import { MeasureEntity } from '../../core/entities/measureEntity'
import { db } from './connection'
import { type CreateMeasureResponse } from '../../types/createMeasureResponse'
import { type ListMeasuresByCustomerResponse } from '../../types/listMeasureResponse'
import { type FindMeasureById } from '../../types/findMeasuseById'

export class PostgresMeasureRepository implements MeasureRepository {
   private measureDB = db.measure

   async findByUuid({ measure_uuid }: { measure_uuid: string }): Promise<FindMeasureById> {
      const measure = await this.measureDB.findFirst({
         select: {
            measure_uuid: true,
            has_confirmed: true
         },
         where: {
            measure_uuid
         }
      })

      return measure
   }

   async confirmMeasure({
      measure_uuid,
      confirmed_value,
      has_confirmed
   }: {
      measure_uuid: string
      confirmed_value: number
      has_confirmed: boolean
   }): Promise<void> {
      await this.measureDB.update({
         where: {
            measure_uuid
         },
         data: {
            measure_value: confirmed_value,
            has_confirmed: has_confirmed
         }
      })
   }

   async listMeasuresByCustomer({
      customer_code,
      measure_type
   }: {
      customer_code: string
      measure_type?: MeasureType
   }): Promise<ListMeasuresByCustomerResponse[] | []> {
      const measures = await this.measureDB.findMany({
         select: {
            measure_uuid: true,
            measure_datetime: true,
            measure_type: true,
            has_confirmed: true,
            image_url: true
         },
         where: {
            customer_code,
            ...(measure_type && { measure_type })
         }
      })

      return measures
   }

   async save({ data }: { data: MeasureEntity }): Promise<CreateMeasureResponse> {
      const measure = await this.measureDB.create({
         data: {
            customer_code: data.customer_code,
            measure_datetime: data.measure_datetime,
            measure_type: data.measure_type,
            measure_value: data.measure_value,
            image_url: data.image_url
         }
      })

      return {
         measure_uuid: measure.measure_uuid,
         image_url: measure.image_url,
         measure_value: measure.measure_value
      }
   }
}
