var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// munsell.js
var munsell_exports = {};
__export(munsell_exports, {
  sRGBToMunsell: () => sRGBToMunsell
});
module.exports = __toCommonJS(munsell_exports);
var import_fs = __toESM(require("fs"), 1);
var import_readline = __toESM(require("readline"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var dirname = import_path.default.dirname(__filename);
async function sRGBToMunsell(r, g, b) {
  return new Promise((resolve, reject) => {
    const stream = import_readline.default.createInterface({
      input: import_fs.default.createReadStream(import_path.default.join(dirname, "data", "sRGBToMunsell.txt")),
      crlfDelay: Infinity
    });
    let count = 0;
    let result = {
      value: "",
      chroma: "",
      hue: ""
    };
    stream.on("line", (line) => {
      if (count <= 1) {
        count++;
        return;
      }
      let hueVal = "";
      const [R, G, B, H, V, C] = line.split("	").map((x) => {
        if (x.match(/[A-Z]/)) {
          hueVal = x.match(/[A-Z]/g).join("");
        }
        return parseFloat(x.trim());
      });
      if (r === R && g === G && b === B) {
        result = {
          hue: H + hueVal,
          value: V,
          chroma: C
        };
        stream.close();
        resolve(result);
      }
    });
    stream.on("close", () => {
      if (result.hue === "" && result.value === "" && result.chroma === "") {
        reject(new Error("No match found"));
      }
    });
    stream.on("error", (err) => {
      reject(err);
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sRGBToMunsell
});
