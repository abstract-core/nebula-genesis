import { Client } from "@notionhq/client";
import {
  TableBlockObjectResponse,
  TableRowBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export async function downloadTable(
  notion: Client,
  block: TableBlockObjectResponse
): Promise<TableRowBlockObjectResponse[]> {
  let res;
  const rows: TableRowBlockObjectResponse[] = [];

  do {
    res = await notion.blocks.children.list({
      block_id: block.id,
      start_cursor: (res && res.next_cursor) || undefined,
    });
    rows.push(...(res.results as TableRowBlockObjectResponse[]));
  } while (res.has_more);

  return rows;
}
