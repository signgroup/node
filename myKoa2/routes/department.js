const router = require('koa-router')()
const {getQuery} = require('./../utils/get')
const {getIdQuery} = require('./../utils/getId')
const {addQuery} = require('./../utils/add')
const {deleteQuery} = require('./../utils/delete')


router.get('/', async (ctx, next) => {
    return getQuery(ctx,{
        db:'department',
        concat:['name','address'],
    })
})

router.get('/getId', async (ctx, next) => {
    return getIdQuery(ctx,{
        db:'department'
    })
})

router.post('/delete', async (ctx, next) => {
    return deleteQuery(ctx,{
        db:'department'
    })
})
router.post('/add', async (ctx, next) => {
    return addQuery(ctx,{
        db:'department'
    })
})

module.exports = router
