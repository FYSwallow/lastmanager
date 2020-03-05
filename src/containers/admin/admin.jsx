import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd';
import { connect } from 'react-redux'

import { getAdminInfo } from '../../redux/actions'

import LeftNav from '../../components/left-nav/left-nav'
import TopNav from '../../components/top-nav/top-nav'
import Home from '../home/home'
import Shop from '../shop/shop'
import Bar from '../charts/bar'
import Order from '../order/order'
import Food from '../food/food'
import Role from '../role/role'
import User from '../user/user'


const { Footer, Sider, Content } = Layout;
class Admin extends React.Component {

    render() {
        const admin = this.props.admin

        //如果不存在管理员信息,则重新登陆
        if (!admin || !admin.id) {
            return <Redirect to='/login' />
        }

        return (
            <Layout style={{ height: '100%', minWidth: '960px' }}>
                <Sider><LeftNav></LeftNav></Sider>
                <Layout>
                    <TopNav></TopNav>
                    <Content style={{ margin: 20, padding: 20, backgroundColor: '#fff', overflowY: 'auto' }}>
                        <Switch>
                            <Redirect from='/' exact to='/home' />
                            <Route path='/home' component={Home} />
                            <Route path='/shop' component={Shop} />
                            <Route path='/food' component={Food} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/bar' component={Bar} />
                            <Route path='/order' component={Order} />

                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#cccccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    state => ({ admin: state.admin }),
    { getAdminInfo }
)(Admin)