// /livePreview/page
import request from './index';
/** 查询直播预告详情 
 *  @param {API.PageActDetailParams}
 */
export const pageLivePreview = async (params) => {
	return request.get('/activityDetail/page', params);
}
/** 订阅直播预约
 *  @param {id :productId}
 *  @param {starter :0/1}
 */
export const updateLivePreview = async (params) => {
	return request.get('/activityDetail/update', params);
}
/** 直播预约列表
 *
 */
export const getAppointment = async (params) => {
	return request.get('/activityDetail/subscribe', params);
}
