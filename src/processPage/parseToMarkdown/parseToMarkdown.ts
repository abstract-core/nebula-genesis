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
  pagesSummary: { [id: string]: PageSummary }
) {
  return `
${propertiesToMarkdown(properties)}

# ${title}

${blocks.map((block) => blockMarkdownSwitch(block, pagesSummary)).join("\n\n")}
    `;
}
