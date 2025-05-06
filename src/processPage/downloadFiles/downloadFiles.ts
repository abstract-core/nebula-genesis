import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { writeFile } from "fs/promises";

export async function downloadFiles(
  page: PageObjectResponse,
  filesFolderPath: string
) {
  const downloadQueue: Promise<string>[] = [];

  Object.values(page.properties).forEach((prop) => {
    if (prop.type === "files") {
      prop.files.forEach((file) => {
        if (file.type === "file") {
          downloadQueue.push(
            (async () => {
              const fileUrl = file.file.url;

              const filename = fileUrl.split("?")[0].split("/").pop() || "";

              console.log(`Downloading ${file.file.url} from ${page.id}`);

              const res = await fetch(fileUrl);
              const buffer = await res.arrayBuffer();

              await writeFile(
                `${filesFolderPath}/${filename}`,
                new Uint8Array(buffer)
              );

              return filename;
            })()
          );
        }
      });
    }
  });

  await Promise.all(downloadQueue);
}
