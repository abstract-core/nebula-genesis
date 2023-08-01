import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { writeFile, readFile, stat } from "fs/promises";

export async function mergeCachedUpdatedPages(
  cachePath: string,
  updatedPages: PageObjectResponse[]
) {
  const cachedPages = JSON.parse(
    await readFile(`${cachePath}/pages.json`, "utf-8")
  ) as PageObjectResponse[];

  const cachedPagesIndex = cachedPages.reduce(
    (acc, page, index) => ({
      ...acc,
      [page.id]: index,
    }),
    {} as Record<string, number>
  );

  const mergedPages = cachedPages.slice();

  updatedPages.forEach((page) => {
    if (cachedPagesIndex[page.id]) {
      mergedPages[cachedPagesIndex[page.id]] = page;
    } else {
      mergedPages.push(page);
    }
  });

  return mergedPages;
}
