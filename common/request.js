// 设置公共路径
const baseUrl = "https://192.168.1.11";

//url, method, data, callback, hideLoading
const request = (params) => {
	console.log("paramsparams", params);
	const headers = {
		'Content-Type': 'application/json',
		// 'x-requested-with': 'XMLHttpRequest',
		'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiZ3VveHVhbiIsImNsaWVudFR5cGUiOjEsImlhdCI6MTY2OTAyMjU2MywiZXhwIjoxNjY5MDI5NzYzfQ.5YTQa5iOZP4Zi_yRL9xYwf_tI_I5d7nU4dOrhbfCBQg'
	};
	
	// 如果调用接口不明确不显示 loading
	if (!params.hideLoading) {
		uni.showLoading({
			title: '加载中'
		});
	}
	return new Promise((resolve, reject) => {
		console.log("baseUrl + urlbaseUrl + url", baseUrl + params.url);
		uni.request({
			method: params.method,
			url: baseUrl + params.url,
			data: params.data,
			header: headers,
			dataType: 'json',
		}).then((response) => {
			setTimeout(function() {
				uni.hideLoading();
			}, 200);
			let [error, res] = response;
			if(!error){
				resolve(res.data)
			}else{
				reject(error);
			}
		}).catch(error => {
			// let [err, res] = error;
			reject(error)
		})
	})
	// uni.request({
	// 	url: (url.substr(0, 4) == 'http') ? url : (baseUrl + url),
	// 	data: data,
	// 	header: headers,
	// 	method: method,
	// 	success: (response) => {
	// 		if (!hideLoading) {
	// 			uni.hideLoading();
	// 		}

	// 		const result = response.data;

	// 		if (response.statusCode == 200) {
	// 			const head = response.header;
	// 			if (head.is_login === '0' && head.redirect_url) {
	// 				if (process.env.NODE_ENV === 'production')
	// 					window.location.href = head.redirect_url;
	// 			} else if (head.is_granted === '0') {
	// 				uni.showToast({
	// 					icon: "none",
	// 					title: "暂无权限，请先开通权限"
	// 				})
	// 			} else {
	// 				callback(result)
	// 			}
	// 		} else {
	// 			showError(response)
	// 		}

	// 	},
	// 	complete: () => {
	// 		if (!hideLoading) {
	// 			uni.hideLoading();
	// 		}
	// 	},
	// 	fail: () => {
	// 		if (!hideLoading) {
	// 			uni.hideLoading();
	// 		}
	// 		uni.showToast({
	// 			title: "请求失败，请重试",
	// 			icon: 'none',
	// 			duration: 1500
	// 		});
	// 	}
	// })
}
const showError = error => {
	let errorMsg = ''
	switch (error.statusCode) {
		case 400:
			errorMsg = '请求参数错误'
			break
		case 401:
			errorMsg = '未授权，请登录'
			break
		case 403:
			errorMsg = '跨域拒绝访问'
			break
		case 404:
			errorMsg = '请求地址出错'
			break
		case 408:
			errorMsg = '请求超时'
			break
		case 500:
			errorMsg = '服务器内部错误'
			break
		case 501:
			errorMsg = '服务未实现'
			break
		case 502:
			errorMsg = '网关错误'
			break
		case 503:
			errorMsg = '服务不可用'
			break
		case 504:
			errorMsg = '网关超时'
			break
		case 505:
			errorMsg = 'HTTP版本不受支持'
			break
		default:
			errorMsg = error.msg
			break
	}

	uni.showToast({
		title: errorMsg,
		icon: 'none',
		duration: 2000,
		complete: function() {
			setTimeout(function() {
				uni.hideToast();
			}, 1000);
		}
	});
}
export default request;