import request from '@/common/request.js';

export function getChannelList(){
	return request({
		url: "/appletsGoods/getChannelList",
		method: "post",
		hideLoading: false
	})
}

export function getGoodsListByParams(data){
	return request({
		url: "/appletsGoods/getGoodsListByParams",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function getProductPwdForDy(data){
	return request({
		url: "/appletsGoods/getProductPwdForDy",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function getBestGoodsList(data){
	return request({
		url: "/appletsGoods/getBestGoodsList",
		method: "post",
		data: data,
		hideLoading: true
	})
}