/**
 * Flexメッセージのボックスコンテンツを表します。
 */
export class BoxContent {
  type: string; // 常に "box"
  layout: string;
  backgroundColor?: string;
  margin?: string;
  justifyContent?: string;
  contents: any[];

  constructor({ layout, backgroundColor, margin, justifyContent }: 
    { layout: string, backgroundColor?: string, margin?: string, justifyContent?: string }) {
    this.type = "box"; // 固定で "box"
    this.layout = layout;
    this.backgroundColor = backgroundColor;
    this.margin = margin;
    this.justifyContent = justifyContent;
    this.contents = [];
  }

  addContent(content: any) {
    this.contents.push(content);
  }
}

/**
 * Flexメッセージのテキストコンテンツを表します。
 */
export class TextContent {
  type: string; // 常に "text"
  text: string;
  align?: string;
  color?: string;
  weight?: string;
  size?: string;
  flex?: number;
  margin?: string;

  constructor({ text, align, color, weight, size, flex, margin }:
    { text: string, align?: string, color?: string, weight?: string, size?: string, flex?: number, margin?: string }) {
    this.type = "text"; // 固定で "text"
    this.text = text;
    this.align = align;
    this.color = color;
    this.weight = weight;
    this.size = size;
    this.flex = flex;
    this.margin = margin;
  }
}

/**
 * Flexメッセージのセパレーターを表します。
 */
export class Separator {
  type: string; // 常に "separator"
  margin?: string;

  constructor(margin?: string) {
    this.type = "separator"; // 固定で "separator"
    this.margin = margin;
  }
}
