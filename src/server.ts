import express from 'express';
import config from 'config'
import connect from "./utils/connect";
import logger from './utils/logger';
import createAppServer from "./utils/app";

const port = config.get<number>('port');
export const app = createAppServer();
app.listen(port, async () => {
    logger.info(`app is running at port ${port}`);
    await connect()
});