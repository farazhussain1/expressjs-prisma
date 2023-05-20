import { Request } from "express";
import formidable, { Files } from "formidable";


export function uploadFile(req: Request, uploadPath: string) {
  try {   
    const form = formidable({
      multiples: true,
      uploadDir: uploadPath,
      filename: (name, ext, part, form) => {
        const originalName: any = part.originalFilename
        return `${Date.now()}_${originalName}`
      },
    })
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files: Files) => {
        if (err) {
          reject(err)
        }
        if (Object.keys(files).length) {
          const image: any = files.image
          resolve({ ...fields, [Object.keys(files)[0]]: image.newFilename })
        }
        resolve(fields)
      });
    })
  } catch (error: any) {
    throw error
  }
}