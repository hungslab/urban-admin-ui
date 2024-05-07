import request from '@/utils/request'

// 获取评论
export function listReview(data) {
    return request({
        url: 'system/review/list',
        method: 'post',
        data:data
    })
}


// 删除
export function delReview(data) {
    return request({
        url: 'system/review/delete',
        method: 'delete',
        params: data
    })
}

// 编辑
export function updateReview(data) {
    return request({
        url: 'system/review/edit',
        method: 'put',
        data: data
    })
}



// 添加
export function addReview(data) {
    return request({
        url: 'system/review/add',
        method: 'post',
        data: data
    })
}
