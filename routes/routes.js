// main routes update

import { Router } from "express";
import userRoutes from "../app/modules/User/Users.model.js";
import transactionLogger from "../middleware/transactionLogger.js";
import { getImageUrl } from "../config/space.js";
import rolepermissionRoutes from "../app/modules/RolePermission/rolePermission.routes.js";


const routes = Router();

routes.use(transactionLogger);

routes.post("/get-image-url", getImageUrl);
routes.use("/user", userRoutes);
routes.use('/role-permissions', rolepermissionRoutes);


export default routes;
