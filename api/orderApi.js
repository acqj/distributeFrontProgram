import request from '@/common/request.js';

export function getOrderList(){
	return request({
		url: "/order/getOrderList",
		method: "post",
		hideLoading: false
	})
}