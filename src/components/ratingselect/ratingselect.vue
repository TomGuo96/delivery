<template>
<div class="ratingselect">
  <div class="rating-type border-1px">
    <span @click="select(2,$event)" class="block positive" :class="{active:type===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
    <span @click="select(0,$event)" class="block positive" :class="{active:type===0}">{{desc.positive}}<span class="count">{{posCount}}</span></span>
    <span @click="select(1,$event)" class="block negative" :class="{active:type===1}">{{desc.negative}}<span class="count">{{negCount}}</span></span>
  </div>
  <div class="switch" :class="{on:only}" @click="toggleContent">
    <i class="icon-check_circle"></i>
    <span class="text">只看有内容的评价</span>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
  data() {
    return {
      type: this.selectedType,
      only: this.onlyContent
    }
  },
  props: {
    ratings: {
      type: Array,
      default() {
        return []
      }
    },
    selectedType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  computed: {
    posCount() {
      return this.ratings.filter((rating) => { return rating.rateType === POSITIVE }).length
    },
    negCount() {
      return this.ratings.filter((rating) => { return rating.rateType === NEGATIVE }).length
    }
  },
  methods: {
    select(type, event) {
      if (!event._constructed) {
        return
      }
      this.type = type
      this.$emit('selectRatingType', type)
    },
    toggleContent() {
      if (!event._constructed) {
        return
      }
      this.only = !this.only
      this.$emit('toggleOnlyContent')
    },
    reset() {
      this.type = this.selectedType
      this.only = this.onlyContent
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'

.ratingselect
  .rating-type
    padding: 18px 0
    margin: 0 18px
    border-1px(rgba(7, 17, 27, 0.1))
    font-size: 0
    .block
      display: inline-block
      padding: 8px 12px
      margin-right: 8px
      border-radius: 1px
      font-size: 12px
      line-height: 16px
      color: rgb(77, 85, 93)
      &.active
        color: #fff
      .count
        font-size: 8px
        margin-left: 2px
      &.positive
        background-color: rgba(0, 160, 220, 0.2)
        &.active
          background-color: rgb(0, 160, 220)
      &.negative
        background-color: rgba(77, 85, 93, 0.2)
        &.active
          background-color: rgb(77, 85, 93)
  .switch
    padding: 12px 18px
    line-height: 24px
    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    color: rgb(147, 153, 159)
    &.on
      .icon-check_circle
        color: #00b43c
    .icon-check_circle
      display: inline-block
      vertical-align: top
      margin-right: 4px
      font-size: 24px
    .text
      display: inline-block
      vertical-align: top
      font-size: 12px
</style>
