export class PaymentInfo {
  date: string;
  store: string;
  user: string;
  amount: number;
  paymentMonth: string;

  constructor(date: string, store: string, user: string, amount: number, paymentMonth: string) {
    this.date = date;
    this.store = store;
    this.user = user;
    this.amount = amount;
    this.paymentMonth = paymentMonth;
  }
}

export class PaymentInfoList {
  paymentInfoList: PaymentInfo[];

  constructor(paymentInfoList: PaymentInfo[]) {
    this.paymentInfoList = paymentInfoList;
  }

  all(): PaymentInfo[] {
    return this.paymentInfoList;
  }

  // 指定した利用者毎に決済情報をフィルタリングする
  extractPerUser(userType: "本人" | "家族"): PaymentInfoList {
    return new PaymentInfoList(this.paymentInfoList.filter(info => 
      (userType === "本人" && info.user === "本人") || 
      (userType === "家族" && info.user !== "本人")
    ));
  }

  // 合計金額を計算する
  calcTotalAmount(): number {
    return this.paymentInfoList.reduce((sum, info) => sum + info.amount, 0);
  }
}
