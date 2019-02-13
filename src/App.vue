<template>
  <el-row id="app">
    <el-col :span="4" class="l-app-sidebar">
      <div class="l-app-sidebar__header">
        <img src="./assets/logo.svg">
      </div>
      <div class="l-app-sidebar__mainOptions">
        <div v-for="option in mainOptions" class="l-app-sidebar__mainOption" @click="toggleOptions(option)" :class="{'is-active':option.selected}">
          {{option.label}}
        </div>
      </div>
      <div class="l-app-sidebar__categoryOptions">
        <div v-for="option in categoryOptions" class="l-app-sidebar__categoryOption"
             @click="toggleOptions(option)" :class="{'is-active':option.selected}">
          {{option.label}}
        </div>
      </div>
    </el-col>
    <el-col :span="20" class="main-content">
      <el-row class="main-content-header">
        <el-col :span="4">{{title}}</el-col>
        <el-col :span="8" :offset="14" class="category-input">
          <el-input class="main-content-input" suffix-icon="el-icon-search"></el-input>
        </el-col>
      </el-row>
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script>

  export default {
    name: 'App',
    data() {
      return {
        mainOptions: [],
        categoryOptions: [],
        title:"",
        categories:[]
      }
    },
    created() {
      this.init();
    },
    methods: {
      async init() {
        await this.fetchData();
        this.mainOptions = [
          {label: '全部', selected: false,path:'/totalPage'},
          {label: '推荐', selected: false,path:'/recommendPage'},
          {label: '流行', selected: false,path:'/fashionPage'}
        ]
        let routerPath=this.$router.currentRoute.path
        if(routerPath=='/'){
          this.mainOptions[0].selected=true;
        }else {
          this.mainOptions.forEach((option) => {
            if(option.path==routerPath){
              option.selected=true;
            }
          })
          this.categoryOptions.forEach((option) => {
            if(option.path==routerPath){
              option.selected=true;
            }
          })
        }
        this.setTitle();
      },
      async fetchData() {
        await this.axios.get('/ccweb/api/categories/list').then((res) => {
          this.categories=res.data;
          res.data.forEach((category) => {
            let path='/categoryPage/'+category.Id;
            this.categoryOptions.push({label: category.Name, selected: false,path:path});
          })
        })
        console.log(this.categoryOptions);
      },
      toggleOptions(option) {
        if(option.selected){
          return;
        }
        this.mainOptions.forEach((option) => {
          option.selected = false;
        })
        this.categoryOptions.forEach((option) => {
          option.selected = false;
        })
        option.selected = true;
        this.$router.push(option.path);
      },
      setTitle(){
        if(this.$route.name=='categoryPage'){
          this.title=this.findCategoryById(this.$route.params.categoryId);
        }else if(this.$route.name=='tagPage'){
          let catid=this.$route.params.categoryId;
          let tagid=this.$route.params.tagId;
          this.axios.get('/ccweb/api/tags/list?catid='+catid).then((res)=>{
            res.data.forEach((tag)=>{
              if(tag.Id==tagid){
                this.title=tag.Name;
              }
            });
            this.initOptions();
          });
        }else {
          this.title=this.$route.name;
        }
        if(this.findOptionByLabel(this.title)!=undefined){
          this.initOptions();
          this.findOptionByLabel(this.title).selected=true;
        }
      },
      findCategoryById(categoryId){
        for(let category of this.categories){
          if(category.Id==categoryId){
            return category.Name;
          }
        }
      },
      findOptionByLabel(label){
        for(let option of this.mainOptions){
          if(option.label==label){
            return option;
          }
        }
        for(let option of this.categoryOptions){
          if(option.label==label){
            return option;
          }
        }
      },
      initOptions(){
        this.mainOptions.forEach((option) => {
          option.selected = false;
        })
        this.categoryOptions.forEach((option) => {
          option.selected = false;
        })
      }
    },
    watch:{
      '$route':'setTitle'
    }
  }
</script>

<style>

  body, html {
    width: 100%;
    height: 100%;
  }

  body, html, div {
    margin: 0;
    padding: 0;
  }

  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    background-color: rgba(155, 155, 155, 0.11);
  }

  .main-content {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .main-content-header{
    width: 90%;
    margin-left: 5%;
    font-size: 1.75rem;
    height: fit-content;
    margin-top: 3.5rem;
    display: flex;
  }

  .main-content-input .el-input__inner{
    background-color: #E9E9E9 !important;
    border-radius: 2rem;
    border: none;
    font-size: 1.2rem;
    text-indent: 5px;
  }
</style>
