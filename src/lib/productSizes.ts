export function formatSizesInput(sizes: string[]) {
  return sizes.join(", ");
}

export function parseSizesInput(input: string) {
  return input
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);
}
