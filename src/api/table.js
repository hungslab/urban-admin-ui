import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/system/monitor/operlog/list',
    method: 'get',
    params
  })
}
