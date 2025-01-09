import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { blockMarkdownSwitch } from "./blockMarkdownSwitch/blockMarkdownSwitch";
import { propertiesToMarkdown } from "./propertiesToMarkdown/propertiesToMarkdown";

export function parseToMarkdown(
  title: string,
  properties: PageObjectResponse["properties"],
  blocks: BlockObjectResponse[]
) {
  return `
${propertiesToMarkdown(properties)}

# ${title}

${blocks.map(blockMarkdownSwitch).join("\n\n")}
    `;
}
