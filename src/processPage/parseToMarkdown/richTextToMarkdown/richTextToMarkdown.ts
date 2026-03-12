import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { PageSummary } from "../../../_types/PageSummary";

function trimTrailingSpace(text: string) {
  return text.endsWith(" ") ? text.slice(0, -1) : text;
}

export function richTextToMarkdown(
  richTexts: RichTextItemResponse[],
  pagesSummary?: { [id: string]: PageSummary }
) {
  return richTexts.reduce((acc, richText, index) => {
    if (richText.type === "text") {
      let text = richText.text.content;
      if (richText.href) {
        if (richText.href.length === 33 && !richText.href.includes(".")) {
          if (pagesSummary?.[richText.href.slice(1)]) {
            const { title, slug } = pagesSummary[richText.href.slice(1)];
            text = `[${text || title}](${slug})`;
          }
        } else text = `[${text}](${richText.href})`;
      }
      if (richText.annotations.bold) text = `**${trimTrailingSpace(text)}**`;
      if (richText.annotations.italic) text = `*${trimTrailingSpace(text)}*`;
      if (richText.annotations.strikethrough) text = `~~${trimTrailingSpace(text)}~~`;
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
    } else if (
      richText.type === "mention" &&
      richText.mention.type === "page"
    ) {
      const page = pagesSummary?.[richText.mention.page.id.replaceAll("-", "")];
      if (page) {
        const { title, slug } = page;
        return `${acc || ""}[${title}](${slug})`;
      } else console.log(richText.mention.page.id, richText.href);
    } else console.log(richText.type);
    return acc;
  }, "");
}
