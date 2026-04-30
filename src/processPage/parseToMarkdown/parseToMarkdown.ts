import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { blockMarkdownSwitch } from "./blockMarkdownSwitch/blockMarkdownSwitch";
import { propertiesToMarkdown } from "./propertiesToMarkdown/propertiesToMarkdown";
import { PageSummary } from "../../_types/PageSummary";

export function parseToMarkdown(
  title: string,
  properties: PageObjectResponse["properties"],
  blocks: BlockObjectResponse[],
  pagesSummary: { [id: string]: PageSummary },
) {
  return `
${propertiesToMarkdown(properties)}

# ${title}

${blocks
  .map(
    (block, index) =>
      (block.type === "table_row"
        ? blocks[index - 1].type === "table_row" &&
          blocks[index - 2].type !== "table_row"
          ? `\n|${block.table_row.cells.map(() => "-").join("|")}|\n`
          : "\n"
        : "\n\n") + blockMarkdownSwitch(block, pagesSummary),
  )
  .join("")}
    `;
}
