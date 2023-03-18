import fs from "fs"
import Koa from 'koa'

const useRoutes = function (app: Koa) {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.ts') return;
    // import(`./${file}`).then(res => {
    //   console.log(res)
    //   // @ts-ignore
    //   app.use(res.default.routes());
    //   // @ts-ignore
    //   app.use(res.default.allowedMethods());
    // })
    const router = require(`./${file}`)
    // @ts-ignore
    app.use(router.routes());
    // @ts-ignore
    app.use(router.allowedMethods());
  })
}

export default useRoutes
