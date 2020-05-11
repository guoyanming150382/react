import Layout from '@/layout'

const accordingRouter = {
  path: '/according',
  component: Layout,
  redirect: '/according/worker/accordingList',
  meta: {
    title: '陪护平台',
    icon: 'module',
    roles: ['ADM','NUR'],
  },
  children: [
    {
      path: "worker",
      component: () => import('@/views/according/worker/index'),
      redirect: '/according/worker/accordingList',
      meta: {
        title: '照护师管理',
        icon: 'nurse',
        roles: ['ADM','NUR'],
      },
      children: [
        // {
        //   path: 'accordingAudit',
        //   component: () => import('@/views/according/worker/Audit'),
        //   name: '护工审核',
        //   meta: {
        //     title: '护工审核',
        //     icon: 'approve',
        //     roles: ['ADM', 'NUR'],
        //     noCache: true
        //   },
        // },
        {
          path: 'accordingList',
          component: () => import('@/views/according/worker/List'),
          name: '照护师列表',
          meta: {
            title: '照护师列表',
            icon: 'list',
            roles: ['ADM', 'NUR'],
            noCache: true
          },
        },
        {
          path: 'getWorkerBill',
          component: () => import('@/views/according/components/getWorkerBill'),
          name: '结款账单',
          hidden: false,
          meta: {
            title: '结款账单',
            icon: 'fee',
            roles: ['ADM', 'NUR'],
            noCache: true,
          }
        },
        {
          path: 'wthDraw',
          component: () => import('@/views/according/worker/wthDraw'),
          name: '护工提现审批',
          meta: {
            title: '提现审批',
            icon: 'tree',
            roles: ['ADM', 'NUR'],
            noCache: true
          },
        },
        {
          path: 'transDetail',
          component: () => import('@/views/according/worker/transDetail'),
          name: '资金明细',
          meta: {
            title: '资金明细',
            icon: 'money',
            roles: ['ADM', 'NUR'],
            noCache: true
          },
        },
        {
          path: 'workerCredit',
          component: () => import('@/views/according/worker/workerCredit'),
          name: '护工积分明细 ',
          meta: {
            title: '积分明细 ',
            icon: 'edit',
            roles: ['ADM', 'NUR'],
            noCache: true
          },
        },
        {
          path: 'orderdetail',
          component: () => import('@/views/according/components/OrderDetail'),
          name: '订单详情',
          hidden: true,
          meta: {
            title: '订单详情',
            roles: ['ADM', 'NUR'],
            noCache: true,
            activeMenu: '/according/fee/careOrder'
          }
        },
        // {
        //   path: 'Certificate',
        //   component: () => import('@/views/according/worker/Certificate'),
        //   name: '资质证书',
        //   meta: {
        //     title: '资质证书',
        //     icon: 'cert',
        //     roles: ['ADM', 'NUR'],
        //     noCache: true
        //   }
        // },
        {
          path: 'detail',
          component: () => import('@/views/according/components/detail'),
          name: '护工详情',
          hidden: true,
          meta: {
            title: '护工详情',
            roles: ['ADM', 'NUR'],
            noCache: true,
            activeMenu: '/according/worker/accordingList'
          }
        },
        {
          path: 'approve',
          component: () => import('@/views/according/components/approve'),
          name: '审核',
          hidden: true,
          meta: {
            title: '审核',
            roles: ['ADM', 'NUR'],
            noCache: true,
            activeMenu: '/according/worker/accordingAudit'
          }
        },
      ],
    },
    // {
    //   path: "fee",
    //   component: () => import('@/views/according/fee/index'),
    //   redirect: '/according/fee/feeList',
    //   meta: {
    //     title: '费用相关',
    //     icon: 'fee',
    //     roles: ['ADM','NUR'],
    //   },
    //   children: [{
    //       path: 'feeList',
    //       component: () => import('@/views/according/fee/feeList'),
    //       name: '医院护理费用',
    //       meta: {
    //         title: '医院护理费用',
    //         icon: 'fee',
    //         roles: ['ADM', 'NUR'],
    //         noCache: true
    //       }
    //     },
    //     {
    //       path: 'homeFeeList',
    //       component: () => import('@/views/according/fee/homeFeeList'),
    //       name: '家庭护理费用',
    //       meta: {
    //         title: '家庭护理费用',
    //         icon: 'fee',
    //         roles: ['ADM', 'NUR'],
    //         noCache: true
    //       }
    //     },
    //     {
    //       path: 'earnings',
    //       component: () => import('@/views/according/fee/earnings'),
    //       name: '护工收益',
    //       meta: {
    //         title: '护工收益',
    //         icon: 'fee',
    //         roles: ['ADM', 'NUR'],
    //         noCache: true
    //       }
    //     },
    //   ],
    // },
    {
      path: 'careOrder',
      component: () => import('@/views/according/fee/careorder'),
      name: '护工订单列表',
      meta: {
        title: '订单列表 ',
        icon: 'list',
        roles: ['ADM', 'NUR'],
        noCache: true
      }
    },
    {
      path: 'getCusBill',
      component: () => import('@/views/according/components/getCusBill'),
      name: '客户账单',
      hidden: false,
      meta: {
        title: '客户账单',
        icon: 'fee',
        roles: ['ADM', 'NUR'],
        noCache: true,
      }
    },
  ]
}

export default accordingRouter
