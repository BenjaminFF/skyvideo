<template>
  <div class="video-page">
    <div class="header">
      <div class="header-container">
        <img src="../assets/logo.svg">
        <el-input class="main-content-input" suffix-icon="skyvideo sv-sousuo" style="width: 25rem"></el-input>
      </div>
    </div>
    <div class="video-container">
      <div style="width: 60%;height: 100%">
        <video id="my-video" class="video-js vjs-big-play-centered m-videojs" preload="undefined"
               crossorigin="anonymous" autoplay controls webkit-playsinline="true" playsinline="true">
          <source :src="curResUri" type="video/mp4"/>
        </video>
      </div>
    </div>
    <div class="recommend">
      <div class="recommend-container">
        <div style="display: flex;margin-top: 1rem;margin-bottom: 1rem;align-items: flex-end">
          <div style="font-size: 2rem">{{mResource.Name}}</div>
          <div class="l-tag" style="margin-left: 0.5rem;height: 1rem" @click="pushCategory(mResource.Category.Id)">
            <i class="skyvideo sv-TAG l-tag__icon"></i>
            {{mResource.Category.Name}}
          </div>
          <div class="l-playCount" style="margin-left: 0.5rem">
            <i class="skyvideo sv-eye l-playCount__icon"></i>
            {{mResource.Playcount}}
          </div>
        </div>
        <div style="display: flex">
          <div v-for="resource in recommendResources" style="width: 17%;margin-right: 1%">
            <img :src="resource.Icon!=null?resource.Icon.Uri:require('../assets/ic_resource_default.png')"
                 class="l-row__resourcePoster" style="margin-top: 0rem !important;height: 7rem;width: 100%"
                 @click="toggleResource(resource.Uri)">
            <div class="l-row__resourceName"
                 style="margin-bottom: 0.5rem !important;font-size: 1rem;margin-top: 0.5rem">
              {{resource.Name.length>15?resource.Name.substring(0,15)+'...':resource.Name}}
            </div>
            <div style="display: flex">
              <div class="l-tag" style="margin-right: 0.5rem" @click="pushCategory(resource.Category.Id)">
                <i class="skyvideo sv-TAG l-tag__icon"></i>
                {{mResource.Category.Name}}
              </div>
              <div class="l-playCount">
                <i class="skyvideo sv-eye l-playCount__icon"></i>
                {{resource.Playcount}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import 'video.js/dist/video-js.css'
  import videojs from 'video.js'
  import videojsvr from 'videojs-vr'

  export default {
    name: "video-page",
    data() {
      return {
        mResource: {},
        recommendResources: [],
        curResUri: '',
        videoVisible: false,
        player:{}
      }
    },
    created() {
      this.fetchData();
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.player = videojs('my-video');
          this.player.vr({projection: '360'});
        }, 1000);
      });
    },
    beforeDestroy() {
      //this.player.dispose();
    },
    methods: {
      init() {
        this.mResource = {};
        this.recommendResources = [];
        this.player = {};
      },
      async fetchData() {
        let resId = this.$route.params.resId;
        await this.axios.get('/ccweb/api/resources/list?id=' + resId).then((res) => {
          this.mResource = res.data[0];
          this.curResUri = this.mResource.Uri;
        });
        await this.axios.get('/ccweb/api/resources/list', {
          params: {
            page: 1,
            numsperpage: 5,
            catid: this.mResource.Category.Id
          }
        }).then((res) => {
          this.recommendResources = res.data;
        });
      },
      pushCategory(categoryId) {
        this.$router.push('/categoryPage/' + categoryId);
      },
      toggleResource(resourceUri) {
        this.curResUri = resourceUri;
        this.player.src(resourceUri);
      },
    }
  }
</script>

<style scoped>
  .video-page {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: white;

  }

  .header {
    width: 100%;
    height: 10%;
    background-color: white;
  }

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    height: 100%;
    margin-left: 10%;
  }

  .video-container {
    width: 100%;
    height: 60%;
    background-color: black;
    display: flex;
    justify-content: center;
    position: relative;
  }

  .recommend {
    width: 100%;
    height: 30%;
    background-color: white;
  }

  .recommend-container {
    width: 60%;
    margin-left: 20%;
    height: 100%;
  }

  .m-videojs {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .m-videojs video {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
</style>

<style>
  .vjs-big-play-button {
    display: none !important;
  }
</style>
