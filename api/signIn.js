import request from './index';
/** 签到列表 
 *  @param {API.ListSignInParams}
 */
export const getSignDays = async (params) => {
	return request.get('/signIn/list', params);
}
/** 
 * 添加 签到
 */
export const signDay = async () => {
	return await request.post('/signIn/sign');
}
/** 
 * 查今日是否 签到
 */
export const getTodaySign = async () => {
	return await request.get('/signIn/get');
}
