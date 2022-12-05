import request from '@/common/request.js';

export function getBankCardInfo(data){
	return request({
		url: "/bankCard/getBankCardInfo",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function createOrUpdateBankCardInfo(data){
	return request({
		url: "/bankCard/createOrUpdateBankCardInfo",
		method: "post",
		data: data,
		hideLoading: false
	})
}