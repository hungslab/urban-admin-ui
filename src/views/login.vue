<template>
    <el-row class="login-container">
        <el-col :lg="16" :md="12" class="left">
            <div>
                <div>欢迎光临</div>
                <div>此站点是智慧消防系统后台登陆界面演示页面</div>
            </div>
            
        </el-col>

        <el-col :lg="8" :md="12" class="right">
            <h2 class="login-title">欢迎回来</h2>
            <div>
                <span class="login-line"></span>
                <span>账号密码登陆</span>
                <span class="login-line"></span>
            </div>

            <el-form :model="param" :rules="rules" ref="login" class="w-[250px]">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <template #prepend>
                            <el-button :icon="User"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        show-password
                        v-model="param.password"
                        @keyup.enter="submitForm(login)"
                    >
                        <template #prepend>
                            <el-button :icon="Lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button class="round w-[250px]" type="primary" @click="submitForm(login)">登录</el-button>
                </div>
                <el-checkbox class="login-tips" v-model="checked" label="记住密码" size="large" />
            </el-form>

        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
interface LoginInfo {
    username: string;
    password: string;
}

const lgStr = localStorage.getItem('login-param');
const defParam = lgStr ? JSON.parse(lgStr) : null;
const checked = ref(lgStr ? true : false);

const router = useRouter();

const param = reactive<LoginInfo>({
    username: defParam ? defParam.username : '',
    password: defParam ? defParam.password : '',
});

const rules: FormRules = {
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        }
    ],
};



</script>

<style scoped>
.login-container {
    @apply min-h-screen bg-indigo-500;
}

.login-container .left, .login-container .right {
    @apply flex items-center justify-center;
}

.login-container .right {
    @apply bg-light-50 flex-col;
}

.left>div>div:first-child   {
    @apply font-bold text-5xl text-light-50 mb-4;
}

.left>div>div:last-child {
    @apply text-gray-200 text-sm;
}

.right .login-title {
    @apply font-bold text-3xl text-gray-800;
}

.right>div {
    @apply flex items-center justify-center my-5 text-gray-300;
}

.right .login-line {
    @apply h-[1px] w-16 bg-gray-200;
}
</style>