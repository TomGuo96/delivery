<template>
<div class="cartcontrol">
  <transition name="fade">
    <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click="decreaseCart">
    </div>
  </transition>
  <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
  <div class="cart-increase icon-add_circle" @click="addCart"></div>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart(event) {
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        this.$set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.$emit('add', event.target)
    },
    decreaseCart() {
      if (!event._constructed) {
        return
      }
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
   font-size: 0
  .cart-decrease, .cart-increase
    display: inline-block
    vertical-align: top
    font-size: 24px
    line-height: 24px
    padding: 6px
    color: rgb(0, 160, 220)
  .cart-decrease
    opacity: 1
    &.fade-enter-active, &.fade-leave-active
      transition: all 1s
    &.fade-enter, &.fade-leave-to
      opacity: 0
      transform: translateX(15px) rotate(180deg)
  .cart-count
    display: inline-block
    vertical-align: top
    text-align: center
    padding-top: 11px
    width: 12px
    font-size: 10px
    color: rgb(147, 153, 159)
</style>
