import { ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { writeFile } from "fs/promises";
import fetch from "node-fetch";

export async function downloadImage(
  imagesFolderPath: string,
  imageBlock: ImageBlockObjectResponse
) {
  if (imageBlock.type === "image" && imageBlock.image.type === "file") {
    const imageUrl = imageBlock.image.file.url;

    const filename = imageUrl.split("?")[0].split("/").pop() || "";

    const res = await fetch(imageUrl);
    const buffer = await res.buffer();

    await writeFile(`${imagesFolderPath}/${filename}`, buffer);

    return filename;
  }
}
