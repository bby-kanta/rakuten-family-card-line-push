export class RakutenMailGetter {
  public getByDate(date: Date): GoogleAppsScript.Gmail.GmailMessage[] {
    // 翌日の日付を取得する
    const nextDateObj = new Date(date);
    nextDateObj.setDate(nextDateObj.getDate() + 1);
  
    // 引数の日付と翌日の日付を YYYY/MM/DD 形式で取得
    const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    const nextDate = `${nextDateObj.getFullYear()}/${String(nextDateObj.getMonth() + 1).padStart(2, '0')}/${String(nextDateObj.getDate()).padStart(2, '0')}`;
  
    Logger.log(`formattedDate: ${formattedDate}`);
    Logger.log(`nextDate: ${nextDate}`);
  
    // メールの検索クエリを作成（特定の日付に基づく検索）
    const query = `subject:"カード利用のお知らせ(本人・家族会員ご利用分)" after:${formattedDate} before:${nextDate} -:"速報版"`;
    const threads = GmailApp.search(query);
  
    // メールメッセージのリストを取得
    const messages: GoogleAppsScript.Gmail.GmailMessage[] = [];
    for (const thread of threads) {
      const threadMessages = thread.getMessages();
      messages.push(...threadMessages);
    }
  
    return messages;
  }
};