<template>
  <div class="cardInfo">
    <div>
      <p>接口数量</p>
      <p>{{ activeUser }}</p>
    </div>
    <div>
      <p>路由数量</p>
      <p>{{ newUser }}</p>
    </div>
    <div>
      <p>状态</p>
      <p>上线</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardInfo',
  props: {
    activeUser: {
      type: [String, Number],
      default: 0
    },
    newUser: {
      type: [String, Number],
      default: 0
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
@import "~@/utils/utils.less";

.cardInfo {

  display: flex;

  .clearfix();

  margin-top: 16px;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 33%;
    text-align: center;

    p {
      display: flex;
      text-align: center;
      justify-content: center;
      margin: 0;
      font-size: 16px;
      line-height: 32px;
    }

    p:first-child {
      color: @text-color-secondary;
      font-size: 13px;
      line-height: 20px;
    }
  }
}
</style>
