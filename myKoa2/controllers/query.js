const mysql = require('mysql');
const MYSQL_CONFIG = require('./mysql_config');//数据库配置

//创建mysql连接池
const pool = mysql.createPool(MYSQL_CONFIG.database);
// console.log('pool',pool)
const query = (sql, value) => {
    console.log('sql', sql)
    console.log('value', value)
    return new Promise((resolve, reject) => {
        pool.getConnection( (err, connection)=> {
            if (err) {
                console.log('连接失败')
                reject(err)
            } else {
                console.log('连接成功')
                connection.query(sql, value, (err, fields) => {
                    if (err) {
                        console.log("查询失败");
                        console.log('reject:', err)
                        reject(err)
                    } else {
                        resolve(JSON.parse(JSON.stringify(fields)))
                    }
                    //当连接不再使用时，用connection对象的release方法将其归还到连接池中。
                    connection.release();
                })

            }
        })
    })
}
module.exports = {
    query
}


