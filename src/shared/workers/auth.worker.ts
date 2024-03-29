import { DoneCallback, Job } from "bull";
import Logger from "bunyan";
import { config } from "src/config";
import { authService } from "../services/db/auth.services";

const log: Logger = config.createLogger("authWorker");

class AuthWorker{
    async addAuthUserToDB(job: Job, done: DoneCallback): Promise<void>{
        try {
            const {value} = job.data;
            //add method to send data to db
            authService.createAuthUser(value);
            job.progress(100);
            done(null, job.data);
        }
        catch (error) {
            log.error(error);
            done(error as Error);
        }
    }
}

export const authWorker: AuthWorker = new AuthWorker();
