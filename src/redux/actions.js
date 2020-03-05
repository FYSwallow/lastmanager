/*
包含n个action creator函数的模块
同步action: 对象 {type: 'xxx', data: 数据值}
异步action: 函数  dispatch => {}
 */
import {
    RECEIVE_AdMIN,
    RESET_ADMIN,
    RECEIVE_SHOP,
    RESET_SHOP,
    RECEIVE_ADDRESS,
    RECEIVE_FOOD
} from './action-types'
import { reqAdminInfo } from '../api'
import { message } from 'antd'
import { setStore, removeStore } from '../utils/localStorage'
/*
接收管理员的同步action
 */
export const receiveadmin = (admin) => ({ type: RECEIVE_AdMIN, data: admin })

export const logout = () => {
    removeStore('admin')
    return {type: RESET_ADMIN}
}

// 接受商铺信息的同步action
export const receiveShop = (shopInfo) => {
    if (shopInfo) {
        return ({ type: RECEIVE_SHOP, data: shopInfo })
    } else {
        return ({ type: RESET_SHOP })
    }

}

// 接受食物
export const receiveFood = (food) => ({type: RECEIVE_FOOD, data: food})

// 接受地址的同步action
export const receiveAddress = (addressInfo) => ({ type: RECEIVE_ADDRESS, data: addressInfo })

/* 
登陆的异步action
 */
export const getAdminInfo = () => {
    return async dispatch => {
        // 1. 执行异步ajax请求
        const response = await reqAdminInfo()  // {status: 0, data: admin} {status: 1, msg: 'xxx'}
        // 2.1. 如果成功, 分发成功的同步action
        const result = response.data
        console.log(result)
        if (result.status === 1) {
            const admin = result.data
            // 保存local中
            setStore('admin', admin)
            // 分发接收用户的同步action
            dispatch(receiveadmin(admin))
        } else { // 2.2. 如果失败, 分发失败的同步action
            message.error('获取管理员信息失败')
        }

    }
}