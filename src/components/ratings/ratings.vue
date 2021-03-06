<template>
<div class="ratings" ref="ratings">
  <div class="ratings-content">
    <div class="overview">
      <div class="overview-left">
        <div class="score">{{seller.score}}</div>
        <div class="title">综合评分</div>
        <div class="rank">高于周边商家{{seller.rankRate}}%</div>
      </div>
      <div class="overview-right">
        <div class="score-wrapper">
          <span class="title">服务态度</span>
          <star :size="36" :score="seller.serviceScore"></star>
          <span class="score">{{seller.serviceScore}}</span>
        </div>
        <div class="score-wrapper">
          <span class="title">商品评分</span>
          <star :size="36" :score="seller.foodScore"></star>
          <span class="score">{{seller.foodScore}}</span>
        </div>
        <div class="delivery-wrapper">
          <span class="title">送达时间</span>
          <span class="delivery-time">{{seller.deliveryTime}}分钟</span>
        </div>
      </div>
    </div>
    <split></split>
    <ratingselect :selectedType="selectedType" :onlyContent="onlyContent" :desc="desc" :ratings="ratings" @toggleOnlyContent="toggleOnlyContent" @selectRatingType="selectRatingType"></ratingselect>
    <div class="rating-wrapper">
      <ul>
        <li v-for="(rating,index) in ratings" :key="index" class="rating-item border-1px">
          <div class="avatar">
            <img :src="rating.avatar" width="28px" height="28px">
          </div>
          <div class="content">
            <h2 class="name">{{rating.username}}</h2>
            <div class="star-wrapper">
              <star :size="24" :score="rating.score"></star>
              <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
            </div>
            <p class="text">{{rating.text}}</p>
            <div class="recommend" v-show="rating.recommend && rating.recommend.length">
              <i class="icon-thumb_up"></i>
              <span v-for="(item,index) in rating.recommend" :key="index" class="item">{{item}}</span>
            </div>
            <div class="time">{{rating.rateTime | dateTimeFilter}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import star from 'components/star/star'
import ratingselect from 'components/ratingselect/ratingselect'
import split from 'components/split/split'
import { formateDate } from 'common/js/date'

const ERR_OK = 0
const ALL = 2

export default {
  data () {
    return {
      ratings: [],
      selectedType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  methods: {
    selectRatingType(type) {
      this.selectedType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggleOnlyContent() {
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    needShow(type, text) {
      if (this.onlyContent && !text.trim()) {
        return false
      }
      if (this.selectedType === ALL) {
        return true
      } else {
        return this.selectedType === type
      }
    }
  },
  created() {
    this.$http.get('/api/ratings').then((response) => {
      let res = response.body
      if (res.errno === ERR_OK) {
        this.ratings = res.data
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          })
        })
      }
    })
  },
  filters: {
    dateTimeFilter(time) {
      let date = new Date(time)
      return formateDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    star,
    ratingselect,
    split
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"

.ratings
  position: absolute
  top: 174px
  bottom: 0
  width: 100%
  overflow: hidden
  .overview
    display: flex
    padding: 18px
    .overview-left
      padding: 6px 0
      flex: 0 0 117px
      width: 137px
      border-right: 1px solid rgba(7, 17, 27, 0.1)
      text-align: center
      @media only screen and (max-width: 320px)
        flex: 0 0 100px
      .score
        margin-bottom: 6px
        line-height: 28px
        font-size: 24px
        color: rgb(255, 153, 0)
      .title
        margin-bottom: 8px
        line-height: 12px
        font-size: 12px
        color: rgb(7, 17, 27)
      .rank
        font-size: 10px
        line-height: 10px
        color: rgb(147, 153, 159)
    .overview-right
      flex: 1
      padding: 6px 20px 0
      @media only screen and (max-width: 320px)
        padding-left: 6px
        padding-right: 0
      .score-wrapper
        margin-bottom: 8px
        font-size: 0
        .title
          display: inline-block
          vertical-align: top
          font-size: 12px
          line-height: 18px
          color: rgb(7, 17, 27)
        .star
          display: inline-block
          vertical-align: top
          margin: 0 6px
        .score
          display: inline-block
          vertical-align: top
          font-size: 12px
          line-height: 18px
          color: rgb(255, 153, 0)
      .delivery-wrapper
        font-size: 0
        .title
          font-size: 12px
          line-height: 18px
          color: rgb(7, 17, 27)
        .delivery-time
          margin-left: 12px
          font-size: 12px
          line-height: 18px
          color: rgb(147, 153, 159)
  .rating-wrapper
    padding: 0 18px
    .rating-item
      display: flex
      padding: 18px 0
      border-1px(rgba(7, 17, 27, 0.1))
      .avatar
        flex: 0 0 28px
        width: 28px
        margin-right: 12px
        img
          border-radius: 50%
      .content
        position: relative
        flex: 1
        .name
          line-height: 12px
          font-size: 10px
          color: rgb(7, 17, 27)
        .star-wrapper
          margin-bottom: 6px
          font-size: 0
          .star
            margin-right: 6px
            display: inline-block
            vertical-align: top
          .delivery
            display: inline-block
            vertical-align: top
            font-size: 10px
            line-height: 12px
            color: rgb(147, 153, 159)

        .text
          margin-bottom: 8px
          line-height: 18px
          color: rgb(7, 17, 27)
          font-size: 12px
        .recommend
          line-height: 16px
          font-size: 0
          .icon-thumb_up, .item
            display: inline-block
            margin: 0 8px 4px 0
            font-size: 9px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .item
            padding: 0 6px
            border: 1px solid rgba(7, 17, 27, 0.1)
            border-radius: 1px
            color: rgb(147, 153, 159)
            background-color: #fff
        .time
          position: absolute
          top: 0
          right: 0
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
</style>
