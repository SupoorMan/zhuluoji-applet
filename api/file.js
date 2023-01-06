import request from './index';

/** 上传文件
 */
export const uploadFile = async (data, file) => {
	const url = '/file/upload';
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: request.baseUrl + (data.area ? url + '?area=' + data.area : url),
			filePath: file.url,
			name: 'file',
			success: (res) => {
				resolve(JSON.parse(res.data))
			},
			fail: (res) => {
				reject(res.data)
			}
		})
	})
}

/** 删除图片 
 *  @param  { {file: string }},
 */
export const deleteFile = async (params) => {
	return request.post('/file/delete', params);
}
