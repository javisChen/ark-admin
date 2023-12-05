import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
import accounting from "accounting";
import {fenToYuan, yuanToFen} from "@/utils/util";


import {
  DICT_ORDER_CHANNEL,
  DICT_ORDER_STATUS,
  DICT_PAY_STATUS,
  DICT_PAY_TYPE
} from "@/utils/biz-const";

moment.locale('zh-cn')


Vue.filter('SumFormat', function (value) {
  //console.log(value)
  if (!value) return '0.00';
  var intPart = Number(value) | 0; //获取整数部分
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分每三位加一个逗号
  var floatPart = ".00"; //预定义小数部分
  if (typeof value !== 'string') {
    value = value.toString();
  }
  var value2Array = value.split(".");

  //=2表示数据有小数位
  if (value2Array.length === 2) {
    floatPart = value2Array[1].toString(); //拿到小数部分
    if (floatPart.length > 2) { //若小数位数在两位以上，则四舍五入保留两位小数
      return parseFloat(value).toFixed(2);
    } else if (floatPart.length === 1) { //若小数位数只有一位，补0
      return intPartFormat + "." + floatPart + '0';
    } else {
      return intPartFormat + "." + floatPart;
    }

  } else {  //数据为整数
    return intPartFormat + floatPart;
  }
})

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0.00'
  }
  // 截取当前数据到小数点后两位
  return parseFloat(value).toFixed(2)
})

Vue.filter('YuanToFen', function (value) {
  if (!value) {
    return '0.00'
  }
  let number = (value - 0) * 100;
  return parseFloat('' + number).toFixed(2)
})

Vue.filter('FenToYuan', function (value) {
  if (!value) {
    return '0.00'
  }
  let number = (value - 0) / 100;
  return parseFloat('' + number).toFixed(2)
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('translateOrderStatus', function (value) {
  return DICT_ORDER_STATUS[value]
})


Vue.filter('translateOrderChannel', function (value) {
  return DICT_ORDER_CHANNEL[value]
})


Vue.filter('translatePayType', function (value) {
  return DICT_PAY_TYPE[value]
})


Vue.filter('translatePayStatus', function (value) {
  return DICT_PAY_STATUS[value]
})

Vue.filter('formatShowPrice', function (value) {
  return accounting.format(fenToYuan(value))
})

