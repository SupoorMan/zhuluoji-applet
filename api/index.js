function https({
	method,
	url,
	data
}) {
	const baseUrl = "http://47.111.234.21:8888" // "http://supoorman.gnway.cc";

	let header = {
		"Access-Control-Allow-Headers": 'token',
		'content-type': method === 'POST' ? 'application/json' : 'application/x-www-form-urlencoded',
	};
	const token = uni.getStorageSync('token')
	if (token) {
		header.token = token
		header.uid = uni.getStorageSync('uid')
	}
	uni.showLoading({
		title: '加载中'
	})
	return new Promise((resolve, reject) => {
		uni.request({
			header: header,
			url: baseUrl + url,
			method: method,
			data: data,
			success: (res) => {
				if (res.header.token && res.header.token !== token) {
					uni.setStorageSync('token', res.header.token)
				}
				resolve(res.data)
				uni.hideLoading()
			},
			fail: (res) => {
				reject(res.data)
				uni.hideLoading()
			}
		})
	})
}
const request = {
	get(url, data) {
		return https({
			method: 'GET',
			url,
			data: data || {}
		})
	},
	post(url, data) {
		return https({
			method: 'POST',
			url,
			data: data || {}
		})
	},
}

export default request
