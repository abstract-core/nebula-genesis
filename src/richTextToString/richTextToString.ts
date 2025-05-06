import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export function richTextToString(richTexts: RichTextItemResponse[]) {
  return richTexts.map(({ plain_text }) => plain_text).join(" ");
}
