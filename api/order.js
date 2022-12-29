/** 取消订单 传订单id即可 POST /orders/cancel */
import request from './index';

/** 创建订单1
 * @param {API.Order}  
 */
export const addOrder1 = async (data) => {
	return await request.post('/orders/add0', data);
}
/** 创建订单2
 * @param {API.Order}  
 */
export const addOrder2 = async (data) => {
	return await request.post('/orders/add1', data);
}

/** 取消订单
 * @param {API.Order}  
 */
export const cancelOrder = async (data) => {
	return await request.post('/orders/cancel', data);
}

/** 订单分页 GET 
 * @param {API.pageOrderParams}
 */
export const getOrders = async (params) => {
	return request.get('/orders/page', params);
}

/** 更新订单收货地址 传id和地址即可 
 *  @param {API.Order}
 */
export const updateOrderAddr = async (data) => {
	return await request.post('/orders/updateAddress', data);
}

/** 订单发货中 传id和status即可 
 * @param {API.Order}
 */
export const updateStatus = async (data) => {
	return request.post('/orders/updateStatus', data);
}
