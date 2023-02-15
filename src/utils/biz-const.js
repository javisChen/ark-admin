export const DICT_ORDER_STATUS = {
  1: "待支付",
  2: "待发货",
  3: "待收货",
  4: "交易成功"
}

export const DICT_ORDER_CHANNEL = {
  1: "待支付",
  2: "待发货",
  3: "待收货",
  4: "交易成功"
}

export function translate(key, value) {
  return key[value]
}