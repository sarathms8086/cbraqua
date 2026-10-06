import path from "path";

export function getUploadDir(_runtimeDir = __dirname) {
  return path.resolve(process.cwd(), "uploads");
}
