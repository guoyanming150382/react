import Layout from '@/layout'


const accountRouter = {
    path: '/account',
    component: Layout,
    redirect: '/account/redPacket',
    meta: {
        title: '平台账务',
        icon: 'account',
        roles: ['ADM','NUR'],
    },
    children: [
        {
            path: 'redPacket',
            component: () => import('@/views/account/redPacket'),
            name: '红包流水',
            meta: {
                title: '红包流水',
                icon: 'redPacket',
                roles: ['ADM', 'NUR'],
                noCache: true
            }
        }
    ]
}

export default accountRouter