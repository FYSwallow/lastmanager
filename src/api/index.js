import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

// 1.管理员登陆
export const reqLogin = (data) => ajax('/admin/login', data, 'POST')

// 2.管理员退出
export const reqLogout = () => ajax('/admin/logout')

// 3.获取用户信息
export const reqAdminInfo = () => ajax('/admin/info')
// 4.获取天气
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
            // 如果成功了
            if (!err && data.status === 'success') {
                // 取出需要的数据
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]
                resolve({ dayPictureUrl, weather })
            } else {
                // 如果失败了
                message.error('获取天气信息失败!')
            }

        })
    })
}


// 5.某一天用户注册量
export const userDayCount = date => ajax('/statis/user/' + date + '/count');


// 6.某一天订单数量
export const orderDayCount = date => ajax('/statis/order/' + date + '/count');

// 7.某一天管理员注册量
export const adminDayCount = date => ajax('/statis/admin/' + date + '/count');

// 8.获取用户总数量
export const getUserCount = data => ajax('/users/count', data);

// 9.获取订单总数量
export const getOrderCount = data => ajax('/shopping/order/count', data);

// 10.获取管理员总数量
export const getAdminCount = () => ajax('/admin/count');

// 11.获取管理员列表
export const reqAdminlist = () => ajax('/admin/all')

// 12.获取所有用户列表
export const reqUserslist = () => ajax('/users/all');

// 13.获取当前定位
export const reqCurrentAddress = () => ajax('/position/exactaddress')

// 14.获取所有商家列表
export const reqshoplist = ({ latitude, longitude }) => {
    return ajax('/shopping/restaurantsList', { latitude, longitude })
}

// 15.获取食物列表
export const reqFoodList = data => ajax('/shopping/getFoods', data);

// 16.获取订单列表
export const reqOrderList = data => ajax('/bos/orders', data);


// 17.获取category 种类列表
export const foodCategory = () => ajax('/shopping/getMenu');

// 18.获取category 种类列表
export const shopCategory = () => ajax('/shopping/getCategories');

// 19.获取当前地址
export const getAddress = () => ajax('/position/cities', { type: 'guess' })

// 20.搜索地址
export const searchplace = (cityid, value) => ajax('/position/search', {
    type: 'search',
    city_id: cityid,
    keyword: value
});

// 21.添加商铺
export const addShop = data => ajax('/shopping/addShop', data, 'POST');

// 22.更新商铺信息
export const updateShop = (data, id) => ajax(`/shopping/updateShop/${id}`, data, 'POST');

// 23.搜索商家列表
export const searchShopList = (geohash, keyword) => ajax('/shopping/searchRestaurants', { geohash, keyword })

// 24.删除商家
export const reqDeleteShop = (id) => ajax(`/shopping/deleteshop/${id}`)

// 25.添加食品种类
export const addCategory = (data) => ajax('/shopping/addMenu', data, 'POST')

// 26.获取食品种类列表
export const getCategoryList = (id) => ajax('/shopping/getMenu', { restaurant_id: id })

// 27.添加食品
export const addFood = (data) => ajax('/shopping/addFood', data, 'POST')

// 28.更新食品
export const updateFood = (data, id) => ajax(`/shopping/updateFood/${id}`, data, 'POST')

// 29.删除食品
export const deleteFood = (id) => ajax(`/shopping/deletefood/${id}`)

// 30.添加管理员
export const addAdmin = (data) => ajax('/admin/register', data, 'POST')

// 31.注销用户
export const deleteAdmin = (id) => ajax(`/admin/delete/${id}`)

// 32.获取用户分布
export const getuserCity = () => ajax('/user/city')

// 33.获取所有的订单
export const reqAllOrders = () => ajax('/shopping/allOrders')

// .获取msite页面食品分类列表
export const shopTypes = geohash => ajax('/category/shopCategory', {
	geohash,
	group_type: '1',
	'flags[]': 'F'
});