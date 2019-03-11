<template>
  <div class="l-total-page">
    <ef-list ref="EfItemList" :list="items" style="width: 100%;height: 100%;" :wrap-height="'100%'"
             v-on:handleScrollBottom="handleScrollBottom">
      <div v-for="(item,index) in items" class="l-row">
        <div class="l-row__title" @click="pushCategory(item.category.Id)">{{item.category.Name}}</div>
        <div style="width: 100%;display: flex;align-items: center">
          <ef-list :orientation="'horizontal'" :wrap-width="'100%'" style="width: 100%;height: 100%" ref="EfResList"
                   :wrap-height="'100%'" :list="item.resources" v-on:thumbVisible="thumbVisible(item,$event)" v-on:handleScrollRight="handleScrollRight(item)">
            <div v-for="resource in item.resources" class="l-row__res-container">
              <img :src="resource.Icon!=null?resource.Icon.Uri:require('../assets/ic_resource_default.png')" class="l-row__resourcePoster" @click="enterVideo(resource.Id)">
              <div class="l-row__resourceName">{{resource.Name.length>20?resource.Name.substring(0,20)+'...':resource.Name}}</div>
            </div>
          </ef-list>
          <i class="skyvideo sv-next l-row__leftIcon" @click="turnLeft(item,index)"
             v-if="item.thumbVisible&&item.scrollToRight"></i>
          <i class="skyvideo sv-next l-row__rightIcon" @click="turnRight(index)"
             v-if="item.thumbVisible&&!item.scrollToRight"></i>
        </div>
        <div class="l-row__baseLine"></div>
      </div>
    </ef-list>
    <i class="el-icon-loading" v-if="loadingVisible" style="position: absolute;left: 50%;transform: translateX(-50%);font-size: 1.5rem;bottom: 1rem"></i>
  </div>
</template>

<script>
  import EfList from "./common/ef-list/list";

  export default {
    name: "total-page",
    components: {EfList},
    data() {
      return {
        items: [],
        loadingVisible:false,
        itemCount:0,
        categories:[],
        curBottomItemIndex:0
      }
    },
    created() {
      this.fetchData();
    },
    mounted(){
      setTimeout(()=>{
        this.$refs.EfItemList.updateScrollbar();
      },300);
    },
    methods: {
      async fetchData() {
        let categories = [];
        await this.axios.get('/ccweb/api/categories/list').then((res) => {
          categories = res.data;
          this.categories=categories;
          this.itemCount=res.data.length;
        });
        let items = [];
        let rowCount=0;
        for (const category of categories) {
          await this.axios.get('/ccweb/api/resources/list', {
            params: {
              page: 1,
              numsperpage: 7,
              catid: category.Id
            }
          }).then((res) => {
            items.push({
              category: category,
              resources: res.data,
              thumbVisible:false,
              scrollToRight:false
            })
          });
          if(rowCount++>=3){
            break;
          }
        }
        this.curBottomItemIndex=rowCount-1;
        this.items = items;
      },
      async handleScrollBottom() {
        if(this.itemCount-1!=this.curBottomItemIndex){
          this.loadingVisible=true;
          let readyLoadItems=[];
          if(this.curBottomItemIndex+3<=this.itemCount-1){
            for(let i=this.curBottomItemIndex+1;i<=this.curBottomItemIndex+3;i++){
              readyLoadItems.push(this.categories[i]);
            }
            this.curBottomItemIndex+=3;
          }else {
            for(let i=this.curBottomItemIndex+1;i<this.itemCount;i++){
              readyLoadItems.push(this.categories[i]);
            }
            this.curBottomItemIndex=this.itemCount-1;
          }
          for (const category of readyLoadItems) {
            await this.axios.get('/ccweb/api/resources/list', {
              params: {
                page: 1,
                numsperpage: 7,
                catid: category.Id
              }
            }).then((res) => {
              this.items.push({
                category: category,
                resources: res.data,
                thumbVisible:false,
                scrollToRight:false
              })
            });
          }
          console.log('bottom');
          this.loadingVisible=false;
        }
      },
      turnLeft(item,index) {
        this.$refs.EfResList[index].outSmoothScroll(-1000, 300);
        item.scrollToRight=false;
      },
      turnRight(index) {
        this.$refs.EfResList[index].outSmoothScroll(1000, 300);
      },
      thumbVisible(item,isThumbVisible){
        console.log(isThumbVisible);
        item.thumbVisible=isThumbVisible;
      },
      handleScrollRight(item){
        item.scrollToRight=true;
      },
      pushCategory(categoryId){
        this.$router.push('/categoryPage/'+categoryId);
      }
    },
  }
</script>

<style scoped>

</style>
