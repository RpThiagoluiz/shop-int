import fs from 'fs'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { LLMApiClient } from '../../src/infra/external/LLM'
import { MeasureEnum } from '../../src/types/measureType'
import { MeasureType } from '@prisma/client'

jest.mock('fs')
jest.mock('@google/generative-ai')

describe('LLMApiClient', () => {
   let llmApiClient: LLMApiClient

   beforeEach(() => {
      llmApiClient = new LLMApiClient()
   })

   it('should be return the value of the measurement extracted from the image successfully', async () => {
      const mockFileBuffer = Buffer.from('fake image data')
      const mockMulterFile = {
         path: 'fake/path/to/image.txt',
         mimetype: 'text/plain'
      } as Express.Multer.File

      ;(fs.readFileSync as jest.Mock).mockReturnValue(mockFileBuffer)

      const mockGenerativeModel = {
         generateContent: jest.fn().mockResolvedValue({
            response: {
               text: jest.fn().mockReturnValue('O valor total a pagar é 123,45')
            }
         })
      }
      ;(GoogleGenerativeAI.prototype.getGenerativeModel as jest.Mock).mockReturnValue(
         mockGenerativeModel
      )

      const result = await llmApiClient.getMeasureFromImage({
         imageBase64: mockMulterFile,
         measureType: MeasureEnum.WATER
      })

      expect(result).toEqual({ measure_value: 123.45 })
      expect(fs.readFileSync).toHaveBeenCalledWith(mockMulterFile.path)
      expect(mockGenerativeModel.generateContent).toHaveBeenCalled()
   })

   it('should be return an error when the image is not uploaded', async () => {
      const result = await llmApiClient.getMeasureFromImage({
         imageBase64: undefined,
         measureType: MeasureEnum.GAS
      })

      expect(result).toEqual({
         error_status: 400,
         error_code: 'INVALID_DATA',
         error_description: 'Imagem não foi enviada, por favor verifique os dados enviados'
      })
   })

   it('should be return an error when a failure occurs in LLM', async () => {
      const mockMulterFile = {
         path: 'fake/path/to/image.txt',
         mimetype: 'text/plain'
      } as Express.Multer.File

      ;(fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('fake image data'))
      ;(GoogleGenerativeAI.prototype.getGenerativeModel as jest.Mock).mockReturnValue({
         generateContent: jest.fn().mockRejectedValue(new Error('LLM Error'))
      })

      const result = await llmApiClient.getMeasureFromImage({
         imageBase64: mockMulterFile,
         measureType: MeasureType.WATER
      })

      expect(result).toEqual({
         error_status: 500,
         error_code: 'LLM_001',
         error_description:
            'Ocorreu um erro durante a leitura da sua imagem, por favor tente novamente mais tarde.'
      })

      expect(fs.existsSync).toHaveBeenCalledWith(mockMulterFile.path)
   })
})
