const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const router = require('koa-router')()
const onerror = require('koa-onerror')
const cors = require('koa2-cors');
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const index = require('./routes/index')
const captcha = require('./routes/captcha')
const login = require('./routes/login')
const users = require('./routes/users')
const department = require('./routes/department')
const session =require('koa-session')
//设置session
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',   //cookie key (default is koa:sess)
    maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
    overwrite: true,  //是否可以overwrite    (默认default true)
    httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true,   //签名默认true
    rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
    renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));
// error handler
onerror(app)
// console.log('router',router)
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(cors());
app.use(require('koa-static')(__dirname + '/public'))
// console.log('__dirname',__dirname)
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
    console.log('ctx.request.url',ctx.request.url)
    // console.log(ctx.response)
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    const start = new Date()
    if (ctx.method === 'OPTIONS') {
        ctx.body = 200;
        const ms = new Date() - start
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    } else {
        await next();
    }
})
router.use('/index',index.routes())
router.use('/captcha',captcha.routes())
router.use('/login',login.routes())
router.use('/users',users.routes())
router.use('/department',department.routes())

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())
// routes
/*app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())*/
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
