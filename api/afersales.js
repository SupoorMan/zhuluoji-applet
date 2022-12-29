import request from './index';

/** 售后申请列表 
 *  @param {API.PageAfterSalesParams}
 */
export const getAfterSales = async (params) => {
	return request.get('/afterSales/page', params);
}
/** 售后申请详情
 *  @param {API.SalesParams}
 */
export const getSalesDetail = async (params) => {
	return request.get('/afterSales/get', params);
}

/** 添加 售后申请
 *  @param {API.AfterSales}
 */
export const addAfterSals = async (data) => {
	return await request.post('/afterSales/add', data);
}

/** 售后处理更新
 * @param {API.AfterSales}
 */
export const updateSales = async (data) => {
	return request.post('/afterSales/update', data);
}
