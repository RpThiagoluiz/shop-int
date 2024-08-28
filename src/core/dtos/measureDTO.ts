import { type MeasureType } from '../../types/measureType'

export interface MeasureDTO {
   uuid: string
   customerCode: string
   measureDatetime: Date
   measureType: MeasureType
   measureValue: number
   confirmed: boolean
   imageUrl: string
}
