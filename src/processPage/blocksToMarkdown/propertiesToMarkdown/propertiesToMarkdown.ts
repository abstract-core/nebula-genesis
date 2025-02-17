import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { richTextToMarkdown } from "../richTextToMarkdown/richTextToMarkdown";
import { stringToUrl } from "../../stringToUrl/titleToUrl";

export function propertiesToMarkdown(
  properties: PageObjectResponse["properties"]
) {
  return `---
slug: ${
    properties["Name"]?.type === "title"
      ? stringToUrl(properties["Name"].title[0].plain_text)
      : ""
  }
${Object.entries(properties)
  .map(([key, property]) => {
    return `${key}: ${
      (property.type === "rich_text"
        ? richTextToMarkdown(property.rich_text)
        : property.type === "title"
        ? `${richTextToMarkdown(property.title)}`
        : property.type === "number"
        ? property.number
        : property.type === "checkbox"
        ? property.checkbox
          ? "true"
          : "false"
        : property.type === "select"
        ? property.select?.name
        : property.type === "multi_select"
        ? property.multi_select.length
          ? `\n- ${property.multi_select
              .map((option) => option.name)
              .join("\n- ")}`
          : "undefined"
        : property.type === "status"
        ? property.status?.name
        : property.type === "date"
        ? property.date?.start
        : "???") || "undefined"
    }`;
  })
  .join("\n")}
---`;
}
