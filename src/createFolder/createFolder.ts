import { mkdir, stat } from "fs/promises";

export async function createFolder(folderPath: string) {
  try {
    await stat(folderPath);
  } catch (error) {
    await mkdir(folderPath, { recursive: true });
  }
}
