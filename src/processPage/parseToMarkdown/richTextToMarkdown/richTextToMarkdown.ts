import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { PageSummary } from "../../../_types/PageSummary";

export function richTextToMarkdown(
  richTexts: RichTextItemResponse[],
  pagesSummary?: { [id: string]: PageSummary }
) {
  return richTexts
    .map((richText) => {
      if (richText.type === "text") {
        let text = richText.text.content;
        if (richText.href) {
          if (richText.href.startsWith("/1") && pagesSummary) {
            const { title, slug } = pagesSummary[richText.href.slice(1)];
            text = `[${title}](${slug})`;
          } else text = `[${text}](${richText.href})`;
        }
        if (richText.annotations.bold) text = "**" + text + "**";
        if (richText.annotations.italic) text = "*" + text + "*";
        if (richText.annotations.strikethrough) text = "~~" + text + "~~";
        return text;
      } else console.log(richText.type); /* 
      if (richText.type === "mention") { */
    })
    .join(" ");
}
