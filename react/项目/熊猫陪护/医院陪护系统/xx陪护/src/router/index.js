import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'



/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/mobile',
    component: () => import('@/viewm/login/login')
  },
  {
    path: '/mobile/index',
    component: () => import('@/viewm/login/index')
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

/* Router Modules */
import accordingRouter from './modules/according'
import bedRouter from './modules/bed'
import customerRouter from './modules/customer'
import miniOwnerRouter from './modules/miniOwner'
import accountRouter from './modules/account'

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '统计信息',
        meta: { title: '统计信息', icon: 'dashboard', affix: true, roles: ['ADM','NUR']}
      }
    ]
  },

  customerRouter, //平台客户
  bedRouter,  //陪护床板块
  accordingRouter,  //陪护平台
  miniOwnerRouter, //小床主
  accountRouter,  //平台账务

  // {
  //   path: '/nurse',
  //   component: Layout,
  //   redirect: '/nurse/nurseList',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     title: '熊猫护工',
  //     icon: 'bed',
  //     roles: ['ADM','ACC']
  //   },
  //   children: [
  //     {
  //       path: 'nurseList',
  //       component: () => import('@/views/nurse/nurseList'),
  //       name: '护工列表',
  //       meta: {
  //         title: '护工列表',
  //         icon: 'nurse',
  //         roles: ['ADM','NUR'],
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: 'orderList',
  //       component: () => import('@/views/nurse/orderList'),
  //       name: '订单列表',
  //       meta: {
  //         title: '订单列表',
  //         icon: 'nurse',
  //         roles: ['ADM','NUR'],
  //         noCache: true
  //       }
  //     }
  //   ]
  // },

  
  // 测试富文本
  // {
  //   path: '/editor',
  //   component: Layout,
  //   redirect: '/editor/test',
  //   meta: {
  //     title: '富文本',
  //     icon: 'approve',
  //     roles: ['ADM'],
  //   },
  //   children: [
  //     {
  //       path: 'test',
  //       component: () => import('@/views/00/test'),
  //       name: '富文本',
  //       meta: {
  //         title: '富文本',
  //         icon: 'approve',
  //         roles: ['ADM'],
  //         noCache: true
  //       }
  //     },
  //   ]  
  // },
  /* {
    path: '/profit',
    component: Layout,
    redirect: '/profit/list',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '收益查看',
      icon: 'profit',
      roles: ['ADM','OPE','OWN']
    },
    children: [
      {
        path: 'myList',
        component: () => import('@/views/profit/myList'),
        name: '平台收益',
        meta: { 
          title: '平台收益', 
          icon: 'platProfit', 
          noCache: true 
        }
      },
      {
        path: 'list',
        component: () => import('@/views/profit/list'),
        name: '全员收益',
        meta: { 
          title: '全员收益', 
          icon: 'profit', 
          roles: ['ADM'],
          noCache: true 
        }
      }, 
      {
        path: 'memList',
        component: () => import('@/views/profit/memList'),
        name: '组员收益',
        meta: { 
          title: '组员收益', 
          icon: 'shopping', 
          roles: ['OPE','DIS','OWN'],
          noCache: true 
        }
      } 
    ]
  },*/


  /* {
    path: '/finance',
    component: Layout,
    redirect: '/finance/withdrawList',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '财务审批',
      icon: 'finance',
      roles: ['ADM','ACC']
    },
    children: [
      {
        path: 'offlinePay',
        component: () => import('@/views/finance/offlinePayList'),
        name: '小床主认购',
        meta: { 
          title: '小床主认购', 
          icon: 'platProfit', 
          noCache: true 
        }
      },
      {
        path: 'userWithdraw',
        component: () => import('@/views/finance/userWithdrawList'),
        name: '小床主提现',
        meta: { 
          title: '小床主提现', 
          icon: 'platProfit', 
          noCache: true 
        }
      },
      {
        path: 'ownerWithdraw',
        component: () => import('@/views/finance/withdrawList'),
        name: '渠道商提现',
        meta: { 
          title: '渠道商提现', 
          icon: 'platProfit', 
          noCache: true 
        }
      }
    ]
  }, */
  /* {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: '用户管理',
        meta: {
          title: '用户管理',
          icon: 'user',
          roles: ['ADM'],
          noCache: true
        }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    redirect: '/role/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/role/index'),
        name: '角色管理',
        meta: {
          title: '角色管理',
          icon: 'role',
          roles: ['ADM'],
          noCache: true
        }
      }
    ]
  }, */
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
