import { Client } from "@notionhq/client";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

export async function getDatabasePages(
  notion: Client,
  databaseId: string,
  /** YYYY-MM-DD */
  cacheTime: string
): Promise<PageObjectResponse[]> {
  let res: QueryDatabaseResponse | undefined;
  const pages: PageObjectResponse[] = [];

  console.log(`Querying pages from ${cacheTime}`);

  do {
    res = await notion.databases.query({
      database_id: databaseId,
      start_cursor: (res && res.next_cursor) || undefined,
      filter: {
        timestamp: "last_edited_time",
        last_edited_time: {
          on_or_after: cacheTime,
        },
      },
    });
    pages.push(...(res.results as PageObjectResponse[]));
  } while (res.has_more);

  console.log(`Found ${pages.length} pages`);

  return pages;
}
