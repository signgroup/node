import axios from 'axios'
import {apiUrl} from "./config";
import store from './../../store'
console.log('apiUrl',apiUrl)
axios.defaults.baseURL = apiUrl


/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers:{
                AUTHORIZATION: localStorage.getItem('accessToken')
                // AUTHORIZATION: store.state.token
            }
        },{
            params: params
        })
            .then(res => {
                console.log('get res',res.data)
                if(res.data.code===-1){
                    store.commit('remoteLogin')

                    this.$router.push('login')
                    this.$message.error(res.data.message)

                    return
                }
                resolve(res.data);
            })
            .catch(err => {
                console.log('get catch',err)
                reject(err.data)
            })
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {

    return new Promise((resolve, reject) => {
        const headers = {
            AUTHORIZATION: window.localStorage.getItem('accessToken')
        };
        axios.post(url,params,{
            headers
        } )
            .then(res => {
                console.log('post res',res)
                if(res.data.code===-1){
                    this.$router.push('login')
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('userInfo')
                    this.$message.error(res.data.message)
                    return
                }
                resolve(res.data);
            })
            .catch(err => {
                console.log('post catch',err)
                reject(err)
            })
    })
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log("err", err)
        })
}
