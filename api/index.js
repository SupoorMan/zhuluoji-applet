// const baseUrl = "http://47.96.64.19:8888" ;
const baseUrl = "https://www.kkdzlj.com/zhuluoji";
// const baseUrl = "http://192.168.31.152:8888/zhuluoji";
function https({
	method,
	url,
	data,
	header = {}
}) {
	header = {
		"Access-Control-Allow-Headers": 'token',
		'content-type': method === 'POST' ? 'application/json' : 'application/x-www-form-urlencoded',
		...header,
	};
	const token = uni.getStorageSync('token')
	if (token) {
		header.token = token
		header.uid = uni.getStorageSync('uid')
	}
	// uni.showLoading({
	// 	title: '加载中'
	// })
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
				// uni.hideLoading()
			},
			fail: (res) => {
				reject(res.data)
				uni.hideLoading()
			}
		})
	})
}
const request = {
	baseUrl,
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
	file(url, data, file) {
		return https({
			method: 'POST',
			header: {
				"content-type": "multipart/form-data"
			},
			url: data.area ? url + '?area=' + data.area : url,
			data: {
				'file': file
			}
		})
	}
}
export default request