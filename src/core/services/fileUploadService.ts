import multer, { StorageEngine } from 'multer'
import path from 'path'
import fs from 'fs'

export class FileUploadService {
   private tempDir: string
   private expirationTime: number
   private storage: StorageEngine

   constructor() {
      this.tempDir = path.join(__dirname, '../../../temp')
      this.expirationTime = 24 * 3600 * 1000 // 24 horas

      if (!fs.existsSync(this.tempDir)) {
         fs.mkdirSync(this.tempDir)
      }

      this.storage = multer.diskStorage({
         destination: (req, file, cb) => {
            cb(null, this.tempDir)
         },
         filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}${path.extname(file.originalname)}`
            cb(null, uniqueName)
         }
      })
   }

   public upload() {
      return multer({ storage: this.storage })
   }

   public removeOldFiles() {
      fs.readdir(this.tempDir, (err, files) => {
         if (err) {
            console.error('Erro ao ler diretório:', err)
            return {
               error_message: 'Erro ao ler diretório'
            }
         }

         files.forEach((file) => {
            const filePath = path.join(this.tempDir, file)
            fs.stat(filePath, (err, stats) => {
               if (err) {
                  console.error('Erro ao obter informações do arquivo:', err)
                  return {
                     error_message: 'Erro ao obter informações do arquivo'
                  }
               }

               if (Date.now() - stats.mtimeMs > this.expirationTime) {
                  fs.unlink(filePath, (err) => {
                     if (err) {
                        console.error('Erro ao deletar arquivo:', err)
                        return {
                           error_message: 'Erro ao deletar arquivo'
                        }
                     }
                  })
               }
            })
         })
      })
   }

   public startCleanupInterval() {
      setInterval(() => this.removeOldFiles(), 3600 * 1000) // Limpeza a cada hora
   }
}

/**
 * TODO: Validar o teste de limpeza do arquivo temp.
 */
