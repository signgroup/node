const router = require('koa-router')()
const svgCaptcha = require('svg-captcha');

router.get('/', async (ctx, next) => {
    /*const cap = svgCaptcha.create({
        size: 4, // 验证码长度
        width:160,
        height:60,
        fontSize: 50,
        ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        background: '#eee' // 验证码图片背景颜色
    })*/
    const cap = svgCaptcha.createMathExpr({
        width: 120,
        height: 40,
        fontSize: 50,
        noise: 2, // 干扰线条的数量
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        background: '#eee' // 验证码图片背景颜色
    })

    let img = cap.data // 验证码
     // 验证码字符，忽略大小写
    // ctx.type = 'html'
    ctx.session.captcha=cap.text.toLowerCase()
    console.log(ctx)
    ctx.body = `${img}`
})
module.exports = router

