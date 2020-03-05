const menuList = [
    {
        title: '首页', // 菜单标题名称
        key: '/home', // 对应的path
        icon: 'home', // 图标名称
        isPublic: true, // 公开的
    },
    {
        title: '数据管理',
        key: '/database',
        icon: 'appstore',
        children: [ // 子菜单列表
            {
                title: '商铺管理',
                key: '/shop',
                icon: 'edit'
            },
            {
                title: '食品管理',
                key: '/food',
                icon: 'tool'
            }
        ]
    },

    {
        title: '用户管理',
        key: '/user',
        icon: 'user'
    },
    {
        title: '角色管理',
        key: '/role',
        icon: 'safety',
    },

    {
        title: '图形图表',
        key: '/charts',
        icon: 'area-chart',
        children: [
            {
                title: '用户分布',
                key: '/bar',
                icon: 'bar-chart'
            }
        ]
    },

    {
        title: '订单管理',
        key: '/order',
        icon: 'windows',
    },
]

export default menuList