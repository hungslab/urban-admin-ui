import request from '@/utils/request'

// 获取商品信息
export function listProduct(data) {
    return request({
        url: 'system/product/list',
        method: 'post',
        data: data
    })
}

// 新增商品
export function addProduct(data) {
    return request({
        url: 'system/product/add',
        method: 'post',
        data: data
    })
}

// 修改商品
export function updateProduct(data) {
    return request({
        url: 'system/product/edit',
        method: 'put',
        data: data
    })
}

// 删除商品
export function delProduct(data) {
    return request({
        url: 'system/product/delete',
        method: 'delete',
        data: data
    })
}

