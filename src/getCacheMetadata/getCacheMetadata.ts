import { writeFile, readFile, stat } from "fs/promises";
import { CacheMetadata } from "../_types/CacheMetadata";

export async function getCacheMetadata(
  cacheFolderPath: string
): Promise<CacheMetadata> {
  const cacheMetadataPath = `${cacheFolderPath}/cache.json`;
  let cachedMetadata: CacheMetadata | undefined;
  try {
    await stat(cacheMetadataPath);
    cachedMetadata = JSON.parse(await readFile(cacheMetadataPath, "utf-8"));
  } catch (error) {}

  const currentDate = new Date();
  const newCachedMetadata = {
    ...(cachedMetadata || {}),
    LAST_RUN: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`,
  };

  await writeFile(
    cacheMetadataPath,
    JSON.stringify(newCachedMetadata),
    "utf-8"
  );

  return cachedMetadata || newCachedMetadata;
}
