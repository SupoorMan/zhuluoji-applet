import request from './index';
/** 侏罗纪的家 
 *  @param {API.PageHomeParams}
 */
export const getHomePage = async (params) => {
	return request.get('/zhuluojiHome/page', params);
}
/** 侏罗纪的家图片分享详情
 *  @param {API.IdParams}
 */
export const getHomeDetail = async (params) => {
	return request.get('/zhuluojiHome/detail', params);
}
/** 侏罗纪的家新增评论
 *  @param {API.ZhuluojiHomeEvaluate}
 */
export const addHomeEval = async (params) => {
	return request.post('/zhuluojiHomeEvaluate/add', params);
}
/** 侏罗纪的家更新评论
 *  @param {API.ZhuluojiHomeEvaluate}
 */
export const updateHomeEval = async (params) => {
	return request.post('/zhuluojiHomeEvaluate/update', params);
}
/** 侏罗纪的家删除评论
 *  @param {API.IdParams}
 */
export const delHomeEval = async (params) => {
	return request.get('/zhuluojiHomeEvaluate/delete', params);
}
/** 侏罗纪的家查询评论
 *  @param {API.PageHomeEvalParams}
 */
export const getHomeEvalPage = async (params) => {
	return request.get('/zhuluojiHomeEvaluate/page', params);
}
/** 侏罗纪的家查询评论
 *  @param {API.PageHomeEvalParams}
 */
export const getHomeEvalsubPage = async (params) => {
	return request.get('/zhuluojiHomeEvaluate/subPage', params);
}
