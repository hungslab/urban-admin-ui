import request from '@/utils/request'



// 登录方法
export function login(username, password) {
    const data = {
        username,
        password
    }
    return request({
        url: 'system/user/login',
        headers: {
            isToken: false,
            repeatSubmit: false
        },
        method: 'post',
        params: data
    })
}

// 注册方法
export function register(data) {
    return request({
        url: '/system/user/register',
        headers: {
            isToken: false,
            repeatSubmit: false
        },
        method: 'post',
        data: {
            username: data.username,
            password: data.password,
        }
    })
}

// 获取用户详细信息
export function getInfo(token) {
    return request({
        url: '/system/user/info',
        method: 'get',
        params: { token }
    })
}

// 退出方法
export function logout() {
    return request({
        url: '/system/user/logout',
        method: 'get'
    })
}

// 获取验证码
export function getCodeImg() {
    return request({
        url: '/captchaImage',
        headers: {
            isToken: false
        },
        method: 'get',
        timeout: 20000
    })
}



// 查询用户列表
export function listUser(query) {
    return request({
        url: '/system/user/list',
        method: 'post',
        data: query
    })
}

// 查询用户详细
export function getUser(userId) {
    return request({
        url: '/system/user/' + parseStrEmpty(userId),
        method: 'get'
    })
}

// 新增用户
export function addUser(data) {
    return request({
        url: '/system/user/add',
        method: 'post',
        data: data
    })
}

// 修改用户
export function updateUser(data) {
    return request({
        url: '/system/user/edit',
        method: 'put',
        data: data
    })
}

// 删除用户
export function delUserById(userId) {
    return request({
        url: '/system/user/delete',
        method: 'delete',
        params: userId
    })
}

