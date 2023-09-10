import express, { Router } from "express";
import { CurrentUser } from "../controllers/current-user";
import { authMiddleware } from "src/shared/globals/helpers/auth-middleware";

class CurrentUserRoutes {
    private router: Router;
    constructor() {
        this.router = express.Router();
    }
    public routes(): Router {
        this.router.post("/currentuser",authMiddleware.checkAuthentication, CurrentUser.prototype.read);
        return this.router;
    }
}

export const curretUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();