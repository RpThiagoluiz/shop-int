import { mockMeasureRepository } from '../mock/mockMeasureRepository'
import { MockLLMApiClient } from '../mock/mockLLM'
import { UploadMeasureRequestDTO } from '../../../src/core/dtos/uploadMeasureDTO'
import { UploadMeasureUseCase } from '../../../src/core/useCases/uploadMeasureUseCase'
import { MeasureEnum } from '../../../src/types/measureType'
import { MeasureEntity } from '../../../src/core/entities/measureEntity'

describe('UploadMeasureUseCase', () => {
   let uploadMeasureUseCase: UploadMeasureUseCase

   const mockMulterFile = {
      path: 'tests/core/mock/base64.txt',
      mimetype: 'text/plain'
   } as Express.Multer.File

   beforeEach(() => {
      const mockLLMApiClient = new MockLLMApiClient()

      uploadMeasureUseCase = new UploadMeasureUseCase(mockMeasureRepository, mockLLMApiClient)
   })

   it('should return an error if any required field is missing', async () => {
      const invalidData = {
         customer_code: '12345',
         measure_datetime: new Date(),
         measure_type: MeasureEnum.GAS
      }

      const result = await uploadMeasureUseCase.execute({
         data: invalidData as unknown as UploadMeasureRequestDTO
      })

      expect(result).toEqual({
         error_status: 400,
         error_code: 'INVALID_DATA',
         error_description: 'Verifique os campos enviados, alguns campos estão faltando.'
      })
   })

   it('should return an error if the measurement date is invalid', async () => {
      const invalidData = {
         customer_code: '12345',
         measure_datetime: 'invalid-date',
         measure_type: MeasureEnum.GAS,
         image: mockMulterFile,
         image_temp_info: {
            protocol: 'http',
            host: 'localhost'
         }
      }

      const result = await uploadMeasureUseCase.execute({
         data: invalidData as unknown as UploadMeasureRequestDTO
      })

      expect(result).toEqual({
         error_status: 400,
         error_code: 'INVALID_DATA',
         error_description: 'Campo precisa ser corrigido, data mensurada(ISO8601).'
      })
   })

   it('should return an error if a measure already exists for the month', async () => {
      const validData = {
         customer_code: '12345',
         measure_datetime: new Date().toISOString(),
         measure_type: MeasureEnum.GAS,
         image: mockMulterFile,
         image_temp_info: {
            protocol: 'http',
            host: 'localhost'
         }
      }

      mockMeasureRepository.listMeasuresByCustomer.mockResolvedValueOnce([
         {
            measure_datetime: new Date().toISOString() as unknown as Date,
            measure_type: MeasureEnum.GAS,
            image_url: '12345',
            measure_uuid: 'measure_uuid',
            has_confirmed: true
         }
      ])

      const result = await uploadMeasureUseCase.execute({
         data: validData as unknown as UploadMeasureRequestDTO
      })

      expect(result).toEqual({
         error_status: 409,
         error_code: 'DOUBLE_REPORT',
         error_description: 'Leitura do mês já realizada'
      })
   })

   it('should be save a new measure successfully', async () => {
      const validData = {
         customer_code: '12345',
         measure_datetime: new Date().toISOString() as unknown as Date,
         measure_type: MeasureEnum.GAS,
         image: mockMulterFile,
         image_temp_info: {
            protocol: 'http',
            host: 'localhost'
         }
      }

      const mockMeasureEntity = new MeasureEntity({
         customer_code: validData.customer_code,
         measure_datetime: validData.measure_datetime,
         measure_type: validData.measure_type,
         measure_value: 123.45,
         image_url: `${validData.image_temp_info.protocol}://${validData.image_temp_info.host}/temp/${validData.image!.filename}`
      })

      mockMeasureRepository.listMeasuresByCustomer.mockResolvedValueOnce([])
      mockMeasureRepository.save.mockResolvedValueOnce({
         ...mockMeasureEntity,
         measure_uuid: 'measure_uuid'
      })

      const result = await uploadMeasureUseCase.execute({ data: validData })

      expect(result).toEqual({
         image_url: mockMeasureEntity.image_url,
         measure_value: mockMeasureEntity.measure_value,
         measure_uuid: 'measure_uuid'
      })

      expect(mockMeasureRepository.save).toHaveBeenCalledWith({ data: mockMeasureEntity })
   })
})
