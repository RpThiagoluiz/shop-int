export interface ConfirmMeasureRequestDTO {
   measure_uuid: string
   confirmed_value: number
}

export interface ConfirmMeasureResponseDTO {
   success: boolean
}
