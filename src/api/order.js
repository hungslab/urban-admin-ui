import request from '@/utils/request'
const urls = {
    createOrder: 'system/order/add',
    getOrder: 'system/order/list',
    editOrder: 'system/order/edit',
    deleteOrder: 'system/order/delete'
}

// 获取
export function orderList(query) {
    return request({
        url: urls.getOrder,
        method: 'post',
        data: query
    })
}

// 新增
export function addOrder(data) {
    return request({
        url: urls.createOrder,
        method: 'post',
        data: data
    })
}

// 修改
export function updateOrder(data) {
    return request({
        url: urls.editOrder,
        method: 'put',
        data: data
    })
}

// 删除商品
export function delOrder(ordrtId) {
    return request({
        url: urls.deleteOrder,
        method: 'delete',
        params: ordrtId
    })
}