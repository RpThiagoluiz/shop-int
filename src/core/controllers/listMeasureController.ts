import { Request, Response } from '../../types/httpResponseAndRequestTypes'
import { ListMeasuresUseCase } from '../useCases/listMeasureUseCase'

export class ListMeasuresController {
   constructor(private listMeasuresUseCase: ListMeasuresUseCase) {}

   async handle(req: Request, res: Response): Promise<Response> {
      const result = await this.listMeasuresUseCase.execute({
         customer_code: req.params.customer_code,
         ...(typeof req.query.measure_type === 'string' && { measure_type: req.query.measure_type })
      })

      if ('error_code' in result) {
         return res
            .status(result.error_status ?? 500)
            .send({ error_code: result.error_code, error_description: result.error_description })
      } else {
         return res.status(200).send(result)
      }
   }
}
