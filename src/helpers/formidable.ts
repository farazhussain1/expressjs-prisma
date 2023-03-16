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
    });

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files: Files) => {
        if (!err) {
          const image: any = files.image
          // if(Array.isArray(files)){
          //      const allFiles = files.map((file)=> Object.keys(file)[0])
          // }
          resolve({ ...fields, [Object.keys(files)[0]]: image.newFilename })
        }
        reject(err)
      });
    })
  } catch (error: any) {
    console.log(error.message);
  }
}