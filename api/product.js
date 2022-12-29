import request from './index';

/** 积分商品详情 详情查询 GET /product/get
 * @param { API.ProdDetailParams }  
 */
export const getProdDetail = async (params) => {
	return await request.get('/product/get', params);
}

/** 积分商品分页查询 分页查询 GET /product/page
 * @param { API.PageProdParams }  
 */
export const getProds = async (params) => {
	return await request.get('/product/page', params);
}
