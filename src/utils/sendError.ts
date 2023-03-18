import { Context } from "koa";
export function sendError(errType: string, ctx: Context, description: string = "") {
  const error = new Error(errType)
  return ctx.app.emit('error', error, ctx, description);
}