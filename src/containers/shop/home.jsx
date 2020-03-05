import React from 'react'
import {
    Card,
    Table,
    Button,
    Icon,
    Input,
    message,
    Modal
} from 'antd'
import { connect } from 'react-redux'

// import { PAGE_SIZE } from '../../utils/constants'
import { reqshoplist, searchShopList, reqDeleteShop } from '../../api/index'
import { receiveShop } from '../../redux/actions'
import LinkButton from '../../components/link-button/link-button'

import './home.less'
class ShopList extends React.Component {
    state = {
        dataSource: [],
        searchName: '', // 搜索的关键字
        visible: false, //modal框是否可见
        shopDetail: null, //选中商品的详细信息
    }
    // 获取商铺列表
    getShopList = async () => {
        const { address } = this.props
        // 获取商铺列表
        const result = await reqshoplist({ latitude: address.latitude, longitude: address.longitude });
        this.setState({
            dataSource: [...result.data]
        })
    }
    //搜索商铺列表
    searhShopList = async () => {
        const { searchName } = this.state
        const { address } = this.props
        if (searchName) {
            const geohash = address.latitude + ',' + address.longitude
            const result = await searchShopList(geohash, searchName)
            this.setState({
                dataSource: [...result.data]
            })
        } else {
            this.getShopList()
        }
    }
    // 初始化table的列的数组
    initColumns = () => {
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                align: 'center',
            },
            {
                title: '店铺名称',
                dataIndex: 'name',
                align: 'center',
            },
            {
                title: '店铺地址',
                dataIndex: 'address',
                align: 'center',
            },
            {
                title: '店铺介绍',
                dataIndex: 'description',
                align: 'center',
            },
            {
                title: '操作',
                width: 200,
                align: 'center',
                render: (shop) => (
                    <span>
                        <LinkButton onClick={() => { this.showShopDetail(shop) }}>详情</LinkButton>
                        <LinkButton onClick={() => { this.addFood(shop) }}>添加食品</LinkButton>
                        <LinkButton onClick={() => { this.editShop(shop) }}>修改</LinkButton>
                        <LinkButton onClick={() => { this.deleteShop(shop) }} style={{ color: 'red' }}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }
    // 展示商品详情
    showShopDetail = (value) => {
        this.setState({
            shopDetail: value,
            visible: true
        })
    }

    // 关闭商品详情
    hideShopDetail = () => {
        this.setState({
            visible: false,
            shopDetail: null,
        })
    }

    // 添加商品
    addFood = (shop) => {
       this.props.history.push(`/food/addfood/${shop.id}`)
    }
    // 修改商铺信息
    editShop = (value) => {
        this.props.receiveShop(value)
        this.props.history.push('/shop/addupdate')
    }

    // 删除商铺
    deleteShop = async (shop) => {
        const result = await reqDeleteShop(shop.id)
        if (result.data.status === 1) {
            message.success('删除商铺成功')
        }
        // 重新获取商铺数据
        this.getShopList()
    }
    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        // 获取商铺列表
        this.getShopList();
    }
    render() {
        const { dataSource, shopDetail,visible } = this.state
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/shop/addupdate')}>
                <Icon type='plus' />
                添加商铺
            </Button>
        )
        const title = (
            <span>
                <Input
                    placeholder='按商铺名称搜索'
                    style={{ width: 150, margin: '0 15px' }}
                    onChange={event => this.setState({ searchName: event.target.value })}
                />
                <Button type='primary' onClick={this.searhShopList}>搜索</Button>
            </span>
        )
        const columns = this.columns;


        const shop = shopDetail ? (
            <section className="shopInfo">
                <section className="shopdetail left">
                    <p>
                        <span>商铺名称</span>
                        <span>{shopDetail.name}</span>
                    </p>
                    <p>
                        <span>商铺介绍</span>
                        <span>{shopDetail.description}</span>
                    </p>
                    <p>
                        <span>联系电话</span>
                        <span>{shopDetail.phone}</span>
                    </p>
                    <p>
                        <span>销售量</span>
                        <span>{shopDetail.recent_order_num}</span>
                    </p>
                </section>
                <section className="shopdetail right">
                    <p>
                        <span>店铺地址</span>
                        <span>{shopDetail.address}</span>
                    </p>
                    <p>
                        <span>店铺 ID</span>
                        <span>{shopDetail.id}</span>
                    </p>
                    <p>
                        <span>评分</span>
                        <span>{shopDetail.rating}</span>
                    </p>
                    <p>
                        <span>分类</span>
                        <span>{shopDetail.category}</span>
                    </p>
                </section>
            </section>
        ) : null
        return (
            <Card extra={extra} title={title}>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    rowKey='id'
                    bordered
                />;
                <Modal
                    title='商铺详情'
                    visible={visible}
                    footer={null}
                    onCancel={this.hideShopDetail}>
                    {shop}
                </Modal>
            </Card>
        )
    }
}

export default connect(
    state => ({ address: state.address }),
    { receiveShop }
)(ShopList)