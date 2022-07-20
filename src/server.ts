import Koa from "koa";
import cors from "@koa/cors";

import { initRoutes } from "./routes";
import { initializeMiddleware } from "./middleware";
import Router from "@koa/router";

export const createServer = (): Koa => {
  const app = new Koa();

  app.use(cors());

  initializeMiddleware(app);

  const router = initRoutes(new Router());

  app.use(router.routes());

  app.use(async function (ctx, next) {
    try {
      await next;
    } catch (err) {
      ctx.status = (err as Error & { status: number }).status || 500;
      ctx.body = (err as Error).message;
      ctx.app.emit("error", err);
    }
  });
  app.on("error", (err, ctx) => {
    ctx.logger.error(err);
  });

  return app;
};
