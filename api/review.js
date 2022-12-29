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

/** 评论分页查询 分页查询 GET /product/page
 * @param { API.PageProdEval }  
 */
export const getEvals = async (params) => {
	return await request.get('/productEvaluate/page', params);
}
