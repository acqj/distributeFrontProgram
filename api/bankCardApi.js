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

export function addBankCardInfo(data){
	return request({
		url: "/bankCard/addBankCardInfo",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function getCurrentUserBankCard(data){
	return request({
		url: "/bankCard/getCurrentUserBankCard",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function delBankCard(data){
	return request({
		url: "/bankCard/delBankCard",
		method: "post",
		data: data,
		hideLoading: false
	})
}