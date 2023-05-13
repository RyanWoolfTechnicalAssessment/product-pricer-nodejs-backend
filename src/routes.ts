import {Express,Request,Response} from 'express';
import {createUserHandler} from "./controller/user.controller";
import validateResource from "./middleware/validateResource";
import {createUserSchema} from "./schema/user.schema";
import logger from './utils/logger';
function routes(app:Express){

    app.post("/healthcheck", (req: Request,res:Response) => res.sendStatus(200));

    app.post("/api/users", validateResource(createUserSchema), createUserHandler);

}
export default routes