const jwt = require('jsonwebtoken');
const serect = 'token';  //密钥，不能丢
const addToken=(userinfo) => { //创建token并导出
    console.log('userinfo', userinfo)
    const token = jwt.sign({
        username: userinfo.username,
        id: userinfo.id,
        password:userinfo.password
    }, serect, {expiresIn: '24h'});
    return token;
};
const verifyToken=(token) => { //创建token并导出
    console.log('verifyToken', token)
   return jwt.verify(token, serect, (err, decoded) => {
        console.log('err',err)
        console.log('decoded',decoded)
        if (err) {
            switch (err.name) {
                case 'JsonWebTokenError':
                    return { code: -1, message: '无效的token' }
                case 'TokenExpiredError':
                    return { code: -1, message: 'token过期' }
            }
        }else{
            return  { code:0, message: '校验成功' }
        }
    })
};


module.exports ={
    addToken,verifyToken
}
