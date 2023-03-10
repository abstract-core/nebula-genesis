import { ExtendedBlockObjectResponse, ResizedImageBlockObject } from "statikon";
import cacheImage from "./cacheImage/cacheImage";

export default async function cacheBlocksImages(
  blocks: ExtendedBlockObjectResponse[],
  siteUrl: string
) {
  return await Promise.all(
    blocks.map(async (block) => {
      /* Redudant block type checking for TS typing */
      if (block.type === "image" && block.image.type === "file") {
        /**
         * @todo `cacheImage` should send back multiple urls
         *  to provide `ResizedImageBlockObject` below.
         */
        const filename = await cacheImage(block.image.file.url, siteUrl);
        if (filename) {
          block = {
            id: block.id,
            type: "resized_image",
            standardUrl: `/static/medias/${filename}`,
          } as ResizedImageBlockObject;
        }
      }
      return block;
    })
  );
}
