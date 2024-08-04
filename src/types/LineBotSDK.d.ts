declare namespace LineBotSDK {
  class Client {
    constructor(options: { channelAccessToken: string });
    pushMessage(to: string, messages: any): void;
  }
}
