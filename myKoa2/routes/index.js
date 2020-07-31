const router = require('koa-router')()

router.get('/json', async (ctx, next) => {
    console.log('next',next)

    ctx.body = {
        title: 'koa2 json'
    }
})
module.exports = router
