import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import helmet from "helmet";
import HTTP_STATUS from "http-status-codes";
import hpp from "hpp";
import "express-async-errors";
import http from "http";
import compression from "compression";
import { config } from "./config";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import applicationRoutes from "./routes";
import Logger from "bunyan";
import { CustomError, IError } from "./shared/globals/helpers/errorHandler";


const log: Logger = config.createLogger("server");

const SERVER_PORT = 3000;
export class ChattyServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }
  private securityMiddleware(app: Application): void {
    cookieSession({
      name: "session",
      keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_SECOND!],
      maxAge: 24 * 7 * 3600000,
      secure: config.NODE_ENV !== "development",
    });
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );
  }
  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(
      urlencoded({
        extended: true,
        limit: "50mb",
      })
    );
  }
  private routeMiddleware(app: Application): void {
    applicationRoutes(app);
  }
  private globalErrorHandler(app: Application): void {
    app.all("*", (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: `${req.originalUrl} not found`,
      });
    });
    app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
      log.error(error);
      if (error instanceof (CustomError)) {
        return res.status(error.statusCode).json(error.serializeErrors())
      }
      next();
    }

    );

  }
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = new http.Server(app);
      const socketIO = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (err) {
      log.error(err);
    }
  }

  private startHttpServer(httpServer: http.Server): void {
    log.info(`Server has started with pid: ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Server is up and running in port ${SERVER_PORT}`);
    });
  }
  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
    });
    const pubClient = createClient({
      url: config.REDIS_HOST,
    });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }
  private socketIOConnections(io: Server): void { }
}
