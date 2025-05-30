import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { PageSummary } from "../../../_types/PageSummary";

export function richTextToMarkdown(
  richTexts: RichTextItemResponse[],
  pagesSummary?: { [id: string]: PageSummary }
) {
  return richTexts.reduce((acc, richText, index) => {
    if (richText.type === "text") {
      let text = richText.text.content;
      if (richText.href) {
        if (richText.href.startsWith("/1") && pagesSummary) {
          const { title, slug } = pagesSummary[richText.href.slice(1)];
          text = `[${text || title}](${slug})`;
        } else text = `[${text}](${richText.href})`;
      }
      if (richText.annotations.bold) text = `**${text}**`;
      if (richText.annotations.italic) text = `*${text}*`;
      if (richText.annotations.strikethrough) text = `~~${text}~~`;
      return acc
        ? `${acc}${
            acc.endsWith(" ") ||
            text.startsWith(" ") ||
            text.startsWith(",") ||
            text.startsWith(".")
              ? ""
              : " "
          }${text}`
        : text;
    } else console.log(richText.type);
    return acc;
  }, "");
}
