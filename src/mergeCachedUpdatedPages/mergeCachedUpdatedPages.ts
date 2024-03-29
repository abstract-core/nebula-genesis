import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { writeFile, readFile, stat } from "fs/promises";

export async function mergeCachedUpdatedPages(
  cachePath: string,
  updatedPages: PageObjectResponse[]
) {
  let cachedPages: PageObjectResponse[] = [];

  try {
    await stat(`${cachePath}/pages.json`);

    cachedPages = JSON.parse(
      await readFile(`${cachePath}/pages.json`, "utf-8")
    ) as PageObjectResponse[];
  } catch (error) {}

  const cachedPagesIndex = cachedPages.reduce((acc, page, index) => {
    acc[page.id] = index;
    return acc;
  }, {} as Record<string, number>);

  const mergedPages = cachedPages.slice();

  updatedPages.forEach((page) => {
    if (typeof cachedPagesIndex[page.id] === "number") {
      mergedPages[cachedPagesIndex[page.id]] = page;
    } else {
      mergedPages.push(page);
    }
  });

  return mergedPages;
}
