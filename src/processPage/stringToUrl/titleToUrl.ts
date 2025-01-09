export function stringToUrl(value: string) {
  return value
    .toLowerCase()
    .replace(/à/g, "a")
    .replace(/é/g, "e")
    .replace(/è/g, "e")
    .replace(/ê/g, "e")
    .replace(/î/g, "i")
    .replace(/ï/g, "i")
    .replace(/ô/g, "o")
    .replace(/û/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
