import request from './index.js';
/**
 * @description  传id和需要更新的字段即可
 */
export const updateUser = async (data) => {
	return await request.post('/auser/update', data);
}
export const getUserIofo = async () => {
	return await request.get('/auser/getUser');
}
/**
 * @param {code: wxcode, userInfo} 
 * @description 登录
 */
export const login = async (data) => {
	return await request.post('/wx/login', data);
}
/**
 * @description 获取轮播
 */
export const getBanner = async (data) => {
	return await request.get('/banner/list', data);
}
/**
 * @description 获取消息
 */
export const getNotice = async (data) => {
	return await request.get('/appletNotify/page');
}
