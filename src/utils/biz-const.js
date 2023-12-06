// 商品


// 交易

export const DICT_ORDER_STATUS_WAIT_PAY = 1;
export const DICT_ORDER_STATUS_WAIT_DELIVER = 2;
export const DICT_ORDER_STATUS_WAIT_RECEIVE = 3;
export const DICT_ORDER_STATUS_WAIT_EVALUATE = 4;
export const DICT_ORDER_STATUS_COMPLETED = 10;

export const DICT_ORDER_STATUS = {
  [DICT_ORDER_STATUS_WAIT_PAY]: "待支付",
  [DICT_ORDER_STATUS_WAIT_DELIVER]: "待发货",
  [DICT_ORDER_STATUS_WAIT_RECEIVE]: "待收货",
  [DICT_ORDER_STATUS_WAIT_EVALUATE]: "待评价",
  [DICT_ORDER_STATUS_COMPLETED]: "已完成"
}

export const DICT_ORDER_CHANNEL = {
  1: "PC",
  2: "APP",
  3: "小程序"
}

export const DICT_PAY_TYPE = {
  '1': "微信支付",
  '2': "支付宝",
}

export const DICT_PAY_STATUS = {
  1: "未支付",
  2: "支付中",
  3: "支付成功",
  4: "支付失败"
}

export function translateOrderStatus(value) {
  return DICT_ORDER_STATUS[value]
}

export function translateOrderChannel(value) {
  return DICT_ORDER_CHANNEL[value]
}

export function translatePayType(value) {
  return DICT_PAY_TYPE[value]
}

export function translatePayStatus(value) {
  return DICT_PAY_STATUS[value]
}