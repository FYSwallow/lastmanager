import React from 'react'
import moment from 'moment'

import {
    Card,
    Form,
    Input,
    AutoComplete,
    Icon,
    Cascader,
    Select,
    InputNumber,
    Button,
    Switch,
    TimePicker,
    Table,
    Modal,
    message
} from 'antd'
import { connect } from 'react-redux'

import './addshop.less'
import LinkButton from '../../components/link-button/link-button'
import PictureUpload from '../uppicture/picupload'
import { getAddress, shopCategory, searchplace, addShop, updateShop } from '../../api/index'
import { receiveShop } from '../../redux/actions'

const { Option } = Select;

class AddForm extends React.Component {
    //初始化数据
    constructor(props) {
        super(props)

        // 创建用来保存ref标识的标签对象的容器
        this.upload1 = React.createRef()
        this.upload2 = React.createRef()
        this.upload3 = React.createRef()



        //商铺基本数据
        const shopInfo = {
            name: '', //店铺名称
            address: '', //地址
            latitude: '',
            longitude: '',
            description: '', //介绍
            phone: '',
            promotion_info: '',
            category: [], //分类
            float_delivery_fee: 5, //运费
            float_minimum_order_amount: 20, //起价
            is_premium: true,
            delivery_mode: true,
            new: true,
            bao: true,
            zhun: true,
            piao: true,
            startTime: '08:30',
            endTime: '20:30',
            image_path: '',
            business_license_image: '',
            catering_service_license_image: '',
            activities: [{
                icon_name: '减',
                name: '满减优惠',
                description: '满30减5，满60减8',
            }],
        }

        // 根局全局状态管理中的shop判断更新还是添加
        const shop = this.props.shop
        if (shop) {
            this.isUpdate = true
            const startTime = shop.opening_hours[0].split('/')[0]
            const endTime = shop.opening_hours[0].split('/')[1]
            const business_license_image = shop.license.business_license_image
            const catering_service_license_image = shop.license.catering_service_license_image
            let bao, zhun, piao
            const category = shop.category.split('/')
            shop.supports.forEach(item => {
                switch (item.icon_name) {
                    case '保':
                        return bao = true
                    case '准':
                        return zhun = true
                    case '票':
                        return piao = true
                    default:
                        return
                }
            })
            // 修改state中shopInfo的数据
            const newObj = {
                name: shop.name, //店铺名称
                address: shop.address, //地址
                latitude: shop.latitude,
                longitude: shop.longitude,
                description: shop.description, //介绍
                phone: shop.phone,
                promotion_info: shop.promotion_info,
                category,
                float_delivery_fee: shop.float_delivery_fee, //运费
                float_minimum_order_amount: shop.float_minimum_order_amount, //起价
                is_premium: shop.is_premium,
                delivery_mode: !!shop.delivery_mode,
                new: shop.is_new,
                bao,
                zhun,
                piao,
                startTime,
                endTime,
                business_license_image,
                catering_service_license_image,
                image_path: shop.image_path,
                activities: shop.activities,
            }
            this.state = {
                shopInfo: newObj,

                city: {},
                searchAddressList: [], //搜索地址列表
                activityValue: '满减优惠',

                loading: false,
                residences: [], //分类列表选项
                visible: false, // 是否显示modal框
            }

        } else {
            this.isUpdate = false
            this.state = {
                shopInfo,
                city: {},
                searchAddressList: [], //搜索地址列表
                activityValue: '满减优惠',

                loading: false,
                residences: [], //分类列表选项
                visible: false, // 是否显示modal框
            }
        }

    }
    // 获取当前定位城市
    getCity = async () => {
        const localCity = await getAddress()
        this.setState({
            city: localCity.data
        })
    }


    // 获取商铺分类数据
    getCategorys = async () => {
        try {
            const { shopInfo } = this.state
            // 获取分类列表
            const categories = await shopCategory();
            // 获取一二级分类列表
            const residences = []
            categories.data.forEach(item => {
                if (item.sub_categories.length) {
                    const addnew = {
                        value: item.name,
                        label: item.name,
                        children: []
                    }
                    item.sub_categories.forEach((subitem, index) => {
                        if (index === 0) {
                            return
                        }
                        addnew.children.push({
                            value: subitem.name,
                            label: subitem.name,
                        })
                    })
                    residences.push(addnew)
                }
            })

            // 如果是添加商品，则需要重新加载分类
            if (!this.isUpdate) {
                const newObj = Object.assign({}, shopInfo, { category: [residences[0].value, residences[0].children[0].value] })
                this.setState({
                    shopInfo: newObj
                })
            }
            this.setState({
                residences
            })
        } catch (err) {
            console.log(err);
        }

    }

    // 根据搜索内容搜索地址
    searchAddress = async (value) => {
        if (!value.trim()) {
            return
        }
        const { city } = this.state
        const result = await searchplace(city.id, value)
        const addressList = result.data

        const searchAddressList = addressList.map((item) => {
            return item.address
        })
        this.setState({
            addressList, // 包含地址所有信息
            searchAddressList // 只包含地址的地名的列表
        })
    }



    // 选择商家活动属性 
    selectActivity = async (select) => {
        this.setState({
            visible: true,
            activityValue: select
        })
    }

    // 添加商家活动描述
    updateActivity = async () => {
        let newObj = {};
        const { shopInfo, activityValue } = this.state
        switch (activityValue) {
            case '满减优惠':
                newObj = {
                    icon_name: '减',
                    name: '满减优惠',
                    description: this.activityDescription,
                }
                break;
            case '优惠大酬宾':
                newObj = {
                    icon_name: '特',
                    name: '优惠大酬宾',
                    description: this.activityDescription,
                }
                break;
            case '新用户立减':
                newObj = {
                    icon_name: '新',
                    name: '新用户立减',
                    description: this.activityDescription,
                }
                break;
            case '进店领券':
                newObj = {
                    icon_name: '领',
                    name: '进店领券',
                    description: this.activityDescription,
                }
                break;
            default:
                return null
        }

        const shop = Object.assign({}, shopInfo, { activities: [...shopInfo.activities, newObj] })
        //传入回调函数，并在回调函数里面返回新的 state 对象
        this.setState({
            shopInfo: shop,
            visible: false
        })
    }

    // 删除添加的活动
    deleteActicity = async (category) => {
        const { shopInfo } = this.state
        const tempArr = shopInfo.activities.filter((item) => {
            return item.description !== category.description
        })

        const shop = Object.assign({}, shopInfo, { activities: [...tempArr] })
        this.setState({
            shopInfo: shop
        })
    }
    // 表达提交
    submit = () => {
        // 进行表单验证, 如果通过了, 才发送请求
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                // 获取表单提交的数据
                const { shopInfo, addressList } = this.state
                const { name, address, phone, description, promotion_info, category } = values
                const { image_path } = this.upload1.current.state
                const business_license_image = this.upload2.current.state.image_path
                const catering_service_license_image = this.upload3.current.state.image_path
                let location = {}

                // 如果地址列表和选择的地址发生变化
                if (address && addressList) {
                    const newObj = addressList.find(item => {
                        return item.address === address
                    })
                    location = { latitude: newObj.latitude, longitude: newObj.longitude }

                }
                // 获取当前地址所有的信息


                const formData = Object.assign(
                    {},
                    shopInfo,
                    location,
                    { name, address, phone, description, promotion_info },
                    { image_path },
                    { business_license_image },
                    { catering_service_license_image },
                    { category: category.join('/') }
                )

                let result;
                console.log(formData)
                if (this.isUpdate) {
                    const { id } = this.props.shop
                    result = await updateShop(formData, id)
                } else {
                    result = await addShop(formData)
                }
                if (result.data.status === 1) {
                    message.success(result.data.success)
                }
            }
        })
    }
    componentDidMount() {
        this.getCity()
        this.getCategorys() // 获取店铺一级分类列表
    }
    componentWillUnmount() {
        this.props.receiveShop()
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { shopInfo, residences, activityValue, city, searchAddressList } = this.state;
        const { isUpdate } = this

        const cityInfo = "当前城市: " + city.name
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 6 },  // 左侧label的宽度
            wrapperCol: { span: 12 }, // 右侧包裹的宽度
        }

        // 指定店铺优惠活动分类
        const options = [
            {
                value: '满减优惠',
                label: '满减优惠'
            },
            {
                value: '优惠大酬宾',
                label: '优惠大酬宾'
            },
            {
                value: '新用户立减',
                label: '新用户立减'
            },
            {
                value: '进店领券',
                label: '进店领券'
            }
        ]
        // 设置活动表格表头
        const columns = [
            {
                title: '活动标题',
                dataIndex: 'icon_name',
                key: 'icon_name',
            },
            {
                title: '活动名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '活动详情',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: '操作',
                width: 200,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.deleteActicity(category)}>删除</LinkButton>
                    </span>
                )
            },
        ];
        // 判断当前是修改商铺信息还是添加商铺信息
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{ fontSize: 20 }} />
                </LinkButton>
                <span>{isUpdate ? '修改商铺' : '添加商铺'}</span>
            </span>
        )

        // 活动属性
        return (
            <Card title={title}>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="店铺名称">
                        {getFieldDecorator('name', {
                            initialValue: shopInfo.name,
                            rules: [
                                {
                                    required: true,
                                    message: '必须输入店铺名称',
                                },
                            ]
                        })(<Input placeholder="请输入商品名称" />)}
                    </Form.Item>
                    <Form.Item label="详细地址" extra={cityInfo}>
                        {getFieldDecorator('address', {
                            initialValue: shopInfo.address,
                            rules: [
                                {
                                    required: true,
                                    message: '必须输入店铺地址',
                                },
                            ]
                        })(<AutoComplete
                            dataSource={searchAddressList}
                            onSearch={this.searchAddress}
                            placeholder="请输入详细地址"
                        />)}

                    </Form.Item>
                    <Form.Item label="联系电话" >
                        {getFieldDecorator('phone', {
                            initialValue: shopInfo.phone,
                            rules: [
                                { required: true, message: '请输入联系电话' },
                                // { type: 'number', message: '电话号码必须是数字' }
                            ]
                        })(<Input placeholder="请输入联系电话" />)}
                    </Form.Item>
                    <Form.Item label="店铺简介" >
                        {getFieldDecorator('description', {
                            initialValue: shopInfo.description
                        })(<Input placeholder='请输入店铺简介' />)}
                    </Form.Item>
                    <Form.Item label="店铺标语" >
                        {getFieldDecorator('promotion_info', {
                            initialValue: shopInfo.promotion_info
                        })(<Input placeholder='请输入店铺标语' />)}
                    </Form.Item>
                    <Form.Item label="店铺分类">
                        {getFieldDecorator('category', {
                            initialValue: shopInfo.category,
                            rules: [
                                { type: 'array', message: '请选择店铺分类!' },
                            ],
                        })(<Cascader options={residences} placeholder='请指定商品分类' />)}
                    </Form.Item>
                    <Form.Item label="店铺特点">
                        <span className='feature'>
                            <span>
                                <i>品牌保证</i>
                                <Switch defaultChecked={shopInfo.is_premium} onChange={(checked) => {
                                    const data = Object.assign({}, shopInfo, { is_premium: checked })
                                    return this.setState({ shopInfo: data })
                                }} />
                            </span>
                            <span>
                                <i>蜂鸟配送</i>
                                <Switch defaultChecked={shopInfo.delivery_mode} onChange={(checked) => {
                                    const data = Object.assign({}, shopInfo, { delivery_mode: checked })
                                    return this.setState({ shopInfo: data })
                                }} />
                            </span>
                            <span>
                                <i>新开店铺</i><Switch defaultChecked={shopInfo.new} onChange={(checked) => {
                                    const data = Object.assign({}, shopInfo, { new: checked })
                                    return this.setState({ shopInfo: data })
                                }} />
                            </span>
                            <span>
                                <i>外卖保</i><Switch defaultChecked={shopInfo.bao} onChange={(checked) => {
                                    const data = Object.assign({}, shopInfo, { bao: checked })
                                    return this.setState({ shopInfo: data })
                                }} />
                            </span>
                            <span>
                                <i>准时达</i><Switch defaultChecked={shopInfo.zhun} onChange={(checked) => {
                                    const data = Object.assign({}, shopInfo, { zhun: checked })
                                    return this.setState({ shopInfo: data })
                                }} />
                            </span>
                            <span>
                                <i>开发票</i><Switch defaultChecked={shopInfo.piao} onChange={(checked) => {
                                    const data = Object.assign({}, shopInfo, { piao: checked })
                                    return this.setState({ shopInfo: data })
                                }} />
                            </span>
                        </span>
                    </Form.Item>

                    <Form.Item label="配送费">
                        <InputNumber
                            min={0}
                            max={20}
                            defaultValue={shopInfo.float_delivery_fee} onChange={(value) => {
                                const data = Object.assign({}, shopInfo, { float_delivery_fee: value })
                                return this.setState({ shopInfo: data })
                            }} />
                    </Form.Item>
                    <Form.Item label="起送价">
                        <InputNumber
                            min={0
                            } max={100}
                            defaultValue={shopInfo.float_minimum_order_amount}
                            onChange={(value) => {
                                const data = Object.assign({}, shopInfo, { float_minimum_order_amount: value })
                                return this.setState({ shopInfo: data })
                            }} />
                    </Form.Item>
                    <Form.Item label="营业时间" >
                        <span>
                            <TimePicker
                                placeholder="起始时间"
                                defaultValue={moment(shopInfo.startTime, 'HH:mm')}
                                format='HH:mm'
                                onChange={(value) => {
                                    const data = Object.assign({}, shopInfo, { startTime: value })
                                    return this.setState({ shopInfo: data })
                                }} />
                            &nbsp;&nbsp;&nbsp;
                            <TimePicker
                                placeholder="结束时间"
                                defaultValue={moment(shopInfo.endTime, 'HH:mm')}
                                format='HH:mm'
                                onChange={(value) => {
                                    const data = Object.assign({}, shopInfo, { endTime: value })
                                    return this.setState({ shopInfo: data })
                                }} />
                        </span>
                    </Form.Item>
                    <Form.Item label="上传店铺头像" >
                        <PictureUpload ref={this.upload1} img={shopInfo.image_path} />
                    </Form.Item>
                    <Form.Item label="上传营业执照" >
                        <PictureUpload ref={this.upload2} img={shopInfo.business_license_image} />
                    </Form.Item>
                    <Form.Item label="上传餐饮服务许可证" >
                        <PictureUpload ref={this.upload3} img={shopInfo.catering_service_license_image} />
                    </Form.Item>
                    <Form.Item label="优惠活动">
                        <Select
                            defaultValue={activityValue}
                            style={{ width: 120 }}
                            onChange={this.selectActivity}>
                            {
                                options.map((item) => {
                                    return <Option value={item.value} key={item.value}>{item.label}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 18, offset: 3 },
                    }}>
                        <Table
                            dataSource={shopInfo.activities}
                            columns={columns}
                            bordered
                            pagination={false} />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 16, offset: 8 },
                        }}
                    >
                        <Button type="primary" onClick={this.submit}>
                            立即创建
                        </Button>
                    </Form.Item>
                </Form >
                <Modal
                    title="提示"
                    visible={this.state.visible}
                    onOk={this.updateActivity}
                    onCancel={() => { this.setState({ visible: false }) }}
                >
                    <p>请输入活动详情</p>
                    <Input onChange={(e) => this.activityDescription = e.target.value} />
                </Modal>
            </Card>

        );
    }
}

export default connect(
    state => ({ shop: state.shop }),
    { receiveShop }
)(Form.create()(AddForm))