<template>
  <div class="login-container">

    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">

      <div class="title-container">
        <h3 class="title">微信后台管理系统|注册</h3>
      </div>

      <el-form-item prop="phone">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="phone" />
        </span>
        <el-input name="phone" type="text" v-model="loginForm.phone" placeholder="手机号" />
      </el-form-item>

      <el-row style="margin-bottom:10px;" type="flex" justify="space-between">
        <el-col :span="16" style="color:#fff">
          <el-form-item prop="v_code">
            <span class="svg-container">
              <svg-icon icon-class="v_code" />
            </span>
            <el-input name="v_code" type="v_code" v-model="loginForm.v_code" placeholder="验证码(五分钟内有效)" />
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align:right;color:#fff">
          <el-button @click="sendsms" type="primary" style="width:90%;height:50px">发送验证码</el-button>
        </el-col>
      </el-row>

      <el-form-item prop="pass">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.pass" autoComplete="on" placeholder="密码" />
        <span class="show-pwd" @click="showPwd(0)">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-form-item prop="checkPass">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType1" @keyup.enter.native="handleLogin" v-model="loginForm.checkPass" autoComplete="on" placeholder="确认密码" />
        <span class="show-pwd" @click="showPwd(1)">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-row type="flex" justify="space-between">
        <el-button type="primary" style="width:48%;" :disabled="disabled">立即注册</el-button>
        <router-link to="/login" style="width:48%;">
          <el-button type="primary" style="width:100%;">返回登录</el-button>
        </router-link>
      </el-row>

    </el-form>

  </div>
</template>

<script>
import { validateMobile } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import { sendsms } from '@/api/login'
export default {
  components: { LangSelect },
  name: 'login',
  data() {
    // 验证手机号
    const vamobile = (rule, value, callback) => {
      if (!validateMobile(value)) {
        callback(new Error('请输入正确的手机号码！'))
      } else {
        callback()
      }
    }

    const validatecode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('验证码是六位数字！'))
      } else {
        callback()
      }
    }

    // 验证密码
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码至少为6位数'))
      } else {
        if (this.loginForm.checkPass !== '') {
          this.$refs.loginForm.validateField('checkPass')
        }
        callback()
      }
    }

    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.loginForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        phone: '',
        v_code: '',
        pass: '',
        checkPass: ''
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: vamobile }],
        v_code: [{ required: true, trigger: 'blur', validator: validatecode }],
        pass: [{ trigger: 'blur', validator: validatePass }],
        checkPass: [{ trigger: 'blur', validator: validatePass2 }]
      },
      passwordType: 'password',
      passwordType1: 'password',
      loading: false,
      showDialog: false,
      disabled: true,
      checked: true
    }
  },
  methods: {
    sendsms() {
      this.$refs.loginForm.validateField('phone', valid => {
        if (!valid) {
          sendsms({ sort: 4, phone: this.loginForm.phone }).then(response => {
            this.$message({
              message: '恭喜你，验证码已发送成功！',
              type: 'success'
            })
            this.disabled = false
          })
        } else {
          return false
        }
      })
    },
    showPwd(i) {
      if (i === 0) {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      } else if (i === 1) {
        if (this.passwordType1 === 'password') {
          this.passwordType1 = ''
        } else {
          this.passwordType1 = 'password'
        }
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', { phone: this.loginForm.phone, pass: this.loginForm.pass, sort: 1 }).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;






/* reset element-ui css */

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
