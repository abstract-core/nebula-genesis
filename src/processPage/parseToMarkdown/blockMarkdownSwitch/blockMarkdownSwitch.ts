import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { richTextToMarkdown } from "../richTextToMarkdown/richTextToMarkdown";
import { PageSummary } from "../../../_types/PageSummary";

export function blockMarkdownSwitch(block: BlockObjectResponse, pagesSummary: { [id: string]: PageSummary }) {
  if (block.type === "paragraph")
    return richTextToMarkdown(block.paragraph.rich_text, pagesSummary);
  if (block.type === "heading_1")
    return `# ${richTextToMarkdown(block.heading_1.rich_text, pagesSummary)}`;
  if (block.type === "heading_2")
    return `## ${richTextToMarkdown(block.heading_2.rich_text, pagesSummary)}`;
  if (block.type === "heading_3")
    return `### ${richTextToMarkdown(block.heading_3.rich_text, pagesSummary)}`;
  if (block.type === "bulleted_list_item")
    return `- ${richTextToMarkdown(block.bulleted_list_item.rich_text, pagesSummary)}`;
  if (block.type === "numbered_list_item")
    return `1. ${richTextToMarkdown(block.numbered_list_item.rich_text, pagesSummary)}`;
  if (block.type === "quote")
    return `> ${richTextToMarkdown(block.quote.rich_text, pagesSummary)}`;
  if (block.type === "callout")
    return `> ${
      block.callout.icon?.type === "emoji" && block.callout.icon.emoji
        ? `${block.callout.icon.emoji} `
        : ""
    } ${richTextToMarkdown(block.callout.rich_text, pagesSummary)}`;
  if (block.type === "image") {
    return block.image.type === "file"
      ? `![${richTextToMarkdown(block.image.caption, pagesSummary)}](${block.image.file.url})`
      : "";
  }
}
