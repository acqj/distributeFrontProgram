import request from '@/common/request.js';

export function getMyCommission(data){
	return request({
		url: "/commissionApplets/getMyCommission",
		method: "post",
		data: data,
		hideLoading: false
	})
}