import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import { connect } from 'react-redux'

import avatar from '../../assets/images/avatar.jpg'
import './left-nav.less'
import menuList from '../../config/menuConfig'

const { SubMenu } = Menu;
class LeftNav extends React.Component {
    // 根据menu的数据数组生成对应的标签数组
    // map加递归调用生成导航列表
    // hasAuth = (item) => {
    //     const {key, isPublic} = item
    //     const menus = memoryutils.user.role.menus
    //     const username = memoryutils.user.username

    //     console.log(menus)
    //     /*
    //     1. 如果当前用户是admin
    //     2. 如果当前item是公开的
    //     3. 当前用户有此item的权限: key有没有menus中
    //      */
    //     if(username==='admin' || isPublic || menus.indexOf(key)!==-1) {
    //       return true
    //     } else if(item.children){ // 4. 如果当前用户有此item的某个子item的权限
    //       return !!item.children.find(child =>  menus.indexOf(child.key)!==-1)
    //     }

    //     return false
    // }

    getMenuNodes_map = (menuList) => {

        // 判断有无显示的权限
        const { status } = this.props.admin
        const path = this.props.location.pathname

        return menuList.map(item => {

            //如果是超级管理员才可设置管理员
            if (status !== 2 && item.key === '/role') {
                return null
            }
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                // 查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                // 如果存在, 说明当前item的子列表需要打开
                if (cItem) {
                    this.openKey = item.key
                }
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes_map(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
            if (!item.children) {
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if (cItem) {
                    this.openKey = item.key
                }
                pre.push((
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }
            return pre
        }, [])
    }
    componentWillMount() {

        this.menuNodes = this.getMenuNodes_map(menuList)
    }
    render() {
        let path = this.props.location.pathname
        if (path.indexOf('/shop') === 0) { // 当前请求的是商品或其子路由界面
            path = '/shop'
        } else if(path.indexOf('/food') === 0) {
            path = '/food'
        }
        const openKey = this.openKey
        return (
            <div>
                <div className='left-nav'>
                    <header className='left-nav-header'>
                        <img src={avatar} alt="avatar" />
                        <h1>elm后台</h1>
                    </header>
                </div>
                <Menu theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline">
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

export default connect(
    state => ({ admin: state.admin }),

)(withRouter(LeftNav))