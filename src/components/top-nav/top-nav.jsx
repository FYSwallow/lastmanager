import React from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import { connect } from 'react-redux'

import './top-nav.less'

import { getAddress, reqWeather } from '../../api/index'
import { formateDate } from '../../utils/dateUtils'

import LinkButton from '../link-button/link-button'
import menuList from '../../config/menuConfig'
import { receiveAddress, logout } from '../../redux/actions'

class TopNav extends React.Component {
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '', // 天气图片url
        weather: '', // 天气的文本
    }
    getWeather = async () => {
        const result = await getAddress()
        const localcity = result.data
        this.props.receiveAddress(localcity)
        // 调用接口请求异步获取数据
        const { dayPictureUrl, weather } = await reqWeather(localcity.name)
        // 更新状态
        this.setState({ dayPictureUrl, weather })
    }
    getTime = () => {
        // 每隔1s获取当前时间, 并更新状态数据currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }

    logout = (event) => {
        // 显示确认框
        Modal.confirm({
            content: '确定退出吗?',
            onOk: async () => {
                this.props.logout()
                // 跳转到login
                this.props.history.replace('/login')
            }
        })
    }
    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
                title = item.title
            } else if (item.children) {
                // 在所有子item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                // 如果有值才说明有匹配的
                if (cItem) {
                    // 取出它的title
                    title = cItem.title
                }
            }
        })
        return title
    }
    componentDidMount() {
        
        // 获取当前的时间
        this.getTime()
        // 获取当前天气
        this.getWeather()
    }
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId)
    }
    render() {
        const { currentTime, dayPictureUrl, weather } = this.state
        const title = this.getTitle()
        // 获取用户名
        const { user_name } = this.props.admin
        return (
            <div className='top-nav'>
                <div className='header-top'>
                    <span>欢迎,{user_name}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({ admin: state.admin }),
    { receiveAddress, logout }
)(withRouter(TopNav))