import request from '../index.js';

/** @params 
 *  @@description  新增收货地址
 */
export const addAddress = async (data) => {
	return await request.post('/appletDeliveryAddress/add', data);
}

/** @params 
 *  @@description  更新收货地址
 */
export const updateAddress = async (data) => {
	return await request.post('/appletDeliveryAddress/update', data);
}
/** @params 
 *  @@description  获取收货地址列表
 */
export const getAddressList = async () => {
	return await request.get('/appletDeliveryAddress/list');
}
