<template>
    <section class="Login">
        <el-form class="login-container" label-position="left" label-width="0px">
            <h3 class="login_title">登录</h3>
            <el-form-item>
                <el-input type="text" v-model.trim="loginForm.username" auto-complete="off" placeholder="账号"  @keyup.enter.native="login()" ></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-input type="password" v-model.trim="loginForm.password" auto-complete="off"
                          placeholder="密码" @keyup.enter.native="login()"  ></el-input>
            </el-form-item>
    
            <el-form-item class="verification">
                <el-input class="code" type="number" v-model.trim="loginForm.code" auto-complete="off"
                          placeholder="验证码" @keyup.enter.native="login()"  ></el-input>
                <div class="svg-box" v-html="captcha" @click="getCaptcha()"></div>
            </el-form-item>
            
            <el-form-item style="width: 100%">
                <el-button type="primary" style="width: 100%;background: #505458;border: none" :disabled="disabled" @click="login">登录
                </el-button>
            </el-form-item>
        </el-form>
    </section>
</template>


<script>
    import {mapMutations} from 'vuex'
    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: 'admin',
                    code:''
                },
                disabled:true,
                captcha:'',
                responseResult: []
            }
        },
        mounted(){
            this.getCaptcha()
        },
        methods: {
            ...mapMutations(['addLogin']),

            getCaptcha(){
                this.$get('/captcha').then(res=>{
                    this.captcha=res
                })
            },
            login() {
                //拷贝方式，避免污染输入框内容
                let params= {
                    ...this.loginForm
                }
                
                params.password=this.$md5(this.loginForm.password),
                this.$post('/login', params)
                    .then(res => {
                        console.log(res)
                        if(res.code===0){
                            this.addLogin(res)
                            this.$router.push('home')
                               /*
                               * 无参数
                               * this.$router.push('/')
                               * this.$router.push('home')
                               * this.$router.push('/home')
                               * name (/路由没有配置name)
                               * this.$router.push({name:'home'})
                               * path
                               * this.$router.push({path:'/'})
                               * this.$router.push({path:'/home'})
                               * */
                        }else{
                            this.getCaptcha()
                        }
                        this.$message({
                            message: res.message,
                            type:res.code===0? 'success':'error'
                        });
                    })
            },
        },
        watch:{
            //对象内部的属性监听，也叫深度监听
            loginForm: {
                handler(newValue, oldValue) {
                    console.log(newValue)
                    this.disabled = !(newValue.username && newValue.password && newValue.code);
                },
                deep: true
            }
        }
    }
</script>

<style lang="less" scoped>
    .Login {
        height: 100%;
        width: 100%;
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        .login-container {
            border-radius: 15px;
            background-clip: padding-box;
            width: 350px;
            padding: 35px 35px 15px 35px;
            background: #fff;
            border: 1px solid #eaeaea;
            box-shadow: 0 0 25px #cac6c6;
        }
        .login_title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        
    }

</style>
