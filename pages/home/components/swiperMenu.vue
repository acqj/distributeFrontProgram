<template>
  <view style="width: 100%;">
    <swiper :indicator-dots="isShowDot && showDot" class="swiper" :style="{height:(180*col)+'rpx'}">
      <swiper-item v-for="(item, index) in listdivInfo" :key="index" class="swiper-item">
        <view v-for="(child, code) in item" class="smallItem" :key="code" :style="{ width: width + '%;' }" @click="gotoGoodsListPage(child.id, child.channelName)">
			<!-- <div class="flexColAllWidthCls" style="background-color: #FFEDEF;border-radius: 10rpx;">
				<div style="color:#3d3d3d;margin: 10rpx 0;">
					{{ child.channelName }}
				</div>
				<div style="margin:10rpx;">
					<image :src="child.fileUrl" style="width: 64rpx;height: 64rpx;">
					</image>
				</div>
			</div> -->
          <view class="image">
            <image :src="child.fileUrl" style="width: 80rpx;height: 80rpx;">
            </image>
          </view>
          <view class="name">{{ child.channelName }}</view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>
<script>
export default {
  props: {
    channelList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //一行排列数
    nums: {
      type: Number,
      default: 3,
    },

    //排列行数
    col: {
      type: Number,
      default: 1,
    },
    //是否展示指示灯
    isShowDot: {
      type: Boolean,
      default: true,
    },
  },

  watch: {
    channelList: {
      handler: function (newVal, oldVal) {
        this.listdiv();
      },
      deep: true,
    },
  },

  mounted() {
    this.listdiv();
  },
  data() {
    return {
      listdivInfo: [],
      width: 25,
      showDot: true,
    };
  },
  methods: {
    async listdiv() {
      this.width = 100 / this.nums;
      var arr = [];
      let that = this;
      console.log(that.nums * that.col);
      await this.channelList.forEach((v, index) => {
        var num = Math.floor(index / (that.nums * that.col));
        if (!arr[num]) {
          arr[num] = [];
          arr[num].push(v);
        } else {
          arr[num].push(v);
        }
      });
      this.listdivInfo = arr;
      if (this.listdivInfo.length > 1) {
        this.showDot = true;
      } else {
        this.showDot = false;
      }
    },
	gotoGoodsListPage(channelId, channelName){
		console.log('===============================');
		console.log(channelId);
		uni.navigateTo({
			url: '/pages/goods_list/index?channelId=' + channelId + '&channelName=' + channelName
		})
	}
  },
};
</script>

<style lang="scss" scoped>
.swiper {
  // margin: 8rpx 32rpx;
  background: white;
  border-radius: 32rpx;
}

.swiper-item {
  display: flex;
  // justify-content: center;
  // align-items: center;
  flex-wrap: wrap;

  .smallItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 16rpx 0;
    overflow: hidden;

    image {
      width: 80rpx;
      height: 80rpx;
    }

    .name {
	  color: #3d3d3d;
	  font-weight: bold;
      margin-top: 8rpx;
      font-size: 24rpx;
    }
  }
}
</style>