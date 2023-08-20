import { Client } from "@notionhq/client";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { PropertyFilter } from "../_types/PropertyFilter";

export async function getDatabasePages(
  notion: Client,
  databaseId: string,
  /** YYYY-MM-DD */
  cacheTime?: string,
  filters?: PropertyFilter[]
): Promise<PageObjectResponse[]> {
  let res: QueryDatabaseResponse | undefined;
  const pages: PageObjectResponse[] = [];

  const timestampFilter = cacheTime
    ? {
        timestamp: "last_edited_time",
        last_edited_time: {
          on_or_after: cacheTime,
        },
      }
    : undefined;

  timestampFilter && console.log(`Querying pages from ${cacheTime}`);

  do {
    res = await notion.databases.query({
      database_id: databaseId,
      start_cursor: (res && res.next_cursor) || undefined,
      filter:
        cacheTime && filters
          ? {
              and: [
                {
                  timestamp: "last_edited_time",
                  last_edited_time: {
                    on_or_after: cacheTime,
                  },
                },
                ...filters,
              ],
            }
          : cacheTime
          ? {
              timestamp: "last_edited_time",
              last_edited_time: {
                on_or_after: cacheTime,
              },
            }
          : filters && {
              and: filters,
            },
    });
    pages.push(...(res.results as PageObjectResponse[]));
  } while (res.has_more);

  console.log(`Found ${pages.length} pages`);

  return pages;
}
