/*
能发送ajax请求的函数模块
函数的返回值是promise对象
 */
import axios from 'axios'
const baseUrl = ''
export default async function ajax(url, data = {}, type = 'GET') {
    url = baseUrl + url
    let response
    if (type === 'GET') { // 发送GET请求
        // 拼请求参数串
        // data: {username: tom, password: 123}
        // paramStr: username=tom&password=123
        let paramStr = ''
        Object.keys(data).forEach(key => {
            paramStr += key + '=' + data[key] + '&'
        })
        if (paramStr) {
            paramStr = paramStr.substring(0, paramStr.length - 1)
            // 使用axios发get请求
            response = await axios.get(url + '?' + paramStr)
        } else {
            response = await axios.get(url)
        }

    } else {// 发送POST请求
        // 使用axios发post请求
        response = await axios.post(url, data)
    }
    return response
}
