<template>
<div class="seller" ref="seller">
  <div class="seller-content">
    <div class="overview">
      <h2 class="title">{{seller.name}}</h2>
      <div class="desc border-1px">
        <star :size="36" :score="seller.score"></star>
        <span class="text">({{seller.ratingCount}})</span>
        <span class="text">月售{{seller.sellCount}}单</span>
      </div>
      <ul class="remark">
        <li class="block">
          <h3>起送价</h3>
          <div class="content">
            <span class="stress">{{seller.minPrice}}</span>元
          </div>
        </li>
        <li class="block">
          <h3>商家配送</h3>
          <div class="content">
            <span class="stress">{{seller.deliveryTime}}</span>元
          </div>
        </li>
        <li class="block">
          <h3>平均配送时间</h3>
          <div class="content">
            <span class="stress">{{seller.deliveryTime}}</span>分钟
          </div>
        </li>
      </ul>
      <div class="favorite" @click="toggleFavorite">
        <i class="icon-favorite" :class="{active:favorite}"></i>
        <span class="text">{{favoriteText}}</span>
      </div>
    </div>
    <split></split>
    <div class="bulletin">
      <h2 class="title">公告与活动</h2>
      <div class="content-wrapper border-1px">
        <p class="content">{{seller.bulletin}}</p>
      </div>
      <ul v-if="seller.supports" class="supports">
        <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
          <span class="icon" :class="classMap[seller.supports[index].type]"></span>
          <span class="text">{{seller.supports[index].description}}</span>
        </li>
      </ul>
    </div>
    <split></split>
    <div class="pics">
      <h2 class="title">商家实景</h2>
      <div class="pic-wrapper" ref="picWrapper">
        <ul class="pic-list" ref="picList">
          <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
            <img :src="pic" width="120px" height="90">
          </li>
        </ul>
      </div>
    </div>
    <split></split>
    <div class="info">
      <h2 class="title border-1px">商家信息</h2>
      <ul>
        <li class="info-item" v-for="(info,index) in seller.infos" :key="index">{{info}}</li>
      </ul>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import star from 'components/star/star'
import split from 'components/split/split'
import { saveToLocal, loadFromLocal } from 'common/js/store'

export default {
  data() {
    return {
      favorite: (() => { return loadFromLocal(this.seller.id, 'favorate', false) })()
    }
  },
  props: {
    seller: {
     type: Object
    }
  },
  computed: {
    favoriteText() {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  methods: {
    toggleFavorite(event) {
      if (!event._constructed) {
        return
      }
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, 'favorate', this.favorite)
    },
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },
    _initPics() {
      if (this.seller.pics) {
        let picWidth = 120
        let margin = 6
        let width = (picWidth + margin) * this.seller.pics.length - margin
        this.$refs.picList.style.width = width + 'px'
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrough: 'vertical'
            })
          } else {
            this.picScroll.refresh()
          }
        })
      }
    }
  },
  watch: {
    seller() {
      this.$nextTick(() => {
        this._initScroll()
        this._initPics()
      })
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  mounted: function () {
    this.$nextTick(() => {
      this._initScroll()
      this._initPics()
    })
  },
  components: {
    star,
    split
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"

.seller
  position: absolute
  top: 174px
  bottom: 0
  left: 0
  width: 100%
  overflow: hidden
  .overview
    padding: 18px
    position: relative
    .title
      margin-bottom: 8px
      line-height: 14px
      color: rgb(7, 17, 27)
    .desc
      padding-bottom: 18px
      font-size: 0
      border-1px(rgba(7, 17, 27, 0.1))
      .star
        margin-right: 8px
        display: inline-block
        vertical-align: top
      .text
        margin-right: 12px
        display: inline-block
        vertical-align: top
        font-size: 10px
        line-height: 18px
        color: rgb(77, 85, 93)
    .remark
      display: flex
      padding-top: 18px
      .block
        flex: 1
        text-align: center
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        &:last-child
          border: none
        h3
          margin-bottom: 4px
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .content
          line-height: 24px
          font-size: 10px
          color: rgb(7, 17, 27)
          .stress
            font-size: 20px
  .favorite
    position: absolute
    right: 11px
    top: 18px
    width: 50px
    text-align: center
    .icon-favorite
      margin-bottom: 4px
      display: block
      color: #d4d9d6
      font-size: 24px
      line-height: 24px
      &.active
        color: rgb(240, 20, 20)
    .text
      font-size: 10px
      line-height: 10px
      color: rgb(77, 85, 93)
  .bulletin
    padding: 18px 18px 0
    .title
      margin-bottom: 8px
      line-height: 14px
      color: rgb(7, 17, 27)
    .content-wrapper
      padding: 0 12px 16px 12px
      border-1px(rgba(7, 17, 27, 0.1))
      .content
        line-height: 24px
        font-size: 12px
        color: rgb(240, 20, 20)
    .supports
      .support-item
        padding: 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        .icon
          display: inline-block
          width: 16px
          height: 16px
          vertical-align: middle
          margin-right: 6px
          background-size: 16px 16px
          background-repeat: no-repeat
          &.decrease
             bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
  .pics
    padding: 18px
    .title
      margin-bottom: 12px
      line-height: 14px
      color: rgb(7, 17, 27)
    .pic-wrapper
      width: 100%
      overflow: hidden
      white-space: nowrap
      font-size: 0
      .pic-item
        display: inline-block
        margin-right: 6px
        width: 120px
        height: 90px
        &:last-child
          margin: 0
  .info
    padding: 18px 18px 0
    color: rgb(7, 17, 27)
    .title
      padding-bottom: 12px
      line-height: 14px
      border-1px(rgba(7, 17, 27, 0.1))
    .info-item
      padding: 16px 12px
      font-size: 12px
      line-height: 16px
      border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
</style>
