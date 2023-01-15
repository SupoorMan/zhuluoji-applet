import request from './index';
/** 活动列表 
 *  @param {API.PageParams}
 */
export const getActivity = async (params) => {
	return request.get('/activity/page', params);
}
/** 添加买家秀
 *  @param {API.ActivityBuyShow}
 */
export const addShow = async (params) => {
	return request.post('/activityDetail/addBuyShow', params);
}
/** 查询买家秀详情
 *  @param {API.ActivityBuyShow}
 */
export const getShowDetail = async (params) => {
	return request.get('/activityDetail/getBuyShowDetail', params);
}
/** 发布买家秀评论
 *  @param {API.ActivityBuyShowEval}
 */
export const addEvaluate = async (params) => {
	return request.post('/activityEvaluate/add', params);
}