import mongoose, { connect } from "mongoose";
import { config } from "./config";
import Logger from "bunyan";

const log: Logger = config.createLogger('setupDatabase');

export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info("Connected to database");
      })
      .catch((err) => {
        log.error(err);
        return process.exit(1);
      });
  };
    connect();
    mongoose.connection.on('disconnected', connect);
};
