import { Request, Response } from 'express'
import { UploadMeasureUseCase } from '../useCases/uploadMeasureUseCase'

export class UploadMeasureController {
   constructor(private uploadMeasureUseCase: UploadMeasureUseCase) {}

   async handle(req: Request, res: Response): Promise<Response> {
      const result = await this.uploadMeasureUseCase.execute(req.body)

      if ('error_code' in result) {
         return res
            .status(result.error_status ?? 500)
            .send({ error_code: result.error_code, error_description: result.error_description })
      } else {
         return res.status(200).send(result)
      }
   }
}
