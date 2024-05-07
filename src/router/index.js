import Vue from 'vue'
import Router from 'vue-router'

import Mall from '@/pages/client/Mall';
import MallShow from '@/pages/client/MallShow';
import MallIndex from '@/pages/client/MallIndex';
import GoodsDetail from '@/pages/client/GoodsDetail';
import GoodsList from '@/pages/client/GoodsList';
import Personal from '@/pages/client/Personal';
import MyOrder from '@/pages/client/MyOrder';
import MyData from '@/pages/client/MyData';
import Cart from '@/pages/client/Cart';

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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const constantRoutes = [

    // {
    //     path: "/",
    //     redirect: "/mall"
    // }, 
    {
        path: '/mall',
        name: 'Mall',
        hidden: true,
        component: Mall,
        redirect: '/mall/show',
        children: [
            {
                path: 'show',
                name: 'MallShow',
                component: MallShow,
                redirect: '/mall/show/index',
                children: [
                    {
                        path: 'index',
                        name: 'MallIndex',
                        component: MallIndex
                    }, {
                        path: 'goodsList/:typeId/:keyword',
                        name: 'GoodsList',
                        component: GoodsList
                    },
                ]
            }, {
                path: 'goods/:id',
                name: 'GoodsDetail',
                component: GoodsDetail
            }, {
                path: 'personal',
                name: 'Personal',
                component: Personal,
                redirect: '/mall/personal/cart',
                children: [
                    {
                        path: 'cart',
                        name: 'Cart',
                        component: Cart,
                        meta: {
                            requireLogin: true,
                        },
                    }, {
                        path: 'myData',
                        name: 'MyData',
                        component: MyData,
                        meta: {
                            requireLogin: true,
                        },
                    }, {
                        path: 'myOrder',
                        name: 'MyOrder',
                        component: MyOrder,
                        meta: {
                            requireLogin: true,
                        },
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/register',
        component: () => import('@/views/register'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/error/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error/401'),
        hidden: true
    },

    {
        path: '',
        component: Layout,
        redirect: 'index',
        children: [
            {
                path: 'index',
                component: () => import('@/views/dashboard/index'),
                name: 'Index',
                meta: { title: '首页', icon: 'dashboard', affix: true }
            }
        ]
    },

    {
        path: '/user',
        component: Layout,
        name: "用户管理",
        children: [
            {
                path: 'manager',
                name: 'User',
                component: () => import('@/views/user/index'),
                meta: { title: '用户管理', icon: 'el-icon-user-solid' }
            }
        ]
    },
    {
        path: '/order',
        component: Layout,
        name: "订单管理",
        children: [
            {
                path: 'manager',
                name: 'Order',
                component: () => import('@/views/order/index'),
                meta: { title: '订单管理', icon: 'el-icon-s-order' }
            }
        ]
    },

    {
        path: '/product',
        component: Layout,
        name: "商品管理",
        children: [
            {
                path: 'manager',
                name: 'Product',
                component: () => import('@/views/product/index'),
                meta: { title: '商品管理', icon: 'el-icon-s-goods' }
            }
        ]
    },
    {
        path: '/review',
        component: Layout,
        name: "评论管理",
        children: [
            {
                path: 'review',
                name: 'review',
                component: () => import('@/views/review/index'),
                meta: { title: '评论管理', icon: 'el-icon-info' }
            }
        ]
    },
    {
        path: '/sensitiveWord',
        component: Layout,
        name: "敏感词管理",
        children: [
            {
                path: 'word',
                name: 'Word',
                component: () => import('@/views/word/index'),
                meta: { title: '敏感词管理', icon: 'el-icon-warning' }
            }
        ]
    },
    {
        path: '/operlog',
        component: Layout,
        name: "操作日志管理",
        children: [
            {
                path: 'manager',
                name: 'Operlog',
                component: () => import('@/views/operlog/index'),
                meta: { title: '操作日志管理', icon: 'table' }
            }
        ]
    },
    
    {
        path: '/pay',
        // component: Layout,
        name: "支付",
        component: () => import('@/views/pay/index')
    },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
let routerReplace = Router.prototype.replace;
// push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(err => err)
}
// replace
Router.prototype.replace = function push(location) {
    return routerReplace.call(this, location).catch(err => err)
}

export default new Router({
    mode: 'history', // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})
