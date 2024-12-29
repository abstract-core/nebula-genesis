import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export function richTextToMarkdown(richTexts: RichTextItemResponse[]) {
  return richTexts
    .map((richText) => {
      if (richText.type === "text") {
        let text = richText.text.content;
        if (richText.annotations.bold) text = "**" + text + "**";
        if (richText.annotations.italic) text = "*" + text + "*";
        if (richText.annotations.strikethrough) text = "~~" + text + "~~";
        return text;
      }
    })
    .join(" ");
}
