import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  ImageBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export async function getPageBlocks(notion: Client, pageId: string) {
  let res;
  const blocks: BlockObjectResponse[] = [];

  console.log(`Querying blocks from ${pageId}`);

  do {
    res = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: (res && res.next_cursor) || undefined,
    });
    blocks.push(...(res.results as BlockObjectResponse[]));
  } while (res.has_more);

  console.log(`Found ${blocks.length} blocks`);

  let images: {
    block: ImageBlockObjectResponse;
    index: number;
  }[] = [];

  blocks.forEach((block, index) => {
    if (block.type === "image") {
      images.push({
        block: block as ImageBlockObjectResponse,
        index,
      });
    }
  });

  return { blocks, images };
}
