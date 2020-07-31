const URL = require('url')
const {verifyToken} = require('./../utils/jwt')
const {query} = require('./../controllers/query');


const deleteDb = (params, ids) => {
    console.log('params',params)
    //id int类型
    let sql = `delete from ${params.db} where id in `
    if(params.type==='int'){
        // let sql = `delete from ${params.db} where id in (${ids})`
        sql+=`(${ids})`
    }else{
        //delete from users where id in ('d512fa80-d085-11ea-9789-b9a835b247a4','adsffadsf')
        // let sql = `delete from ${params.db} where id in ('${ids.join(',')}')`
        sql+=`('${ids.join("','")}')`
    }
    return query(sql)
}
const deleteQuery = async (ctx, params) => {
    console.log('ctx',ctx)
    const token = ctx.request.headers.authorization
    const vt = verifyToken(token)
    if (vt.code === -1) {
        ctx.body = vt
        return
    }

    const postData = ctx.request.body
    // console.log('postData.ids',postData.ids.join())
    let obj = {}
    //params.type==='int'?postData.ids.join():postData.ids.join("','")
    let res = await deleteDb(params,postData.ids)
    console.log('delete res',res)
    if (res.affectedRows > 0) {
        obj = {
            code: 0,
            message: "删除成功"
        }
    } else {
        obj = {
            code: 1,
            message: "删除失败"
        }
    }
    ctx.body = obj
}

module.exports = {deleteQuery}

/**
 * 使用案例
  return deleteQuery(ctx,{
        db:'department',
        type:'int'
    })
 *
 * */
