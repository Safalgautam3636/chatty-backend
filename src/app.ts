import { ChattyServer } from "./setupServer";
import express, { Express } from 'express';
import connectDatabase from './setupDatabase'
import { config } from "./config";

class Application{
    public initialize(): void{
        this.loadConfig();
        connectDatabase();
        const app: Express = express();
        const server = new ChattyServer(app);
        server.start();
    }
    private loadConfig(): void{
        config.validateConfig();
        config.cloudinaryConfig();
        
    }
}
const application: Application = new Application();
application.initialize();