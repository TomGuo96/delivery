<template>
<div class="goods">
  <div class="menu-wrapper" ref="menuWrapper">
    <ul>
      <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)" ref="menuList">
        <span class="text border-1px"><span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span>
      </li>
    </ul>
  </div>
  <div class="foods-wrapper" ref="foodsWrapper">
    <ul>
      <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
        <h2 class="title">{{item.name}}</h2>
        <ul>
          <li v-for="(food,idx) in item.foods" :key="idx" class="food-item border-1px">
            <div class="icon">
              <img :src="food.icon" width="57px" height="57px">
            </div>
            <div class="content">
              <h3 class="name" @click="selectFood(food,$event)">{{food.name}}</h3>
              <p class="desc">{{food.description}}</p>
              <div class="extra">
                <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}</span>
              </div>
              <div class="price">
                <span class="now">¥{{food.price}}</span>
                <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food" @add="addFood"></cartcontrol>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <cart ref="cart" :selectedFoods="selectedFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></cart>
  <food :food="selectedFood" ref="food" @add="addFood"></food>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import cart from 'components/cart/cart'
import food from 'components/food/food'
import cartcontrol from 'components/cartcontrol/cartcontrol'
const ERR_OK = 0

export default {
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let h1 = this.listHeight[i]
        let h2 = this.listHeight[i + 1]
        if (!h2 || (this.scrollY >= h1 && this.scrollY < h2)) {
          this._followScroll(i)
          return i
        }
      }
      return 0
    },
    selectedFoods() {
      let foods = []
      for (let good of this.goods) {
        for (let food of good.foods) {
          if (food.count > 0) {
            foods.push(food)
          }
        }
      }
      return foods
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('/api/goods').then((response) => {
      let res = response.body
      if (res.errno === ERR_OK) {
        this.goods = res.data
        this.$nextTick(() => {
          this._initScroll()
          this._calcHeight()
        })
      }
    })
  },
  methods: {
    // 响应menuList的点击
    selectMenu(index, event) {
      if (!event._constructed) {
        return
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
    },
    selectFood(food, event) {
      this.selectedFood = food
      this.$refs.food.show()
    },
    // 初始化两侧的滚动区域
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      })
      // 监听右侧foodList的滚动
      this.foodsScroll.on('scroll', (pos) => {
        if (pos.y <= 0) {
          this.scrollY = Math.abs(Math.round(pos.y))
        }
      })
    },
    // 计算foodList区域的每个区块的高度
    _calcHeight() {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight = []
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    _followScroll(index) {
      let menuList = this.$refs.menuList
      let el = menuList[index]
      this.menuScroll.scrollToElement(el, 300, 0, true)
    },
    addFood(target) {
      this._drop(target)
    },
    _drop(target) {
      // 异步执行下落动画
      this.$nextTick(() => {
        this.$refs.cart.drop(target)
      })
    }
  },
  components: {
    cart,
    cartcontrol,
    food
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"

.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .test
    position: fixed;
    left: 0
    top: 0
    widtH: 100px
    height: 100px
    color: #000
    font-size: 50px
    z-index: 1000
    background-color: red
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background-color: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 100%
      line-height: 14px
      &.current
        position: relative
        margin-top: -1px
        z-index: 10
        background-color: #fff
        font-weight: 700
      .text
        border-none()
      .icon
        display: inline-block
        vertical-align: top
        width: 12px
        height: 12px
        margin-right: 2px
        background-size: 12px
        background-repeat: no-repeat
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
      .text
        display: table-cell
        padding: 0 7px
        width: 56px
        text-align: center
        vertical-align: middle
        font-size: 12px
        border-1px(rgba(7, 17, 27, 0.1))
  .foods-wrapper
    flex: 1
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background-color: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          font-size: 12px
          color: rgb(7, 17, 27)
        .desc, .extra
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .desc
          margin-bottom: 8px
          line-height: 12px
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 0px
</style>
