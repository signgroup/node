const URL = require('url')
const {verifyToken} = require('./../utils/jwt')
const {query} = require('./../controllers/query');
const queryDb = (params, type, value, search) => {
    console.log('value', value)
    // select * from users  where concat(`username`,`date`,`address`,`age`) like '%1%' order by date desc LIMIT 10 OFFSET 0
    let sql = `select ${type === 'count' ? 'count(*) as count' : params.field ? params.field.join() : '*'}  from ${params.db}`
    if (params.leftJoin) {
        sql += ` ${params.leftJoin}`
    }
    if (search && params.concat) {
        console.log('进入search')
        let concatVal = ''
        if (params.concat.length) {
            concatVal = params.concat.join()
        }
        console.log('concatVal', concatVal)
        // sql += ' where concat(' + concatVal + ') like "%' + search + '%"'
        sql += ` where concat(${concatVal}) like '%${search}%'`
    }
    if (params.orderBy) {
        sql += ` order by ${params.orderBy.join()} desc`
    }
    if (type === 'all' && value) {
        sql += ` limit ? offset ? `
    }
    return query(sql, value)
}
const getQuery = async (ctx, params) => {
    const token = ctx.request.headers.authorization
    const vt = verifyToken(token)
    if (vt.code === -1) {
        ctx.body = vt
        return
    }
    let req = URL.parse(ctx.request.url, true)
    console.log('req', req.query)
    console.log('params', params)
    let {pageNo, pageSize, search} = req.query
    pageNo = parseInt(pageNo) ? parseInt(pageNo) : 1
    pageSize = parseInt(pageSize) ? parseInt(pageSize) : 10
    const [total] = await queryDb(params, 'count', [pageSize, (pageNo - 1) * pageSize], search)
    console.log('total', total)
    console.log('total', total)
    ctx.body = {
        code: 0,
        data: {
            list: await queryDb(params, 'all', [pageSize, (pageNo - 1) * pageSize], search),
            pageNo,
            pageSize,
            total: total.count
        }
    }
}

module.exports = {getQuery}
