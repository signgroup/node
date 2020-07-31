const router = require('koa-router')()
const {verifyToken} = require('./../utils/jwt')
const {getQuery} = require('./../utils/get')
const {getIdQuery} = require('./../utils/getId')
const {addQuery} = require('./../utils/add')
const {deleteQuery} = require('./../utils/delete')
const {query} = require('./../controllers/query');

router.get('/get', async (ctx, next) => {
    return getQuery(ctx,{
        db:'users',
        field:['users.id','users.name','users.sex','users.age','users.date','users.address','d.name as dep_name','d.address as dep_address'],
        concat:['users.name','users.address','users.age','users.date','d.name','d.address'],
        orderBy:['date'],
        leftJoin:` LEFT JOIN department as d on users.dep_id=d.id`
    })
})
router.get('/getId', async (ctx, next) => {
    return getIdQuery(ctx,{
        db:'users'
    })
})
router.post('/add', async (ctx, next) => {
    return addQuery(ctx,{
        db:'users'
    })
})
const updateUser = (value, id) => {
    let sql = `update users set  ? where id='${id}'`
    return query(sql, value)
}
router.post('/update', async (ctx, next) => {
    const token = ctx.request.headers.authorization
    const vt = verifyToken(token)
    if (vt.code === -1) {
        ctx.body = vt
        return
    }

    const postData = ctx.request.body
    let id = postData.id
    delete postData.id
    postData.date = new Date()
    let params = postData
    console.log('params', params)
    let obj = {}
    let res = await updateUser(params, id)
    if (res.affectedRows > 0) {
        obj = {
            code: 0,
            message: "修改成功"
        }
    } else {
        obj = {
            code: 1,
            message: "修改失败"
        }
    }
    ctx.body = obj
})
router.post('/delete', async (ctx, next) => {
    return deleteQuery(ctx,{
        db:'users'
    })
})
module.exports = router
