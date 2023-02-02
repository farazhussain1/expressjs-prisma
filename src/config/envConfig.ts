import dotenv from "dotenv";
import { keys } from "ts-transformer-keys";
import fs from "fs/promises";
import { Config } from "../model";
import prettier from "prettier";

const env = dotenv.config({ path: ".env" });
if (env.error) throw env.error;

const configModel: any = keys<Config>();
const envData = Object.keys(env.parsed ?? {});

const isNewData = envData.filter((key: any) => !configModel.includes(key));

if (isNewData.length && process.env.NODE_ENV === "development") {
  
  let newConfigModel: any = "";
  envData.forEach((key) => (newConfigModel += `${key}:string;`));
  updateConfig(newConfigModel);
}

async function updateConfig(data: string) {
  try {
    const modelFile = await fs.readFile("src/model.ts", { encoding: "utf-8" });
    const modelData = prettier.format(modelFile);
    let findData = "export interface Config {";
    configModel.forEach((key: any) => (findData += `${key}:string;`));
    const newFileData = modelData.replace(
      prettier.format(findData + "}"),
      "export interface Config {" + data + "}"
    );
    await fs.writeFile(
      "src/model.ts",
      prettier.format(newFileData, { parser: "babel" })
    );
  } catch (error) {
    throw error;
  }
}

export const config: Config = Object(env.parsed);
export default config