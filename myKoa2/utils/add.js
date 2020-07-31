const uuid = require('node-uuid')
const {verifyToken} = require('./../utils/jwt')
const {query} = require('./../controllers/query');
const addDb = (params, value) => {
    let sql = `insert into ${params.db} set ?`
    return query(sql, value)
}
const addQuery = async (ctx, params) => {
    const token = ctx.request.headers.authorization
    const vt = verifyToken(token)
    if (vt.code === -1) {
        ctx.body = vt
        return
    }

    const postData = ctx.request.body
    console.log('postData', postData)
    console.log(typeof postData)
    // console.log('postData：',JSON.parse(postData));
    let obj = {}
    postData.id = uuid.v1()
    let res = await addDb(params,postData)
    if (res.affectedRows > 0) {
        obj = {
            code: 0,
            message: "添加成功"
        }
    } else {
        obj = {
            code: 1,
            message: "添加失败"
        }
    }
    ctx.body = obj
}

module.exports = {addQuery}
