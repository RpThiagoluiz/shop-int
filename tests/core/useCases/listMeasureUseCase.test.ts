import { mockMeasureRepository } from '../mock/mockMeasureRepository'
import { MeasureType } from '@prisma/client'
import { MeasureEnum } from '../../../src/types/measureType'
import { ListMeasuresRequestDTO } from '../../../src/core/dtos/listMeasureDTO'
import { ListMeasuresUseCase } from '../../../src/core/useCases/listMeasureUseCase'

describe('ListMeasuresUseCase', () => {
   let listMeasuresUseCase: ListMeasuresUseCase

   beforeEach(() => {
      listMeasuresUseCase = new ListMeasuresUseCase(mockMeasureRepository)
   })

   it('should be return an error if the measurement type is invalid', async () => {
      const invalidData: ListMeasuresRequestDTO = {
         customer_code: '12345',
         measure_type: 'INVALID_TYPE' as MeasureType
      }

      const result = await listMeasuresUseCase.execute(invalidData)

      expect(result).toEqual({
         error_status: 400,
         error_code: 'INVALID_TYPE',
         error_description: 'Tipo de medição não permitida'
      })
   })

   it('should be return an error if no reading is found', async () => {
      const validData: ListMeasuresRequestDTO = {
         customer_code: '12345',
         measure_type: MeasureEnum.GAS
      }

      mockMeasureRepository.listMeasuresByCustomer.mockResolvedValueOnce([])

      const result = await listMeasuresUseCase.execute(validData)

      expect(result).toEqual({
         error_status: 404,
         error_code: 'MEASURES_NOT_FOUND',
         error_description: 'Nenhuma leitura encontrada'
      })
   })

   it('should be success', async () => {
      const validData: ListMeasuresRequestDTO = {
         customer_code: '12345',
         measure_type: MeasureEnum.WATER
      }

      const mockMeasures = [
         {
            measure_uuid: 'uuid-1',
            measure_datetime: new Date(),
            measure_type: MeasureEnum.WATER,
            has_confirmed: true,
            image_url: 'http://example.com/image1.jpg'
         },
         {
            measure_uuid: 'uuid-2',
            measure_datetime: new Date(),
            measure_type: MeasureEnum.WATER,
            has_confirmed: false,
            image_url: 'http://example.com/image2.jpg'
         }
      ]

      mockMeasureRepository.listMeasuresByCustomer.mockResolvedValueOnce(mockMeasures)

      const result = await listMeasuresUseCase.execute(validData)

      expect(result).toEqual({
         customer_code: validData.customer_code,
         measures: mockMeasures.map((measure) => ({
            measure_uuid: measure.measure_uuid,
            measure_datetime: measure.measure_datetime,
            measure_type: measure.measure_type,
            has_confirmed: measure.has_confirmed,
            image_url: measure.image_url
         }))
      })

      expect(mockMeasureRepository.listMeasuresByCustomer).toHaveBeenCalledWith({
         customer_code: validData.customer_code,
         measure_type: MeasureEnum.WATER
      })
   })
})
