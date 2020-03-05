import React from 'react'

import './home.less'
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Legend,
} from "bizcharts";

/*
import {
    userDayCount,
    orderDayCount,
    adminDayCount,
    getUserCount,
    getOrderCount,
    getAdminCount
} from "../../api/index"
*/

import dtime from 'time-formater'

class Home extends React.Component {
    state = {
        userCount: null, //今天的用户注册量
        orderCount: null, //今天的订单量
        adminCount: null, // 今天的管理员注册数
        allUserCount: null, //所有的用户数量
        allOrderCount: null, //所有的订单数
        allAdminCount: null, //所有的管理员数量
        sevenDay: [], //过去七天的日期
        sevenDate: [[], [], []], // 过去七天的所有的注册量
    }
    componentWillMount() {
        // 获取最近七天的日期
        const sevenDay = []
        for (let i = 6; i > -1; i--) {
            const date = dtime(new Date().getTime() - 86400000 * i).format('YYYY-MM-DD')
            sevenDay.push(date)
        }
        this.setState({ sevenDay })
    }
    componentDidMount() {
        this.getBaseData();
        this.getSevenData();
    }
    getBaseData = async () => {
        // const today = dtime().format('YYYY-MM-DD')

        /**
         * // 获取今天的数据
        Promise.all([userDayCount(today), orderDayCount(today), adminDayCount(today), getUserCount(), getOrderCount(), getAdminCount()]).then(res => {
                console.log(res)
                this.setState({
                    userCount: res[0].data.count,
                    orderCount: res[1].data.count,
                    adminCount: res[2].data.count,
                    allUserCount: res[3].data.count,
                    allOrderCount: res[4].data.count,
                    allAdminCount: res[5].data.count,
                })
            }).catch(err => {
                console.log(err)
            })
         */
        this.setState({
            userCount: 8,
            orderCount: 50,
            adminCount: 2,
            allUserCount: 200,
            allOrderCount: 1200,
            allAdminCount: 20,
        })
    }

    // 获取最近七天的数据
    getSevenData = async () => {
        // const apiArr = [[], [], []];
        const { sevenDay } = this.state
        /*
        sevenDay.forEach(item => {
            apiArr[0].push(userDayCount(item))
            apiArr[1].push(orderDayCount(item))
            apiArr[2].push(adminDayCount(item))
        })
        const promiseArr = [...apiArr[0], ...apiArr[1], ...apiArr[2]]
        Promise.all(promiseArr).then(res => {
            const resArr = [];
            res.forEach((item, index) => {
                if (item.data.status === 1) {
                    switch (Math.floor(index / 7)) {
                        case 0:
                            return resArr.push({ day: sevenDay[index % 7], count: item.data.count, name: 'userCount' })
                        case 1:
                            return resArr.push({ day: sevenDay[index % 7], count: item.data.count, name: 'orderCount' })
                        case 2:
                            return resArr.push({ day: sevenDay[index % 7], count: item.data.count, name: 'adminCount' })
                        default:
                            return
                    }

                }
            })
            this.setState({ sevenDate: resArr })
        }).catch(err => {
            console.log(err)
        })
        */
        const randerUser = sevenDay.map((item) => {
            return { day: item, count: Math.floor((Math.random() * 15)), name: 'userCount' }
        })
        const randerOrder = sevenDay.map((item) => {
            return { day: item, count: Math.floor((Math.random() * 20)), name: 'orderCount' }
        })
        const randerAdmin = sevenDay.map((item) => {
            return { day: item, count: Math.floor((Math.random() * 10)), name: 'adminCount' }
        })
        this.setState({ sevenDate: [...randerUser, ...randerOrder, ...randerAdmin] })
    }
    render() {
        console.log(this.state)
        const { userCount, orderCount, adminCount, allUserCount, allOrderCount, allAdminCount } = this.state
        const { sevenDate } = this.state

        const scale = {
            count: {
                alias: '数量' // 为属性定义别名
            },
            day: {
                alias: '日期' // 为属性定义别名
            }
        };
        return (
            <div>
                <header className="home-header">数据统计</header>
                <section>
                    <ul className="data-list">
                        <li className="data-item">
                            <span style={{ backgroundColor: '#FF9800' }}>当日数据</span>
                            <span><i>{userCount}</i>新增用户</span>
                            <span><i>{orderCount}</i>新增订单</span>
                            <span><i>{adminCount}</i>新增管理员</span>
                        </li>
                    </ul>
                    <ul className="data-list">
                        <li className="data-item">
                            <span style={{ backgroundColor: '#20A0FF' }}>历史数据</span>
                            <span><i>{allUserCount}</i>注册用户</span>
                            <span><i>{allOrderCount}</i>订单</span>
                            <span><i>{allAdminCount}</i>管理员</span>
                        </li>
                    </ul>

                </section>
                <section className="view-container">
                    <Chart height={400} data={sevenDate} scale={scale} forceFit>
                        <Legend />
                        <Axis name="day" />
                        <Axis name="count" title={'数量'} />
                        <Tooltip
                            crosshairs={{
                                type: "y"
                            }}
                        />
                        <Geom
                            type="line"
                            position="day*count"
                            size={2}
                            color={"name"}
                        />
                        <Geom
                            type="point"
                            position="day*count"
                            size={4}
                            shape={"circle"}
                            color={"name"}
                            style={{
                                stroke: "#fff",
                                lineWidth: 1
                            }}
                        />
                    </Chart>
                </section>
            </div>
        )
    }
}

export default Home