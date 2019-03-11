import Vue from 'vue'
import Router from 'vue-router'
import categoryPage from '@/components/category-page'
import fashionPage from '@/components/fashion-page'
import recommendPage from '@/components/recommend-page'
import totalPage from '@/components/total-page'
import tagPage from '@/components/tag-page'
import videoPage from '@/components/video-page'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'全部视频',
      component:totalPage
    },
    {
      path:'/categoryPage/:categoryId',
      name:'categoryPage',
      component:categoryPage
    },
    {
      path:'/categoryPage/:categoryId/tag/:tagId',
      name:'tagPage',
      component:tagPage
    },
    {
      path:'/fashionPage',
      name:'时下流行',
      component:fashionPage
    },
    {
      path:'/recommendPage',
      name:'为你推荐',
      component:recommendPage
    },
    {
      path:'/totalPage',
      name:'全部视频',
      component:totalPage
    },
    {
      path:'/videoPage/:resId',
      name:'videoPage',
      component:videoPage
    }
  ]
})
