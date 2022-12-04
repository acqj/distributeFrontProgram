import request from '@/common/request.js';

export function getMyCommission(data){
	return request({
		url: "/commissionApplets/getMyCommission",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function checkCommission(data){
	return request({
		url: "/commissionApplets/checkCashout",
		method: "post",
		data: data,
		hideLoading: false
	})
}