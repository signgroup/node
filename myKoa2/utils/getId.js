const URL = require('url')
const {verifyToken} = require('./../utils/jwt')
const {query} = require('./../controllers/query');
const queryIdDb = (params,id) => {
    let sql = `select * from ${params.db} where ?`
    return query(sql, id)
}
const getIdQuery = async (ctx,params) => {
    const token = ctx.request.headers.authorization
    const vt = verifyToken(token)
    if (vt.code === -1) {
        ctx.body = vt
        return
    }
    // console.log(ctx.request.url)
    let req = URL.parse(ctx.request.url, true)
    let [data] = await queryIdDb(params,{id: req.query.id})
    console.log('res', data)
    ctx.body = {
        code: 0,
        data
    }
}



module.exports = {getIdQuery}
