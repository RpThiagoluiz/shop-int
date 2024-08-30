import { ConfirmMeasureRequestDTO } from '../../../src/core/dtos/confirmMeasureDTO'
import { ConfirmMeasureUseCase } from '../../../src/core/useCases/confirmMeasureUseCase'
import { FindMeasureById } from '../../../src/types/findMeasuseById'
import { mockMeasureRepository } from '../mock/mockMeasureRepository'

describe('ConfirmMeasureUseCase', () => {
   let confirmMeasureUseCase: ConfirmMeasureUseCase

   beforeEach(() => {
      confirmMeasureUseCase = new ConfirmMeasureUseCase(mockMeasureRepository)
   })

   it('should be return an error if the confirmation value is invalid', async () => {
      const invalidData: ConfirmMeasureRequestDTO = {
         measure_uuid: '123',
         confirmed_value: 'invalid_value' as unknown as number
      }

      const result = await confirmMeasureUseCase.execute(invalidData)

      expect(result).toEqual({
         error_status: 400,
         error_code: 'INVALID_DATA',
         error_description: expect.any(String)
      })
   })

   it('should be return an error if the reading is not found', async () => {
      const validData: ConfirmMeasureRequestDTO = {
         measure_uuid: 'valid-uuid',
         confirmed_value: 100
      }

      const result = await confirmMeasureUseCase.execute(validData)

      expect(result).toEqual({
         error_status: 404,
         error_code: 'MEASURE_NOT_FOUND',
         error_description: 'Leitura não encontrada'
      })
   })

   it('should be return an error if the read has already been confirmed', async () => {
      const validData: ConfirmMeasureRequestDTO = {
         measure_uuid: 'valid-uuid',
         confirmed_value: 100
      }

      const existingMeasure: FindMeasureById = {
         measure_uuid: 'valid-uuid',
         has_confirmed: true
      }

      mockMeasureRepository.findByUuid.mockResolvedValueOnce(existingMeasure)

      const result = await confirmMeasureUseCase.execute(validData)

      expect(result).toEqual({
         error_status: 404,
         error_code: 'CONFIRMATION_DUPLICATE',
         error_description: 'Leitura do mês já realizada'
      })
   })

   it('should be successful', async () => {
      const validData: ConfirmMeasureRequestDTO = {
         measure_uuid: 'valid-uuid',
         confirmed_value: 100
      }

      const existingMeasure: FindMeasureById = {
         measure_uuid: 'valid-uuid',
         has_confirmed: false
      }

      mockMeasureRepository.findByUuid.mockResolvedValueOnce(existingMeasure)
      mockMeasureRepository.confirmMeasure.mockResolvedValueOnce()

      const result = await confirmMeasureUseCase.execute(validData)

      expect(result).toEqual({ success: true })
      expect(mockMeasureRepository.confirmMeasure).toHaveBeenCalledWith({
         measure_uuid: 'valid-uuid',
         confirmed_value: 100,
         has_confirmed: true
      })
   })
})
