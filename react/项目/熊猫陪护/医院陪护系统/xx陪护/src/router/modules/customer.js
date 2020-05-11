import Layout from '@/layout'

const customerRouter = {
  path: '/customer',
  component: Layout,
  redirect: '/customer/list',
  meta: {
    title: '平台客户',
    icon: 'wechat',
    roles: ['ADM'],
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/customer/list'),
      name: '客户列表',
      meta: {
        title: '客户列表',
        icon: 'wechat',
        roles: ['ADM'],
        noCache: true
      }
    },
    {
      path: 'getVip',
      component: () => import('@/views/customer/getVip'),
      name: 'VIP认购',
      meta: {
        title: 'VIP认购',
        icon: 'vip',
        roles: ['ADM'],
        noCache: true
      }
    },
    {
      path: 'cusCredit',
      component: () => import('@/views/customer/cusCredit'),
      name: '积分明细',
      meta: {
        title: '积分明细',
        icon: 'edit',
        roles: ['ADM'],
        noCache: true
      }
    },
    {
      path: 'cusTrans',
      component: () => import('@/views/customer/cusTrans'),
      name: '客户资金明细',
      meta: {
        title: '资金明细',
        icon: 'money',
        roles: ['ADM'],
        noCache: true
      }
    },
    {
      path: 'customerDetail',
      component: () => import('@/views/customer/components/detail'),
      name: '客户详情',
      hidden: true,
      meta: {
        title: '客户详情',
        roles: ['ADM','NUR'],
        noCache: true,        
        activeMenu: '/customer/list' 
      }
    }
  ]
}

export default customerRouter