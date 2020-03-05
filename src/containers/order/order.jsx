import React from 'react'

import {
    Card,
    Table,
    Modal
} from 'antd'
import LinkButton from '../../components/link-button/link-button'
import { reqAllOrders } from '../../api/index'
import './order.less'
class User extends React.Component {
    state = {
        orderList: [],
        visible: false, // modal是否可见

    }
    // 获取管理员列表
    getAllOrders = async () => {
        const result = await reqAllOrders()
        this.setState({
            orderList: result.data
        })
    }

    // 展示订单详情
    showOrderDetail = (value) => {
        this.setState({
            orderDetail: value,
            visible: true
        })
    }

    // 关闭订单详情
    hideOrderDetail = () => {
        this.setState({
            visible: false,
            orderDetail: null,
        })
    }
    componentDidMount() {
        this.getAllOrders()
    }
    render() {
        const { orderList, orderDetail, visible} = this.state
        const columns = [
            {
                title: '订单Id',
                dataIndex: 'id',
                align: 'center',
            },
            {
                title: '总价格',
                dataIndex: 'total_amount',
                align: 'center',
            },
            {
                title: '订单状态',
                dataIndex: 'status_bar.title',
                align: 'center',
            },
            {
                title: '操作',
                render: (select) => (
                    <span>
                        <LinkButton onClick={() => this.showOrderDetail(select)}>详情</LinkButton>
                    </span>
                ),
                align: 'center',
            },

        ]
        //设置提示框
        const food = orderDetail ? (
            <section className="orderInfo">
                <section className="orderDetail left">
                    <p>
                        <span>收货地址</span>
                        <span>{orderDetail.item_id}</span>
                    </p>
                    <p>
                        <span>店铺地址</span>
                        <span>{orderDetail.description}</span>
                    </p>
                    
                </section>
                <section className="orderDetail right">
                    <p>
                        <span>店铺名称</span>
                        <span>{orderDetail.restaurant_name}</span>
                    </p>
                    <p>
                        <span>店铺 ID</span>
                        <span>{orderDetail.restaurant_id}</span>
                    </p>
                </section>
            </section>
        ) : null
        return (
            <Card title='订单列表'>
                <Table
                    dataSource={orderList}
                    columns={columns}
                    bordered
                >
                </Table>
                <Modal
                    title='食物详情'
                    visible={visible}
                    footer={null}
                    onCancel={this.hideOrderDetail}>
                    {food}
                </Modal>
            </Card>
        )
    }
}

export default User