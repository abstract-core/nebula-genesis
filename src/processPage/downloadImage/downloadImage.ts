import { ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { writeFile } from "fs/promises";
import sharp from "sharp";

export async function downloadImage(
  imagesFolderPath: string,
  imageBlock: ImageBlockObjectResponse,
  containerWidth: number
) {
  if (imageBlock.type === "image" && imageBlock.image.type === "file") {
    const imageUrl = imageBlock.image.file.url;

    const filename = imageUrl.split("?")[0].split("/").pop() || "";

    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();

    // Get image metadata and resize if needed
    const metadata = await sharp(buffer).metadata();

    const finalBuffer =
      metadata.width && metadata.width > containerWidth
        ? await sharp(buffer)
            .rotate()
            .resize(containerWidth, null, { withoutEnlargement: true })
            .toBuffer()
        : buffer;

    await writeFile(
      `${imagesFolderPath}/${filename}`,
      new Uint8Array(finalBuffer)
    );

    return filename;
  }
}
