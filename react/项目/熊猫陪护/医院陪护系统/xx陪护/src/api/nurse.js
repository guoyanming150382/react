import request from '@/utils/request-worker'

export function fetchList(data) {
  return request({
    url: '/admin/worker/pageList',
    method: 'post',
    data
  })
}

export function fetchCertificate(data){
  return request({
    url: '/admin/worker/getCertList',
    method: 'post',
    data
  })
}

export function deleteCert(data){
  return request({
    url: '/admin/worker/deleteCert',
    method: 'post',
    data
  })
}

export function saveCert(data){
  return request({
    url: '/admin/worker/saveCert',
    method: 'post',
    data
  })
}

export function approveCert(data){
  return request({
    url: '/admin/worker/certApprove',
    method: 'post',
    data
  })
}

export function updateWorker(data) {
  return request({
    url: '/admin/worker',
    method: 'put',
    data
  })
}

export function editWorker(data) {
  return request({
    url: '/admin/worker/doEdit',
    method: 'post',
    data
  })
}

export function rejectWorker(data) {
  return request({
    url: '/admin/worker/reject',
    method: 'post',
    data
  })
}

export function approveWorker(data) {
  return request({
    url: '/admin/worker/approve',
    method: 'post',
    data
  })
}

export function getFeeList(data) {
  return request({
    url: '/admin/worker/getFeePageList',
    method: 'post',
    data
  })
}

export function doDelete(data) {
  return request({
    url: '/admin/worker/doDelete',
    method: 'post',
    data
  })
}

export function editFeeList(data) {
  return request({
    url: '/admin/workerFee/doEdit',
    method: 'post',
    data
  })
}

export function updateFeeList(data) {
  return request({
    url: '/admin/workerFee/doBatchInsert',
    method: 'post',
    data
  })
}

export function hospitalFeeBatch(data) {
  return request({
    url: '/admin/workerFee/doHospitalFeeBatchInsert',
    method: 'post',
    data
  })
}

export function homeFeeBatchInsert(data) {
  return request({
    url: '/admin/workerFee/doHomeFeeBatchInsert',
    method: 'post',
    data
  })
}

export function getHomeFeeList(data) {
  return request({
    url: '/admin/worker/getHomeFeePageList',
    method: 'post',
    data
  })
}

export function editHomeFee(data) {
  return request({
    url: '/admin/workerFee/doEditHomeFee',
    method: 'post',
    data
  })
}

export function getWorkerProfit(data) {
  return request({
    url: '/admin/worker/getProfitPageList',
    method: 'post',
    data
  })
}

export function confirmPay(data) {
  return request({
    url: '/admin/workerProfit/confirmPay',
    method: 'post',
    data
  })
}