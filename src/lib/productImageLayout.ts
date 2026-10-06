export function getProductMainImageFrameClassName() {
  return "relative w-full overflow-hidden rounded-[10px] border border-black/10 bg-[#fbfaf7] shadow-[0_18px_50px_rgba(0,0,0,0.08)] aspect-[4/5] lg:flex-1";
}

export function getProductMainImageClassName() {
  return "absolute inset-0 h-full w-full object-cover";
}

export function getProductThumbnailFrameClassName(active: boolean) {
  return `aspect-[3/4] overflow-hidden rounded-[10px] cursor-pointer transition-all duration-200 ${
    active ? "ring-1 ring-black" : "opacity-50 hover:opacity-80"
  }`;
}

export function getProductThumbnailImageClassName() {
  return "block w-full h-full object-cover";
}
