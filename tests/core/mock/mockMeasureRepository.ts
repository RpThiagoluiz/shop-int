import { MeasureRepository } from '../../../src/core/repositories/MeasureRepository'

export const mockMeasureRepository: jest.Mocked<MeasureRepository> = {
   findByUuid: jest.fn(),
   save: jest.fn(),
   confirmMeasure: jest.fn(),
   listMeasuresByCustomer: jest.fn()
}
