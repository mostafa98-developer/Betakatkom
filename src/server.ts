import express, { Application, ErrorRequestHandler, Router, RequestHandler } from "express";
import { config } from "./utils";
import { auth, error, notFound } from "./middlewares";

export default class server {
  private static routers: { private: Router[]; public: Router[] } = { private: [], public: [] };
  private static middlewares: RequestHandler[] = [];
  private constructor() {}

  public static registerRoute(router: Router, isPublic = false) {
    this.routers[isPublic ? "public" : "private"].push(router);
  }

  public static registerMiddleware(middleware: RequestHandler) {
    this.middlewares.push(middleware);
  }

  public static init() {
    const port = config.get("PORT");
    const app: Application = express();
    [this.middlewares, this.routers.public, [auth], this.routers.private, [notFound], [error]].forEach((routers) =>
      this.attachRoutes(app, routers)
    );
    app.listen(port, () => console.log(`Server is listening on port ${port}!`));
  }

  private static attachRoutes(app: Application, routers: (Router | RequestHandler | ErrorRequestHandler)[]) {
    routers.forEach((router) => app.use(router));
  }
}
