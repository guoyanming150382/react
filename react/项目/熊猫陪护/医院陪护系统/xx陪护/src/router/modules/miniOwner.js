import Layout from '@/layout'

const miniOwnerRouter = {
  path: '/miniOwner',
  component: Layout,
  redirect: '/miniOwner/list',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '小床主',
    icon: 'bed',
    roles: ['ADM','ACC']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/order/miniOwnerOrderList'),
      name: '订单列表',
      meta: {
        title: '订单列表',
        icon: 'list',
        roles: ['ADM'],
        noCache: true
      }
    },
    {
      path: 'offlinePay',
      component: () => import('@/views/finance/offlinePayList'),
      name: '认购审批',
      meta: { 
        title: '认购审批', 
        icon: 'platProfit', 
        noCache: true 
      }
    },
    {
      path: 'userWithdraw',
      component: () => import('@/views/finance/userWithdrawList'),
      name: '提现审批',
      meta: { 
        title: '提现审批', 
        icon: 'platProfit', 
        noCache: true 
      }
    },
    {
      path: 'ownerRefund',
      component: () => import('@/views/owner/refundList'),
      name: '退款审批',
      meta: {
        title: '退款审批',
        icon: 'list',
        roles: ['ADM'],
        noCache: true
      }
    }
  ]
}

export default miniOwnerRouter
