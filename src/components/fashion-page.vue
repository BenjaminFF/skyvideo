<template>
  <div class="l-total-page">
    <ef-list ref="EfItemList" :list="items" style="width: 100%;height: 100%;" :wrap-height="'100%'">
      <div style="width: 90%;margin-left: 5%;display: flex;" v-for="row in items">
        <div v-for="resource in row" style="width: 19%;margin-right: 1%;">
          <img :src="resource.Icon!=null?resource.Icon.Uri:require('../assets/ic_resource_default.png')"
               class="l-row__resourcePoster" style="width: 100%;">
          <div class="l-row__resourceName" style="margin-bottom: 0.5rem !important;">
            {{resource.Name.length>20?resource.Name.substring(0,20)+'...':resource.Name}}
          </div>
          <div style="display: flex">
            <div class="l-tag" style="margin-right: 0.5rem" @click="pushCategory(resource.Category.Id)">
              <i class="skyvideo sv-TAG l-tag__icon"></i>
              {{resource.Category.Name}}
            </div>
            <div class="l-playCount">
              <i class="skyvideo sv-eye l-playCount__icon"></i>
              {{resource.Playcount}}
            </div>
          </div>
        </div>
      </div>
    </ef-list>
  </div>
</template>

<script>
  import EfList from "./common/ef-list/list";

  export default {
    name: "fashion-page",
    components: {EfList},
    data() {
      return {
        items: [],
        rowCount: 5,
      }
    },
    created() {
      this.fetchData();
    },
    mounted() {
      setTimeout(() => {
        this.$refs.EfItemList.updateScrollbar();
      }, 200);
    },
    methods: {
      init() {
        this.items = [];
        this.rowCount = 5;
      },
      fetchData() {
        this.axios.get('ccweb/api/resources/list?sortbyplaycount=true&page=1&numsperpage=30').then((res) => {
          console.log(res.data);
          this.items = this.groupArray(res.data, this.rowCount);
        })
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
      pushCategory(categoryId){
        this.$router.push('/categoryPage/'+categoryId);
      }
    }
  }
</script>

<style scoped>

</style>
