import request from '@/common/request.js';

export function getChannelList(data){
	return request({
		url: "/channel/channellist",
		method: "post",
		data: data,
		hideLoading: false
	})
}