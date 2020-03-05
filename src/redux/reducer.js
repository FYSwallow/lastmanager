/*
用来根据老的state和指定的action生成并返回新的state的函数
 */
import { combineReducers } from 'redux'

import {
    RECEIVE_AdMIN,
    RESET_ADMIN,
    RECEIVE_SHOP,
    RESET_SHOP,
    RECEIVE_ADDRESS,
    RECEIVE_FOOD
} from './action-types'

import { getStore } from '../utils/localStorage'

/*
用来管理当前登陆用户的reducer函数
 */
const initadmin = JSON.parse(getStore('admin'))

function admin(state = initadmin, action) {
    switch (action.type) {
        case RECEIVE_AdMIN:
            return action.data
        case RESET_ADMIN:
            return null
        default:
            return state
    }
}

// 管理商铺信息的reducer函数
const shopInfo = null

function shop(state = shopInfo, action) {
    switch (action.type) {
        case RECEIVE_SHOP:
            return action.data
        case RESET_SHOP:
            return null
        default:
            return state
    }
}

// 管理用户地址定位信息
const initAddress = null

function address(state = initAddress, action) {
    switch(action.type){
        case RECEIVE_ADDRESS:
            return action.data
        default:
            return state
    }
}

// 管理食品信息
const initFood = null

function food(state = initFood, action) {
    switch(action.type) {
        case RECEIVE_FOOD:
            return action.data
        default: 
            return state
    }
}
/*
向外默认暴露的是合并产生的总的reducer函数
管理的总的state的结构:
  {
    headTitle: '首页',
    admin: {}
  }
 */
export default combineReducers({
    admin,
    shop,
    address,
    food
})