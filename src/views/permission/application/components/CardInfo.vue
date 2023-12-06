<template>
  <div class="cardInfo">
    <div>
      <p>接口数量</p>
      <p>{{ apiCount }}</p>
    </div>
    <div>
      <p>路由数量</p>
      <p>{{ routeCount }}</p>
    </div>
    <div>
      <p>状态</p>
      <p>{{getStatusDesc(status)}}</p>
    </div>
  </div>
</template>


<script>
const statusOptions = {
  1: '已上线',
  2: '已下线',
}

export default {
  name: 'CardInfo',
  props: {
    apiCount: {
      type: [Number],
      default: 0
    },
    status: {
      type: [Number],
      required: true
    },
    routeCount: {
      type: [Number],
      default: 0
    }
  },
  methods: {
    getStatusDesc(value) {
      return statusOptions[value]
    }
  },
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
    justify-content: flex-start;
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
