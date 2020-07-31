const router = require('koa-router')()
const {query} = require('./../controllers/query');
const {addToken} = require('./../utils/jwt')

const checkUser = (data) => {
    /* let sql = `select * from users where username='${data.username}' and password='${data.password}'`
     return query(sql)*/
    let sql = `select * from users where username=? and password=?`
    return query(sql, [data.username, data.password])
}

router.post('/', async (ctx, next) => {
    const postData = ctx.request.body
    console.log('postData', postData)
    let obj = {}
    if(postData.code!==ctx.session.captcha){
        obj = {
            code: 1,
            message: "验证码错误"
        }
        ctx.body=obj
        return
    }
    let [res] = await checkUser(postData)
    console.log('login res', res)

    if (res) {
        let token = addToken({
            username: res.username,
            id: res.id,
            password: res.password
        })
        let userInfo = res
        delete userInfo.password
        obj = {
            code: 0,
            token,
            userInfo,
            message: "登录成功"
        }
    } else {
        obj = {
            code: 1,
            message: "登录失败"
        }
    }
    ctx.body = obj
})

module.exports = router
