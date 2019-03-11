<template>
  <div class="l-total-page">
    <ef-list ref="EfItemList" :list="items" style="width: 100%;height: 100%;" :wrap-height="'100%'" v-on:handleScrollBottom="handleScrollBottom">
      <div style="width: 90%;margin-left: 5%;display: flex;" v-for="row in items">
        <div v-for="resource in row" style="width: 19%;margin-right: 1%;">
          <img :src="resource.Icon!=null?resource.Icon.Uri:require('../assets/ic_resource_default.png')" class="l-row__resourcePoster" style="width: 100%;" @click="enterVideo(resource.Id)">
          <div class="l-row__resourceName">{{resource.Name.length>20?resource.Name.substring(0,20)+'...':resource.Name}}</div>
        </div>
      </div>
    </ef-list>
    <i class="el-icon-loading" v-if="loadingVisible" style="position: absolute;left: 50%;transform: translateX(-50%);font-size: 1.5rem;bottom: 1rem"></i>
  </div>
</template>

<script>
  import EfList from "./common/ef-list/list";
  export default {
    name: "tag-page",
    components: {EfList},
    data() {
      return {
        items: [],
        totalpage: 0,
        curPage:0,
        numsperpage:0,
        rowCount:5,
        loadingVisible: false,
      }
    },
    created() {
      this.fetchData();
    },
    mounted(){
      setTimeout(()=>{
        this.$refs.EfItemList.updateScrollbar();
      },200);
    },
    methods: {
      init(){
        this.items=[];
        this.curPage=1;
        this.totalpage=0;
        this.numsperpage=30;
        this.rowCount=5;
      },
      async fetchData() {
        this.init();
        let catid = this.$route.params.categoryId;
        let tagid = this.$route.params.tagId;
        let numsperpage = this.numsperpage;
        await this.axios.get('/ccweb/api/resources/count', {
          params: {
            catid: catid,
            tagid: tagid
          }
        }).then((res) => {
          let count=res.data;
          this.totalpage = parseInt(count / numsperpage) == count / numsperpage ? parseInt(count / numsperpage) : parseInt(count / numsperpage) + 1;
        });
        await this.axios.get('/ccweb/api/resources/list', {
          params: {
            page: 1,
            numsperpage: numsperpage,
            catid: catid,
            tagid: tagid
          }
        }).then((res) => {
          this.items=this.groupArray(res.data,this.rowCount);
        });
      },
      groupArray(arr, rowItems) {
        let row = [];
        let groupedArr = [];
        for (let i = 0; i < arr.length; i++) {
          row.push(arr[i]);
          if (row.length == rowItems || i == arr.length - 1) {
            groupedArr.push(row);
            row = [];
          }
        }
        return groupedArr;
      },
      async handleScrollBottom(){
        if(this.curPage<this.totalpage){
          this.loadingVisible=true;
          this.curPage++;
          let catid = this.$route.params.categoryId;
          let tagid = this.$route.params.tagId;
          await this.axios.get('/ccweb/api/resources/list', {
            params: {
              page: this.curPage,
              numsperpage: this.numsperpage,
              catid: catid,
              tagid: tagid
            }
          }).then((res) => {
            this.loadingVisible=false;
            this.items.push(...this.groupArray(res.data,this.rowCount));
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
