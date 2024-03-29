import dotenv from "dotenv";
import bunyan from "bunyan";
import cloudinary from "cloudinary"

dotenv.config({});

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_SECOND: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public API_CLOUD_KEY: string | undefined;
  public API_CLOUD_NAME: string | undefined;
  public API_CLOUD_SECRET: string | undefined;

  private readonly DEFAULT_DATABASE_URL =
    "mongodb://localhost:27017/chatty-backend";
  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || "1234";
    this.NODE_ENV = process.env.NODE_ENV || "";
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || "";
    this.SECRET_KEY_SECOND = process.env.SECRET_KEY_SECOND || "";
    this.CLIENT_URL = process.env.CLIENT_URL || "";
    this.REDIS_HOST = process.env.REDIS_HOST;
    this.API_CLOUD_NAME = process.env.API_CLOUD_NAME||"";
    this.API_CLOUD_SECRET = process.env.API_CLOUD_SECRET || "";
    this.API_CLOUD_KEY = process.env.API_CLOUD_KEY || "";
  }
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({
      name: name,
      level: "debug",
    });
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === null) {
        throw new Error(`configuration ${key} is undefined`);
      }
    }
  }
  public cloudinaryConfig(): void{
    cloudinary.v2.config({
      cloud_name: this.API_CLOUD_NAME,
      api_key: this.API_CLOUD_KEY,
      api_secret:this.API_CLOUD_SECRET
    })
  }  
}

export const config: Config = new Config();
