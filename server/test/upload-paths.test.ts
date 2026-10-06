import assert from "node:assert/strict";
import path from "node:path";
import { getUploadDir } from "../src/upload-paths";

const compiledDir = path.join(process.cwd(), "dist", "src");

assert.equal(getUploadDir(compiledDir), path.join(process.cwd(), "uploads"));
