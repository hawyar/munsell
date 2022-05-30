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
  munsellTosRGB: () => munsellTosRGB,
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
  if (r > 255 || g > 255 || b > 255) {
    throw new Error("sRGB values must be between 0 and 255");
  }
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
async function munsellTosRGB(h, v, c) {
  if (typeof h !== "string" || typeof v !== "number" || typeof c !== "number") {
    throw new Error("hue must be a string and value and chroma must be numbers");
  }
  return new Promise((resolve, reject) => {
    const stream = import_readline.default.createInterface({
      input: import_fs.default.createReadStream(import_path.default.join(dirname, "data", "MunsellRenotationTosRGB.txt")),
      crlfDelay: Infinity
    });
    let count = 0;
    let result = {
      r: "",
      g: "",
      b: ""
    };
    stream.on("line", (line) => {
      if (count === 0) {
        count++;
        return;
      }
      const [H, V, C, R, G, B] = line.split("	").map((x) => x.trim());
      if (h === H && v.toString() === V && c.toString() === C) {
        result = {
          r: parseInt(R),
          g: parseInt(G),
          b: parseInt(B)
        };
        stream.close();
        resolve(result);
      }
    });
    stream.on("close", () => {
      if (result.r === "" && result.g === "" && result.b === "") {
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
  munsellTosRGB,
  sRGBToMunsell
});
