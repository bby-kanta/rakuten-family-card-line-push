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

/**
 * 支払い月が指定した月である決済情報を抽出する
 * @param {string} yearMonth - 抽出する月（yyyy/MM形式）
 * @returns {PaymentInfoList} - 抽出した決済情報
 */
  extractByPaymentMonth(yearMonth: string): PaymentInfoList {
    return new PaymentInfoList(this.paymentInfoList.filter(info => info.paymentMonth === yearMonth));
  }

/**
 * 支払月で並び替える
 * @param {string} order - "asc" or "desc"
 * @returns {PaymentInfoList} - 並び替えた決済情報
 */
  sortByDate(order: "asc" | "desc"): PaymentInfoList {
    return new PaymentInfoList(this.paymentInfoList.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (order === "asc") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    }));
  }

  // 合計金額を計算する
  calcTotalAmount(): number {
    return this.paymentInfoList.reduce((sum, info) => sum + info.amount, 0);
  }
}
