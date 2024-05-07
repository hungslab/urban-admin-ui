import request from '@/utils/request'

// 获取操作日志信息
export function listOperLog(data) {
    return request({
        url: 'system/operlog/list',
        method: 'post',
        data: data
    })
}


// 删除
export function delOperLog(data) {
    return request({
        url: 'system/operlog/remove',
        method: 'post',
        data: data
    })
}

