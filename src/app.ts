import express from 'express';
import config from 'config'
import connect from "./utils/connect";
import logger from './utils/logger';
import createServer from './utils/server'

const port = config.get<number>('port');
export const app = createServer();
app.listen(port, async () => {
    logger.info(`app is running at port ${port}`);
    await connect()
});