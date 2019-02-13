<template>
  <div class="l-total-page">
    <ef-list :list="items" style="width: 100%;height: 100%;" :wrap-height="'100%'" ref="EfItemList"
             v-on:handleScrollBottom="handleScrollBottom" :orientation="'vertical'">
      <div v-for="(item,index) in items" class="l-row">
        <div class="l-row__title" @click="pushTag(item.tag.Id)">{{item.tag.Name}}</div>
        <div style="width: 100%;display: flex;align-items: center">
          <ef-list :orientation="'horizontal'" :wrap-width="'100%'" style="width: 100%;height: 100%" ref="mEfResList"
                   :wrap-height="'100%'" :list="item.resources" v-on:thumbVisible="thumbVisible(item,$event)"
                   v-on:handleScrollRight="handleScrollRight(item)">
            <div v-for="resource in item.resources" class="l-row__res-container">
              <img :src="resource.Icon!=null?resource.Icon.Uri:require('../assets/ic_resource_default.png')"
                   class="l-row__resourcePoster">
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
    <i class="el-icon-loading" v-if="loadingVisible"
       style="position: absolute;left: 50%;transform: translateX(-50%);font-size: 1.5rem;bottom: 1rem"></i>
  </div>
</template>

<script>
  import EfList from "./common/ef-list/list";

  export default {
    name: "category-page",
    components: {EfList},
    data() {
      return {
        items: [],
        loadingVisible: false,
        itemCount: 0,
        tags: [],
        curBottomItemIndex: 0
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
      init() {
        this.items = [];
        this.loadingVisible = false;
        this.itemCount = 0;
        this.tags = [];
        this.curBottomItemIndex = 0;
      },
      async fetchData() {
        console.log('fetchData');
        this.init();
        await this.axios.get('/ccweb/api/tags/list', {
          params: {
            catid: this.$route.params.categoryId
          }
        }).then((res) => {
          this.tags = res.data;
          this.itemCount = res.data.length;
        });
        let items = [];
        let rowCount = 0;
        for (const tag of this.tags) {
          await this.axios.get('/ccweb/api/resources/list', {
            params: {
              page: 1,
              numsperpage: 10,
              catid: this.$route.params.categoryId,
              tagid: tag.Id
            }
          }).then((res) => {
            items.push({
              tag: tag,
              resources: res.data,
              thumbVisible: false,
              scrollToRight: false
            })
          });
          if (rowCount++ >= 2) {
            this.curBottomItemIndex = 2;
            break;
          }
        }
        this.items = items;
      },
      async handleScrollBottom() {
        console.log('handleScrollBottom');
        if (this.itemCount - 1 != this.curBottomItemIndex) {
          this.loadingVisible = true;
          let readyLoadItems = [];
          if (this.curBottomItemIndex + 3 <= this.itemCount - 1) {
            for (let i = this.curBottomItemIndex + 1; i <= this.curBottomItemIndex + 3; i++) {
              readyLoadItems.push(this.tags[i]);
            }
            this.curBottomItemIndex += 3;
          } else {
            for (let i = this.curBottomItemIndex + 1; i < this.itemCount; i++) {
              readyLoadItems.push(this.tags[i]);
            }
            this.curBottomItemIndex = this.itemCount - 1;
          }
          for (const tag of readyLoadItems) {
            await this.axios.get('/ccweb/api/resources/list', {
              params: {
                page: 1,
                numsperpage: 7,
                catid: this.$route.params.categoryId,
                tagid: tag.Id
              }
            }).then((res) => {
              this.items.push({
                tag: tag,
                resources: res.data,
                thumbVisible: false,
                scrollToRight: false
              })
            });
          }
          this.loadingVisible = false;
        }
      },
      turnLeft(item, index) {
        this.$refs.mEfResList[index].outSmoothScroll(-3000, 600);
        item.scrollToRight = false;
      },
      turnRight(index) {
        this.$refs.mEfResList[index].outSmoothScroll(3000, 600);
      },
      thumbVisible(item, isThumbVisible) {
        item.thumbVisible = isThumbVisible;
      },
      handleScrollRight(item) {
        item.scrollToRight = true;
      },
      toggleCategory() {
        setTimeout(()=>{
          this.$refs.EfItemList.updateScrollbar();
        },200);
        this.fetchData();
      },
      pushTag(tagId){
        this.$router.push('/categoryPage/'+this.$route.params.categoryId+'/tag/'+tagId);
      }
    },
    watch: {
      '$route': 'toggleCategory',
    }
  }
</script>

<style scoped>

</style>
