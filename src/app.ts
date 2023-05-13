import express from 'express';
import config from 'config'
import connect from "./utils/connect";
import routes from './routes';
import logger from './utils/logger';

const port = config.get<number>('port');


const app = express();

app.use(express.json());

app.listen(port, async () => {
    logger.info(`app is running at port ${port}`);
    await connect()
    routes(app);
});