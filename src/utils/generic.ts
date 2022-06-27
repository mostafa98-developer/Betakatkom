import { RequestHandler, Router, Request, Response, NextFunction } from "express";
import { HTTP_RESPONSES } from "./constants";

export default class generic {
  private constructor() {}

  public static encapsulateRouter(router: Router, path: string): Router {
    const wrapperRouter = Router({ mergeParams: true });
    wrapperRouter.use(path, router);
    return wrapperRouter;
  }

  public static asyncRouteErrorHandlerWrapper(handler: RequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      const returned: any = handler(req, res, next);
      if (returned instanceof Promise) {
        returned.catch((err) => {
          next(err);
        });
      }
    };
  }

  public static roleBasedRouteWrapper(userType: number | number[], handler: RequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { user } = req as any;
      const userTypes = userType instanceof Array ? userType : [userType];
      if (!userTypes.includes(user.get("type"))) {
        res.sendStatus(HTTP_RESPONSES.UNAUTHORIZED);
        return;
      }
      handler(req, res, next);
    };
  }
}
