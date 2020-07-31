
/*
* 开发 development
* 生产 production
* */
const url="http://localhost:3005"
export const apiUrl = process.env.NODE_ENV=== 'production' ? url : '/api'
// export const {apiUrl: process.env.NODE_ENV === 'production' ? url : '/api'}


