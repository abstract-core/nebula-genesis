import { PropertyFilter } from "./PropertyFilter";

export type ArgsOptions = {
  notionToken: string;
  databaseId: string;
  filters?: PropertyFilter[];
  siteFolderPath: string;
  cacheFolderName?: string;
  onOrAfter?: string;
  reinitCache?: boolean;
  outputFormat?: string;
  astroCollectionName?: string;
};
