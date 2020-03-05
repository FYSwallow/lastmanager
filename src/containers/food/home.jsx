import React from 'react'
import {connect} from 'react-redux'
import {
    Card,
    Table,
    Modal,
    message
} from 'antd'
import { reqFoodList, deleteFood } from '../../api/index'
import {receiveFood} from '../../redux/actions'
import LinkButton from '../../components/link-button/link-button'
import './food.less'
class FoodHome extends React.Component {
    state = {
        foodList: [], //食物列表
        visible: false, // modal是否可见

    }
    // 搜索食物列表
    getFoodList = async () => {
        const result = await reqFoodList()
        console.log(result)
        this.setState({
            foodList: result.data
        })
    }

    //展示食品详情
    showFoodDetail = (value) => {
        this.setState({
            foodDetail: value,
            visible: true
        })
    }
    hideFoodDetail = () => {
        this.setState({
            visible: false,
            foodDetail: null,
        })
    }

    // 编辑食物
    editFood = (value) => {
        this.props.receiveFood(value)
        this.props.history.push('/food/addupdate')
    }

    // 删除食物

    deleteFood = async (value) => {
        const result = await deleteFood(value.item_id)
        if(result.status === 1) {
            message.success('删除食品成功')
        } else {
            message.error('删除食品失败')
        }
    }
    componentDidMount() {
        this.getFoodList()
    }
    render() {
        const { foodList, foodDetail, visible } = this.state

        //设置表头
        const columns = [
            {
                title: '食品名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '食品介绍',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: '评分',
                dataIndex: 'rating',
                key: 'rating',
            },
            {
                title: '操作',
                align: 'center',
                render: (food) => (
                    <span>
                        <LinkButton onClick={() => this.showFoodDetail(food)}>详情</LinkButton>
                        <LinkButton onClick={() => this.editFood(food)}>编辑</LinkButton>
                        <LinkButton onClick={() => this.deleteFood(food)} style={{ color: 'red' }}>删除</LinkButton>
                    </span>
                )

            },
        ]

        //设置提示框
        const food = foodDetail ? (
            <section className="foodInfo">
                <section className="foodDetail left">
                    <p>
                        <span>食品名称</span>
                        <span>{foodDetail.name}</span>
                    </p>
                    <p>
                        <span>食品 ID</span>
                        <span>{foodDetail.item_id}</span>
                    </p>
                    <p>
                        <span>食品介绍</span>
                        <span>{foodDetail.description}</span>
                    </p>
                    <p>
                        <span>食品评分</span>
                        <span>{foodDetail.rating}</span>
                    </p>
                    <p>
                        <span>月销量</span>
                        <span>{foodDetail.month_sales}</span>
                    </p>
                </section>
                <section className="foodDetail right">
                    <p>
                        <span>餐馆名称</span>
                        <span>{foodDetail.restaurant_name}</span>
                    </p>
                    <p>
                        <span>餐馆 ID</span>
                        <span>{foodDetail.restaurant_id}</span>
                    </p>
                    <p>
                        <span>餐馆地址</span>
                        <span>{foodDetail.rating}</span>
                    </p>
                    <p>
                        <span>食品分类</span>
                        <span>{foodDetail.category_name}</span>
                    </p>
                </section>
            </section>
        ) : null
        return (
            <Card title='食品列表'>
                <Table
                    dataSource={foodList}
                    columns={columns}
                    rowKey='item_id'
                    bordered
                />;
                 <Modal
                    title='食物详情'
                    visible={visible}
                    footer={null}
                    onCancel={this.hideFoodDetail}>
                    {food}
                </Modal>
            </Card>
        )
    }
}

export default connect(
    state => ({shop: state.shop}),
    {receiveFood}
)(FoodHome)