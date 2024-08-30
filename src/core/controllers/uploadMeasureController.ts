import { Request, Response } from '../../types/httpResponseAndRequestTypes'
import { UploadMeasureUseCase } from '../useCases/uploadMeasureUseCase'

export class UploadMeasureController {
   constructor(private uploadMeasureUseCase: UploadMeasureUseCase) {}

   async handle(req: Request, res: Response): Promise<Response> {
      console.log({
         file: req.file,
         body: req.body,
         protocol: req.protocol,
         host: req.get('host')!
      })

      //TODO: LLM AQUI

      const data = {
         image_temp_info: {
            protocol: req.protocol,
            host: req.get('host')!
         },
         image: req.file,
         ...req.body
      }

      const result = await this.uploadMeasureUseCase.execute({ data })

      if ('error_code' in result) {
         return res
            .status(result.error_status ?? 500)
            .send({ error_code: result.error_code, error_description: result.error_description })
      } else {
         return res.status(200).send(result)
      }
   }
}
