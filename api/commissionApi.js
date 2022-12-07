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

export function cashoutFunc(data){
	return request({
		url: "/commissionApplets/cashout",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function getCashOutRecordList(data){
	return request({
		url: "/commissionApplets/getCashOutRecordList",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function getLowerLevelData(data){
	return request({
		url: "/commissionApplets/getLowerLevelData",
		method: "post",
		data: data,
		hideLoading: false
	})
}