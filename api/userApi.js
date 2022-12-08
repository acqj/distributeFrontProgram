import request from '@/common/request.js';

export function getUserByOpenId(data){
	return request({
		url: "/appletsUser/getUserInfoByOpenId",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function createUser(data){
	return request({
		url: "/appletsUser/createUser",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function getMyRelation(data){
	return request({
		url: "/appletsUser/getMyRelation",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function createFeedBack(data){
	return request({
		url: "/appletsUser/createFeedBack",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function updateUserInfo(data){
	return request({
		url: "/appletsUser/updateUserInfo",
		method: "post",
		data: data,
		hideLoading: false
	})
}

export function getOpenId(data){
	return request({
		url: "/appletsUser/getOpenId",
		method: "post",
		data: data,
		hideLoading: false
	})
}