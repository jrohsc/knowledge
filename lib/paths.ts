export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/knowledge";
export const assetPath = (path: string) =>
  `${basePath}/${path.replace(/^\//, "")}`;
