import fs from 'fs';
import { geminiKey } from '../../constants/env';
import { ServiceError } from '../../types/ServiceError';
import { MeasureType } from '../../types/measureType';

// Google AI so funciona com modulo
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GoogleGenerativeAI } = require('@google/generative-ai');

type LLMApiClientResponse = {
   measure_value: number;
};

type Result = LLMApiClientResponse | ServiceError;

export class LLMApiClient {
   async getMeasureFromImage({
      imageBase64,
      measureType,
   }: {
      imageBase64: Express.Multer.File | undefined;
      measureType: MeasureType;
   }): Promise<Result> {

      if (!imageBase64) {
         return {
            error_status: 400,
            error_code: 'INVALID_DATA',
            error_description: 'Imagem não foi enviada, por favor verifique os dados enviados',
         };
      }

      try {

         const genAI = new GoogleGenerativeAI(geminiKey);

         const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

         const prompt = `Extraia o valor total (a pagar) da conta, de ${this.translateMeasurePtbr(measureType)}, desta imagem enviada, eu preciso do valor numérico (sem moeda do país)`;



         const imageBuffer = fs.readFileSync(imageBase64.path);
         const imageBase64String = imageBuffer.toString('base64');
         const result = await model.generateContent([
            { text: `${prompt} base64: ${imageBase64String}` },
         ]);

         console.info('LLM RESPONSE', result.response.text());


         const billValue = result.response.text().match(/\d+(,\d+)?/g);

         if (billValue) {
            return {
               measure_value: parseFloat(billValue[0].replace(',', '.'))
            }
         }

         if (fs.existsSync(imageBase64.path)) {
            fs.unlinkSync(imageBase64.path);
         }

         return {
            error_status: 500,
            error_code: 'LLM_001',
            error_description: 'Ocorreu um erro durante a leitura da sua imagem, por favor tente novamente mais tarde.',
         }


      } catch (error) {
         console.error('LLM Connection', { error });

         if (fs.existsSync(imageBase64.path)) {
            fs.unlinkSync(imageBase64.path);
         }

         return {
            error_status: 500,
            error_code: 'LLM_001',
            error_description: 'Ocorreu um erro durante a leitura da sua imagem, por favor tente novamente mais tarde.',
         };
      }
   }

   private translateMeasurePtbr(measureType: MeasureType): string {
      switch (measureType) {
         case 'GAS':
            return 'gás';
         case 'WATER':
            return 'água';
         default:
            return measureType;
      }
   }
}
