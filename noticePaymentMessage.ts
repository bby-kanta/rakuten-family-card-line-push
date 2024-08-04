import { PaymentInfo, PaymentInfoList } from "./paymentInfo";
import { BoxContent, TextContent, Separator } from "./lineMessage.ts";

const DISPLAY_HIMSELF = PropertiesService.getScriptProperties().getProperty("DISPLAY_HIMSELF");
const DISPLAY_FAMILY = PropertiesService.getScriptProperties().getProperty("DISPLAY_FAMILY");

export class NoticePaymentHistoryMessage {
  type: string;
  header: BoxContent | undefined;
  body: BoxContent | undefined;

  constructor(paymentInfoList: PaymentInfoList, headerText?: string) {
    this.type = "bubble";
    this.header = this.getHeader(headerText);
    this.body = this.getBody(paymentInfoList);
  }

  private getHeader(headerText?: string): BoxContent | undefined {
    const header = new BoxContent({ layout: "vertical" });

    const mainHeaderContent = new TextContent({
      text: "家族カード利用のお知らせ",
      align: "center",
      color: "#800000",
      weight: "bold",
      size: "xl",
    });
    header.addContent(mainHeaderContent);

    if (headerText) {
      const subHeaderContent = new TextContent({
        text: headerText,
        align: "center",
        color: "#000000",
        size: "md",
        margin: "sm",
      });
      header.addContent(subHeaderContent);
    }

    return header;
  }

  private getBody(paymentInfoList: PaymentInfoList): BoxContent | undefined {
    const bodyContent = new BoxContent({ layout: "vertical" });
    const himselfPaymentContent = this.createPaymentHistoryMessage(paymentInfoList, "本人");
    const familyPaymentContent = this.createPaymentHistoryMessage(paymentInfoList, "家族");
    const allTotalAmountContent = this.createTotalAmountRecord(paymentInfoList, true);

    if (himselfPaymentContent) bodyContent.addContent(himselfPaymentContent);
    if (familyPaymentContent) bodyContent.addContent(familyPaymentContent);
    if (allTotalAmountContent) bodyContent.addContent(allTotalAmountContent);

    return bodyContent;
  }

  private createPaymentHistoryMessage(paymentInfoList: PaymentInfoList, userType: "本人" | "家族"): BoxContent | undefined {
    const paymentList = paymentInfoList.extractPerUser(userType);
    if (paymentList.all().length === 0) return undefined;

    const paymentContent = new BoxContent({ layout: "vertical" });
    const subjectContent = this.createSubjectMessage(userType);
    const paymentRecordsContent = this.createPaymentMessage(paymentList);

    paymentContent.addContent(subjectContent);
    paymentContent.addContent(paymentRecordsContent);

    return paymentContent;
  }

  private createSubjectMessage(userType: "本人" | "家族"): BoxContent {
    const displayHimself = DISPLAY_HIMSELF || "本人";
    const displayFamily = DISPLAY_FAMILY || "家族";
    const text = userType === "本人" ? `利用者: ${displayHimself}` : `利用者: ${displayFamily}`;

    const subjectContent = new BoxContent({ layout: "vertical" });
    const subject = new TextContent({ text, weight: "bold" });
    subjectContent.addContent(subject);
    subjectContent.addContent(new Separator("sm"));

    return subjectContent;
  }

  private createPaymentMessage(paymentInfoList: PaymentInfoList): BoxContent {
    const paymentRecordsContent = new BoxContent({ layout: "vertical" });
    let lastDate = "";

    for (const paymentInfo of paymentInfoList.all()) {
      if (paymentInfo.date !== lastDate) {
        // 日付が異なる場合、新しい日付を追加
        paymentRecordsContent.addContent(this.createDateText(paymentInfo.date));
        lastDate = paymentInfo.date;
      }
      paymentRecordsContent.addContent(this.createPaymentMessageRecord(paymentInfo));
    }
    return paymentRecordsContent;
  }

  private createDateText(date: string): BoxContent {
    const dateBox = new BoxContent({ layout: "vertical", margin: "sm" });
    dateBox.addContent(new TextContent({ text: date, weight: "bold", size: "md", color: "#333333" }));
    dateBox.addContent(new Separator("xs"));
    return dateBox;
  }

  private createPaymentMessageRecord(paymentInfo: PaymentInfo): BoxContent {
    const paymentRecordContent = new BoxContent({ layout: "horizontal", margin: "xs", justifyContent: "flex-start" });
    paymentRecordContent.addContent(new TextContent({ text: paymentInfo.store, flex: 4 }));
    paymentRecordContent.addContent(new TextContent({ text: paymentInfo.amount.toString() + "円", align: "end", flex: 2 }));
    return paymentRecordContent;
  }

  private createTotalAmountRecord(paymentInfoList: PaymentInfoList, isAll: boolean = false): BoxContent | undefined {
    const totalAmount = paymentInfoList.calcTotalAmount();
    if (totalAmount === 0) return undefined;

    const totalAmountRecordContent = new BoxContent({
      layout: "horizontal",
      margin: "sm",
      justifyContent: "flex-start",
    });

    const subjectText = isAll ? "合計" : "計";
    const totalSubject = new TextContent({ text: subjectText, align: "end", flex: 4 });
    const totalAmountContent = new TextContent({ text: `${totalAmount.toLocaleString()} 円`, align: "end", flex: 2 });

    totalAmountRecordContent.addContent(totalSubject);
    totalAmountRecordContent.addContent(totalAmountContent);

    return totalAmountRecordContent;
  }
}
