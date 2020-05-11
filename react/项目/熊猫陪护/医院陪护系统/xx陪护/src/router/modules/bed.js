import Layout from '@/layout'
const bedRouter = {
  path: '/bed',
  component: Layout,
  redirect: '/bed/list',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '陪护床',
    icon: 'bed',
    roles: ['ADM','ACC']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/bed/list'),
      name: '床列表',
      meta: {
        title: '床列表',
        icon: 'bed',
        roles: ['ADM'],
        noCache: true
      }
    },
    {
      path: 'orderList',
      component: () => import('@/views/bed/orderList'),
      name: '床订单列表',
      meta: {
        title: '订单列表',
        icon: 'list',
        roles: ['ADM'],
        noCache: true
      }
    },
    {
      path: 'buyCardList',
      component: () => import('@/views/bed/cardList'),
      name: '购卡列表',
      meta: {
        title: '购卡列表',
        icon: 'shopping',
        roles: ['ADM'],
        noCache: true
      },
    },
    // {
    //   path: 'ownerWithdraw',
    //   component: () => import('@/views/bed/withdrawList'),
    //   name: '提现审批',
    //   meta: { 
    //     title: '提现审批', 
    //     icon: 'platProfit', 
    //     roles: ['ADM','ACC'],
    //     noCache: true 
    //   }
    // },
    {
      path: '/order',
      component: Layout,
      redirect: '/order/qdOrderList',
      children: [
        {
          path: 'myBedList',
          component: () => import('@/views/bed/myBedList'),
          name: '我的陪护床',
          meta: {
            title: '我的陪护床',
            icon: 'bed',
            roles: ['OPE','OWN'],
            noCache: true
          }
        },
        {
          path: 'qdOrderList',
          component: () => import('@/views/bed/qdOrderList'),
          name: '渠道商订单列表',
          meta: {
            title: '渠道商订单列表',
            icon: 'list',
            roles: ['DIS'],
            noCache: true
          }
        }
      ]
    },
  ]
}

export default bedRouter