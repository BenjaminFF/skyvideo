<template>
  <div class="el-list">
    <div ref="wrap"
         :class="[
           'el-list__wrap',{
              'is-vertical':orientation=='vertical',
              'is-horizontal':orientation=='horizontal',
           }
         ]"
         :style="{marginRight:mMarginRight+'px',marginBottom:mMarginBottom+'px',width:mWrapWidth,height:mWrapHeight}">
      <div style="flex-shrink: 0;flex-grow: 0" :style="{display:this.orientation=='horizontal'?'flex':'block'}">
        <slot></slot>
      </div>
    </div>
    <div
      :class="[
           'el-list__scrollbar',{
              'is-vertical':orientation=='vertical',
              'is-horizontal':orientation=='horizontal',
           }
         ]"
         @mousedown="handleTrackClick($event)"
         v-if="nScrollbarData.visible">
      <div class="el-list__scrollbar__thumb"
           @mousedown="thumbMouseDown($event)"
           :style="thumbStyle" ref="mThumb">
      </div>
    </div>
  </div>
</template>
<script>
  import keyframe from './keyframes'
    export default {
      name: "EfList",
      data(){
        return{
          nScrollbarData:{},
          flags:{},
          scrollbarStyle:{},
          thumbStyle:{},
        }
      },
      props:{
        orientation:{
          type:String,
          default:'vertical'
        },

        list:{
          type: Array,
          required:true
        },

        wrapWidth:{
          type:String,
          default:'30rem'
        },

        wrapHeight:{
          type:String,
          default:'30rem'
        }
      },
      computed:{
        mWrapWidth(){
          return this.orientation=='vertical'?'auto':this.wrapWidth
        },
        mWrapHeight(){
          return this.orientation=='vertical'?this.wrapHeight:'auto'
        },
        mMarginRight(){
          return this.orientation=='vertical'?-this.nScrollbarData.width:0
        },
        mMarginBottom(){
          return this.orientation=='vertical'?0:-this.nScrollbarData.height
        }
      },
      created(){
        window.addEventListener('scroll', this.handleScroll,true);
      },
      mounted(){
        this.initnScrollbarData();
        this.flags={
          isAdding:false,
          isDeleting:false
        }
      },
      methods:{
        handleScroll(){
            this.updateThumb();
        },
        thumbMouseDown(event){
          this.nScrollbarData.thumbOnMove=true;
          this.nScrollbarData.thumbPivotX=event.clientX;
          this.nScrollbarData.thumbPivotY=event.clientY;
          document.addEventListener('mousemove',this.thumbMouseMove,false);
          document.addEventListener('mouseup',this.thumbMouseUp,false);
        },
        thumbMouseMove(event){
          if(this.nScrollbarData.thumbOnMove==true){
            let warp=this.$el.children[0];
            if(this.orientation=='vertical'){
              let offsetY=event.clientY-this.nScrollbarData.thumbPivotY;
              this.nScrollbarData.thumbPivotY=event.clientY;
              warp.scrollTop+=offsetY*warp.scrollHeight/warp.clientHeight;
            }else if(this.orientation=='horizontal'){
              let offsetX=event.offsetX-this.nScrollbarData.thumbPivotX;
              warp.scrollLeft+=offsetX;
            }
          }
        },
        thumbMouseUp(event){
          this.nScrollbarData.thumbOnMove=false;
          document.removeEventListener('mousemove',this.thumbMouseMove);
        },
        handleTrackClick(event){
          if(event.target.className!='el-list__scrollbar__thumb'){
            let warp=this.$el.children[0];
            if(this.orientation=='vertical'){
              if(event.offsetY<=this.nScrollbarData.thumbMoveY){
                let scrollTop=Math.ceil(event.offsetY*warp.scrollHeight/warp.clientHeight);
                this.smoothScroll(scrollTop,warp,200);
              }else{
                let scrollTop=Math.ceil((event.offsetY-this.nScrollbarData.thumbHeight)*warp.scrollHeight/warp.clientHeight);
                this.smoothScroll(scrollTop,warp,200);
              }
            }else if(this.orientation=='horizontal'){
              if(event.offsetX<=this.nScrollbarData.thumbMoveX){
                let scrollLeft=Math.ceil(event.offsetX*warp.scrollWidth/warp.clientWidth);
                this.smoothScroll(scrollLeft,warp,200);
              }else{
                let scrollLeft=Math.ceil((event.offsetX-this.nScrollbarData.thumbWidth)*warp.scrollWidth/warp.clientWidth);
                this.smoothScroll(scrollLeft,warp,200);
              }
            }
          }
        },
        outSmoothScroll(offset,duration){
          let el=this.$el.children[0];
          let flashTimes=duration/1000*60;    //帧数
          let pxPerTime,direction;
          if(this.orientation=='vertical'){
            pxPerTime=Math.round(offset/flashTimes);
            direction=offset?'up':'down';
          }else if(this.orientation=='horizontal'){
            pxPerTime=Math.round(offset/flashTimes);
          }
          let curFlash=0;
          let step = ()=> {
            if(this.orientation=='vertical'){
              if(direction=='down'){
                if(end-el.scrollTop<=0){
                  return;
                }
                el.scrollTop+=pxPerTime;
              }else {
                if(end-el.scrollTop>=0){
                  return;
                }
                el.scrollTop-=pxPerTime;
              }
            }else if(this.orientation=='horizontal'){
              if((el.scrollLeft<=0&&offset<=0)||(el.scrollLeft>=el.clientWidth&&offset>=0)){
                return;
              }
              if((curFlash++)==flashTimes){
                return;
              }
              el.scrollLeft+=pxPerTime;
            }
            requestAnimationFrame(step);
          }
          step();
        },
        //linear,duration为ms
        smoothScroll(end,el,duration){
          let flashTimes=duration/1000*60;
          let pxPerTime,direction;
          if(this.orientation=='vertical'){
            pxPerTime=Math.round(Math.abs(el.scrollTop-end)/flashTimes);
            direction=el.scrollTop>end?'up':'down';
          }else if(this.orientation=='horizontal'){
            pxPerTime=Math.round(Math.abs(el.scrollLeft-end)/flashTimes);
            direction=el.scrollLeft>end?'left':'right';
          }
          let step = ()=> {
            if(this.orientation=='vertical'){
              if(direction=='down'){
                if(end-el.scrollTop<=0){
                  return;
                }
                el.scrollTop+=pxPerTime;
              }else {
                if(end-el.scrollTop>=0){
                  return;
                }
                el.scrollTop-=pxPerTime;
              }
            }else if(this.orientation=='horizontal'){
              if(direction=='left'){
                if(end-el.scrollLeft>=0){
                  return;
                }
                el.scrollLeft-=pxPerTime;
              }else {
                if(end-el.scrollLeft<=0){
                  return;
                }
                el.scrollLeft+=pxPerTime;
              }
            }
            requestAnimationFrame(step);
          }
         step();
        },
        updateScrollbar(){
          this.$nextTick(()=>{
            let warp=this.$el.children[0];
            let visible=false;
            if(this.orientation=='horizontal'){
              visible=warp.scrollWidth>warp.clientWidth?true:false;
              this.nScrollbarData.thumbWidth=Math.ceil(warp.clientWidth/warp.scrollWidth*warp.clientWidth);
            }else {
              this.nScrollbarData.thumbHeight=Math.ceil(warp.clientHeight/warp.scrollHeight*warp.clientHeight);
              visible=warp.scrollHeight>warp.clientHeight?true:false;
            }
            this.thumbStyle=this.orientation=='horizontal'?
              {width: this.nScrollbarData.thumbWidth+'px',
                transform:'translateX(0px)'}
              :{height: this.nScrollbarData.thumbHeight+'px',
                transform:'translateY(0px)'}
            this.nScrollbarData.visible=visible;
          })
        },
        initnScrollbarData(){
          let el=this.$el.children[0];
          let nScrollbarWidth=this.orientation=='horizontal'?el.clientWidth:el.offsetWidth-el.clientWidth;
          let nScrollbarHeight=this.orientation=='horizontal'?el.offsetHeight-el.clientHeight:el.clientHeight;
          let thumbWidth=el.clientWidth/el.scrollWidth*el.clientWidth;
          let thumbHeight=el.clientHeight/el.scrollHeight*el.clientHeight;
          this.$nextTick(()=>{
            let warp=this.$el.children[0];
            let visible=false;
            if(this.orientation=='horizontal'){
              visible=warp.scrollWidth>warp.clientWidth?true:false;
            }else {
              visible=warp.scrollHeight>warp.clientHeight?true:false;
            }
            this.$emit('thumbVisible',visible);
            this.nScrollbarData= {
              width:nScrollbarWidth,
              height:nScrollbarHeight,
              thumbVisible:visible,
              thumbWidth:thumbWidth,
              thumbHeight:thumbHeight,
              thumbMoveX:0,
              thumbMoveY:0,
              visible:visible,
              thumbOnMove:false,
              thumbPivotX:"",
              thumbPivotY:"",
            }
            this.thumbStyle=this.orientation=='horizontal'?
              {width: this.nScrollbarData.thumbWidth+'px',
                transform:'translateX(0px)'}
              :{height: this.nScrollbarData.thumbHeight+'px',
                transform:'translateY(0px)'}
          });
        },
        updateThumb(){
          let warp=this.$el.children[0];
          if(this.orientation=='vertical'){
            this.nScrollbarData.thumbMoveY=Math.ceil(warp.scrollTop/warp.scrollHeight*warp.clientHeight);
            this.nScrollbarData.thumbHeight=Math.ceil(warp.clientHeight/warp.scrollHeight*warp.clientHeight);
            this.thumbStyle.transform='translateY('+this.nScrollbarData.thumbMoveY+'px)';
            this.thumbStyle.height=this.nScrollbarData.thumbHeight+'px';
            this.nScrollbarData.visible=warp.scrollHeight>warp.clientHeight?true:false;
            if(warp.scrollHeight-warp.scrollTop===warp.clientHeight&&warp.scrollTop!=0){              //outSmoothScroll第一次刷新时orientation有问题，暂时用warp.scrollTop==0来解决
              this.$emit('handleScrollBottom');
            }
          }else if(this.orientation=='horizontal'){
            this.nScrollbarData.thumbMoveX=Math.ceil(warp.scrollLeft/warp.scrollWidth*warp.clientWidth);
            this.nScrollbarData.thumbWidth=Math.ceil(warp.clientWidth/warp.scrollWidth*warp.clientWidth);
            this.thumbStyle.transform='translateX('+ this.nScrollbarData.thumbMoveX+'px)';
            this.thumbStyle.width=this.nScrollbarData.thumbWidth+'px';
            this.nScrollbarData.visible=warp.scrollWidth>warp.clientWidth?true:false;
            if(warp.scrollWidth-warp.scrollLeft===warp.clientWidth){
              this.$emit('handleScrollRight');
            }
          }
        },
        thumbVisible(){
          let warp=this.$el.children[0];
          return warp.scrollHeight>warp.clientHeight?true:false;
        },
        addItem(index,item){
          if(this.flags.isAdding||this.flags.isDeleting){
            return;
          }else if(!this.flags.isAdding){
            this.flags.isAdding=true;
          }
          this.list.splice(index+1,0,item);
          this.$nextTick(()=>{
            let single_keyframe,multi_keyframe;
            if(this.orientation=='vertical'){
              single_keyframe=keyframe.slideLeftIn;
              multi_keyframe=[
                { transform: 'translateY(-100%)' },
                { transform: 'translateY(0)' }
              ]
            }else if(this.orientation=='horizontal'){
              single_keyframe=keyframe.slideDownIn;
              multi_keyframe=[
                { transform: 'translateX(-100%)' },
                { transform: 'translateX(0)' }
              ];
            }
            let addedEL=this.$slots.default[index+1].elm;
            let player=addedEL.animate(single_keyframe, {
              duration: 1000,
              easing: 'linear',
            });
            player.onfinish=()=>{
              this.updateThumb();
              this.flags.isAdding=false;
            }
            let downELs=this.$slots.default;
            downELs.forEach((downEL,mIndex)=>{
              if(mIndex>=index+2){
               downEL.elm.animate(multi_keyframe, {
                  duration: 500,
                  easing: 'linear',
                });
              }
            });
          });
        },
        delItem(index){
          if(this.flags.isDeleting||this.flags.isAdding){
            return;
          }else if(!this.flags.isDeleting){
            this.flags.isDeleting=true;
          }
          let single_keyframe,multi_keyframe;
          if(this.orientation=='vertical'){
            single_keyframe=keyframe.slideLeftOut;
            multi_keyframe=[
              { transform: 'translateY(100%)' },
              { transform: 'translateY(0)' }
            ]
          }else if(this.orientation=='horizontal'){
            single_keyframe=keyframe.slideDownOut;
            multi_keyframe=[
              { transform: 'translateX(100%)' },
              { transform: 'translateX(0)' }
            ];
          }
          let deleteEL=this.$slots.default[index].elm;
          let player=deleteEL.animate(single_keyframe, {
            duration: 500,
            easing: 'linear',
          });
          player.onfinish=()=>{
            let targets=[];
            this.list.splice(index,1);
            let els=this.$slots.default;
            for(let i=index;i<els.length;i++){
              targets.push(els[i].elm);
            }
            let mPlayer="";
            targets.forEach((el)=>{
              mPlayer=el.animate(multi_keyframe, {
                duration: 500,
                easing: 'linear',
              });
            });
            mPlayer.onfinish=()=>{
              this.updateThumb();
              this.flags.isDeleting=false;
            }
          };
        }
      }
    }
</script>
