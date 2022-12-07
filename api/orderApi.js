import request from '@/common/request.js';

export function getOrderList(){
	return request({
		url: "/order/getOrderList",
		method: "post",
		hideLoading: false
	})
}

export function getMyOrderList(data){
	return request({
		url: "/order/getMyOrderList",
		method: "post",
		data:data,
		hideLoading: false
	})
}

export function getOnlyMyOrderList(data){
	return request({
		url: "/order/getOnlyMyOrderList",
		method: "post",
		data:data,
		hideLoading: false
	})
}