<template>
  <div class="common-card">
    <div class="title">{{title}}</div>
    <div class="value">{{value}}</div>
    <div class="chart">
      <slot></slot>
    </div>
    <div class="line" />
    <div class="total">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: String,
      value: [String, Number]
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    font-size: 12px;
    color: #999;
  }
  .value {
    font-size: 25px;
    color: #000;
    margin-top: 5px;
    // 指定文字间的间距
    letter-spacing: 1px;
  }
  .chart {
    height: 50px;
  }
  .line {
    // 实现一条线条
    margin: 10px 0;
    border-top: 1px solid #eee;
  }
  .total {
    font-size: 12px;
    color: #666;
  }
</style>

<!-- 新建一个style，这里没有声明scoped，所以可以共享给子组件 -->
<style lang="scss">
  .emphasis {
    margin-left: 5px;
    color: #333;
    font-weight: 700;
  }
  // 编写三角形其实是用 border 来实现的
  .increase {
    width: 0;
    height: 0;
    border-width: 3px;
    border-color: transparent transparent red transparent;
    border-style: solid;
    // 将三角形往上移动调整
    margin: 0 0 3px 5px;
  }
  .decrease {
    width: 0;
    height: 0;
    border-width: 3px;
    border-color: green transparent transparent transparent;
    border-style: solid;
    // 将三角形往下移动调整
    margin: 3px 0 0 5px;
  }
</style>
