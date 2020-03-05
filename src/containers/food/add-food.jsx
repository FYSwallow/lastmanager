import React from 'react'
import { connect } from 'react-redux'
import {
    Card,
    Form,
    Input,
    Modal,
    Button,
    Icon,
    message,
    Select,
    Radio,
    InputNumber,
    Table
} from 'antd'
import { addCategory, getCategoryList, addFood, updateFood } from '../../api/index'
import LinkButton from '../../components/link-button/link-button'
import PictureUpload from '../uppicture/picupload'

const Item = Form.Item
const { Option } = Select

class AddFoodCategory extends React.Component {
    constructor(props) {
        super(props)

        const { id } = this.props.match.params

        this.upload1 = React.createRef()


        const { food } = this.props
        console.log(food)

        if (!id && food) {
            this.isUpdate = true
            const { restaurant_id, category_id, name, image_path, description, specfoods, activity, attributes } = food

            // 获取对应规格数据
            const specs = []
            specfoods.forEach(item => {
                specs.push({ specs: item.specs_name, packing_fee: item.packing_fee, price: item.price })
            })
            // 获取对应特点规格数据
            const attr = []
            attributes.forEach((item) => {
                attr.push(item.icon_name)
            })

            // 初始化规格
            const newObj = {
                restaurant_id,
                category_id,
                name,
                image_path,
                specs,
                description,
                activity: activity.image_text || '',
                attributes: attr,
            }

            this.state = {
                visible: false, //modal可见性
                categoryForm: {
                    name: '',
                    description: '',
                    restaurant_id,
                }, // 添加餐馆所需要的属性值
                foodForm: newObj, // 添加食品所需要的值
                categoryList: [], //食品分类列表
                foodSpecs: newObj.specs.length >= 1 ? 'more' : 'one', //食物规格
                attributes: [
                    {
                        value: '新',
                        label: '新品'
                    },
                    {
                        value: '招牌',
                        label: '招牌'
                    },
                ], //属性
                specsShow: false, //是否显示添加规格框
                initSpecs: {
                    specs: '',
                    packing_fee: 0,
                    price: 20,
                }        // 初始化一个规格对象

            }
        } else {
            this.isUpdate = false
            this.state = {
                visible: false, //modal可见性
                categoryForm: {
                    name: '',
                    description: '',
                    restaurant_id: id
                }, // 添加餐馆所需要的属性值
                foodForm: {
                    restaurant_id: id,
                    category_id: '',
                    name: '',
                    image_path: '',
                    specs: [{ specs: '默认', packing_fee: 0, price: 20, }],
                    description: '',
                    activity: '',
                    attributes: [],
                }, // 添加食品所需要的值
                categoryList: [], //食品分类列表
                foodSpecs: 'one', //食物规格
                attributes: [
                    {
                        value: '新',
                        label: '新品'
                    },
                    {
                        value: '招牌',
                        label: '招牌'
                    },
                ], //属性
                specsShow: false, //是否显示添加规格框
                initSpecs: {
                    specs: '',
                    packing_fee: 0,
                    price: 20,
                }        // 初始化一个规格对象

            }
        }

    }

    // 获取当前商铺的所有食品列表
    getCategory = async () => {
        const { foodForm } = this.state
        const result = await getCategoryList(foodForm.restaurant_id)
        this.setState({
            categoryList: result.data
        })

    }
    // 添加食品分类
    addCategory = async () => {
        const { categoryForm } = this.state
        const result = await addCategory(categoryForm)
        if (result.data.status === 0) {
            message.error(result.data.message)
        } else {
            message.success('添加食品种类成功')
            this.setState({
                visible: false
            })
            this.getCategory()
        }
    }

    // 添加食物
    addFood = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const { foodForm } = this.state
                const { name } = values
                const { image_path } = this.upload1.current.state
                const { restaurant_id, category_id, specs } = foodForm
                try {
                    if (!restaurant_id) {
                        throw new Error('请重新选择商铺')
                    } else if (!category_id) {
                        throw new Error('请选择商品分类')
                    } else if (!name) {
                        throw new Error('请填写上商品名称')
                    } else if (!image_path) {
                        throw new Error('请上传图片')
                    } else if (!specs) {
                        throw new Error('请选择商品规格')
                    }
                } catch (err) {
                    message.error(err.message)
                }
                const newObj = Object.assign({}, foodForm, { name, image_path })

                // 食品更新

                if (!this.isUpdate) {
                    const result = await addFood(newObj)
                    if (result.data.status === 1) {
                        message.success('添加食品成功')
                    } else {
                        message.error('添加食品失败')
                    }
                } else {
                    const result = await updateFood(newObj, category_id)
                    console.log(newObj)
                    if (result.data.status === 1) {
                        message.success('更新食品成功')
                    } else {
                        message.error('更新食品失败')
                    }

                }

            }
        })
    }
    // 关闭modal框
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    //删除规格
    deleteSpecs = (select) => {
        const { foodForm } = this.state
        const newObj = { ...foodForm }

        //需要删除项的specs的index
        const deleteIndex = newObj.specs.findIndex((item) => {
            return item.specs === select.specs
        })
        newObj.specs.splice(deleteIndex, 1)
        this.setState({
            foodForm: newObj
        })
    }

    componentDidMount() {
        this.getCategory()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },  // 左侧label的宽度
            wrapperCol: { span: 12 }, // 右侧包裹的宽度
        }

        const { categoryForm, visible, categoryList, foodForm, foodSpecs, attributes, initSpecs } = this.state
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{ fontSize: 20 }} />
                </LinkButton>
                <span>{this.isUpdate? '更新食品': '添加食品'}</span>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => this.setState({ visible: true })}>
                <Icon type='plus' />
                添加食品种类
            </Button>
        )

        // 设置活动表格表头
        const columns = [
            {
                title: '规格',
                dataIndex: 'specs',
                key: 'specs',
                align: 'center'
            },
            {
                title: '包装费',
                dataIndex: 'packing_fee',
                key: 'packing_fee',
                align: 'center'

            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                align: 'center'

            },
            {
                title: '操作',
                width: 200,
                align: 'center',
                render: (select) => (
                    <span>
                        <LinkButton onClick={() => this.deleteSpecs(select)} style={{ color: 'red' }}>删除</LinkButton>
                    </span>
                )
            },
        ];
        // 判断显示多规格还是单规格
        let foodSpecsSelect
        if (foodSpecs === 'one') {
            foodSpecsSelect = (
                <span>
                    <Item label='包装费'>
                        <InputNumber
                            min={0}
                            defaultValue={foodForm.specs[0].packing_fee}
                            onChange={(value) => {
                                const newobj = { ...foodForm }
                                newobj.specs[0].packing_fee = value
                                this.setState({
                                    foodForm: newobj
                                })
                            }} />
                    </Item>
                    <Item label='价格'>
                        <InputNumber
                            min={0}
                            defaultValue={foodForm.specs[0].price}
                            onChange={(value) => {
                                const newobj = { ...foodForm }
                                newobj.specs[0].price = value
                                this.setState({
                                    foodForm: newobj
                                })
                            }} />
                    </Item>
                </span>

            )
        } else {
            foodSpecsSelect = (
                <span>
                    <Item wrapperCol={{ span: 12, offset: 4 }}>
                        <Button type='primary' style={{ margin: '5px' }} onClick={() => { this.setState({ specsShow: true }) }}>
                            添加规格
                        </Button>
                    </Item>
                    <Item wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 18, offset: 3 },
                    }}>
                        <Table
                            bordered
                            dataSource={foodForm.specs}
                            columns={columns}
                            rowKey='specs'
                            pagination={false}
                        />
                    </Item>


                </span>
            )
        }



        return (
            <Card title={title} extra={extra}>
                <Form {...formItemLayout} >
                    <Item label="食品种类">
                        <Select
                            defaultValue={foodForm.category_id}
                            onChange={(value) => {
                                let data
                                //如果是更新,则需要一个新的categoryid
                                if(this.isUpdate) {
                                    data = Object.assign({}, foodForm, { new_category_id: value })
                                } else {
                                    data = Object.assign({}, foodForm, { category_id: value })
                                }
                                return this.setState({ foodForm: data })
                            }}
                            placeholder='请选择食品种类'>
                            {
                                categoryList.map((item) => (
                                    <Option value={item.id} key={item.id}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </Item>
                    <Item label="食品名称" >
                        {getFieldDecorator('name', {
                            initialValue: foodForm.name,
                            rules: [
                                {
                                    required: true,
                                    message: '必须输入食品名称',
                                },
                            ]
                        })(<Input placeholder='请输入食品名称' />)}
                    </Item>
                    <Item label="食品活动" >
                        <Input placeholder='请输入食品活动'
                            defaultValue={foodForm.activity}
                            onChange={(e) => {
                                const data = Object.assign({}, foodForm, { activity: e.target.value })
                                return this.setState({ foodForm: data })
                            }} />
                    </Item>
                    <Item label="食品详情" >
                        <Input placeholder='请输入食品详情'
                            defaultValue={foodForm.description}
                            onChange={(e) => {
                                const data = Object.assign({}, foodForm, { description: e.target.value })
                                return this.setState({ foodForm: data })
                            }} />
                    </Item>
                    <Item label="上传食品图片" >
                        <PictureUpload ref={this.upload1} img={foodForm.image_path} />
                    </Item>
                    <Item label="食品特点">
                        <Select
                            defaultValue={foodForm.attributes}
                            mode="multiple"
                            onChange={(value) => {
                                const data = Object.assign({}, foodForm, { attributes: value })
                                return this.setState({ foodForm: data })
                            }}
                            placeholder='请选择食品特点'>
                            {
                                attributes.map((item) => (
                                    <Option value={item.value} key={item.value}>{item.label}</Option>
                                ))
                            }
                        </Select>
                    </Item>
                    <Item label="食品规格">
                        <Radio.Group onChange={(e) => { console.log(e); this.setState({ foodSpecs: e.target.value }) }} value={foodSpecs}>
                            <Radio value='one'>单规格</Radio>
                            <Radio value='more'>多规格</Radio>
                        </Radio.Group>
                    </Item>
                    {foodSpecsSelect}
                    <Item wrapperCol={{ offset: 8 }}>
                        <Button type="primary" onClick={this.addFood}>
                            {this.isUpdate? '确认更新食品': '确认添加食品'}
                            </Button>
                    </Item>
                </Form>
                <Modal
                    title="添加食品种类"
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <Form {...formItemLayout}>
                        <Item label="食品种类" >
                            <Input
                                placeholder='请输入食品分类'
                                onChange={(e) => {
                                    const data = Object.assign({}, categoryForm, { name: e.target.value })
                                    this.setState({ categoryForm: data })
                                }}
                            />
                        </Item>
                        <Item label="种类描述" >
                            <Input
                                placeholder='请输入食品种类描述'
                                onChange={(e) => {
                                    const data = Object.assign({}, categoryForm, { description: e.target.value })
                                    this.setState({ categoryForm: data })
                                }}
                            />
                        </Item>
                        <Item wrapperCol={{ offset: 8 }}>
                            <Button type="primary" onClick={this.addCategory}>
                                确认
                            </Button>
                        </Item>
                    </Form>
                </Modal>
                <Modal
                    title="添加规格"
                    visible={this.state.specsShow}
                    onCancel={() => { this.setState({ specsShow: false }) }}
                    onOk={() => {
                        console.log(foodForm)
                        const newObj = { ...foodForm }
                        const sameSpecs = newObj.specs.find(item => {
                            return item.specs === initSpecs.specs
                        })
                        console.log(newObj)
                        console.log(sameSpecs)
                        if (sameSpecs) {
                            message.error('存在相同规格,请重新选择其他规格')
                            return
                        }
                        if (!initSpecs.specs) {
                            message.error('请输入规格')
                            return
                        }
                        newObj.specs.push(initSpecs)
                        this.setState({
                            foodForm: newObj,
                            specsShow: false
                        })
                    }}
                >
                    <span>
                        <Item label="规格" >
                            <Input
                                placeholder='请输入规格'
                                onChange={(e) => {
                                    this.setState({ initSpecs: { ...initSpecs, specs: e.target.value } })
                                    console.log(foodForm)
                                    console.log(initSpecs)
                                }}
                            />
                        </Item>
                        <Item label='包装费'>
                            <InputNumber
                                min={0}
                                defaultValue={initSpecs.packing_fee}
                                onChange={(value) => {
                                    this.setState({ initSpecs: { ...initSpecs, packing_fee: value } })
                                }} />
                        </Item>
                        <Item label='价格'>
                            <InputNumber
                                min={0}
                                defaultValue={initSpecs.price}
                                onChange={(value) => {
                                    this.setState({ initSpecs: { ...initSpecs, value: value } })
                                }} />
                        </Item>
                    </span>
                </Modal>
            </Card >
        )
    }
}

export default connect(
    state => ({ food: state.food }),
)(Form.create()(AddFoodCategory))