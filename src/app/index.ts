import Koa from "koa"
import errorHandler from "./error-handle"
import useRoutes from "../router"
import cors from "koa2-cors"
import bodyParser from "koa-bodyparser"
import session from "koa-generic-session"
import redisStore from "koa-redis"
import db from './database';

import config from './config'
import { Server } from "http"
db()


const app = new Koa()


// 配置session中间件
app.keys = ['IOdhakw23792#'] // session 密钥
app.use(session({
  key: 'projname.sid', // cookie name 默认是 `koa.sid`
  prefix: 'projname:sess:', // redis key 的前缀，默认是 `koa:sess:`
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000  // 单位 ms
  },
  // @ts-ignore
  store: new redisStore()
})
)

// app.use(koaBody({
//   multipart: true,
//   formidable: {
//     maxFileSize: 100 * 1024 * 1024,    // 设置上传文件大小最大限制，默认2M
//   }
// }));
app.use(bodyParser())
useRoutes(app)
app.on('error', errorHandler);
app.use(cors());


const run = (port: string): Server => {
  return app.listen(port, () => {
    console.log(`服务器在${config.APP_PORT}端口启动成功~`)
  });
}

export default run