import request from './index';
/** 创建评论
 * @param {API.ProductEvaluate}  
 */
export const addEvaluate = async (data) => {
	return await request.post('/productEvaluate/add', data);
}
/** 更新评论
 * @param {API.ProductEvaluate}  
 */
export const updateEvaluate = async (data) => {
	return await request.post('/productEvaluate/update', data);
}
/** 删除评论
 * @param {API.IdParams}  
 */
export const delEvaluate = async (data) => {
	return await request.get('/productEvaluate/delete', data);
}
/** 评论分页查询 分页查询 GET /productEvaluate/page
 * @param { API.PageProdEval }  
 */
export const getEvals = async (params) => {
	return await request.get('/productEvaluate/page', params);
}
/** 查询商品评价数量 GET /productEvaluate/count
 * @param { API.PageProdEval }  
 */
export const getEvalsCount = async (params) => {
	return await request.get('/productEvaluate/count', params);
}
