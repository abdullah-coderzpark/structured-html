"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  convertHtmlToStructuredContent: () => convertHtmlToStructuredContent
});
module.exports = __toCommonJS(src_exports);

// src/utils.ts
var exists = (value) => !!value;

// src/index.ts
var transform = (el) => ({
  element: el,
  tagName: el.tagName,
  textContent: el.textContent || void 0,
  htmlContent: el.innerHTML,
  children: Array.from(el.children).map(transform),
  attrs: Array.from(el.attributes).reduce(
    (acc, { name, value }) => ({ ...acc, [name]: value }),
    {}
  )
});
var createParagraphs = (text) => [
  {
    type: "paragraph",
    data: {
      text
    }
  }
];
var errorHandler = (transformed) => {
  console.warn("Failed to parse node", transformed);
  return [];
};
var containerHandler = (data) => data.children.map((child) => {
  const handler = tagHandlers[child.tagName];
  if (!handler) {
    return errorHandler(child);
  }
  return handler(child);
});
var paragraphHandler = (data) => {
  if (!data.textContent) {
    return containerHandler(data);
  }
  return createParagraphs(data.htmlContent || data.textContent);
};
var blockquoteHandler = (data) => data.textContent ? [
  {
    type: "quote",
    data: {
      text: data.textContent,
      alignment: "left"
    }
  }
] : [];
var imageHandler = (data) => data.attrs.src ? [
  {
    type: "image",
    data: {
      url: data.attrs.src,
      caption: data.attrs.alt || "",
      stretched: false,
      withBackground: false,
      withBorder: false
    }
  }
] : [];
var headingHandler = (level) => (data) => data.htmlContent ? [
  {
    type: "header",
    data: {
      text: data.htmlContent,
      level
    }
  }
] : [];
var listHandler = (style) => (data) => data.htmlContent ? [
  {
    type: "list",
    data: {
      style,
      items: data.children.map((child) => child.htmlContent).filter(exists)
    }
  }
] : [];
var rawHandler = (data) => data.textContent ? [
  {
    type: "raw",
    data: {
      html: data.textContent
    }
  }
] : [];
var tableHandler = (data) => {
  const rows = [];
  let withHeadings = false;
  const parseRows = (children) => {
    for (const child of children) {
      if (child.tagName === "THEAD") {
        withHeadings = true;
        parseRows(child.children);
      } else if (child.tagName === "TBODY" || child.tagName === "TFOOT") {
        parseRows(child.children);
      } else if (child.tagName === "TR") {
        const cells = [];
        for (const cell of child.children) {
          if (cell.tagName === "TD" || cell.tagName === "TH") {
            cells.push(cell.htmlContent || cell.textContent || "");
          }
        }
        rows.push(cells);
      }
    }
  };
  parseRows(data.children);
  if (!withHeadings && data.children.length > 0) {
    const firstRowSource = data.element.querySelector("tr");
    if (firstRowSource && firstRowSource.querySelector("th")) {
      withHeadings = true;
    }
  }
  if (rows.length === 0) {
    return [];
  }
  return [
    {
      type: "table",
      data: {
        withHeadings,
        stretched: false,
        content: rows
      }
    }
  ];
};
var tagHandlers = {
  P: paragraphHandler,
  A: paragraphHandler,
  BLOCKQUOTE: blockquoteHandler,
  IMG: imageHandler,
  UL: listHandler("unordered"),
  OL: listHandler("ordered"),
  BODY: containerHandler,
  MAIN: containerHandler,
  ASIDE: containerHandler,
  SECTION: containerHandler,
  DIV: containerHandler,
  ARTICLE: containerHandler,
  SPAN: containerHandler,
  FIGURE: containerHandler,
  PICTURE: containerHandler,
  CODE: rawHandler,
  PRE: rawHandler,
  H1: headingHandler(1),
  H2: headingHandler(2),
  H3: headingHandler(3),
  H4: headingHandler(4),
  H5: headingHandler(5),
  H6: headingHandler(6),
  TABLE: tableHandler,
  THEAD: containerHandler,
  TBODY: containerHandler,
  TFOOT: containerHandler
};
var convertHtmlToStructuredContent = (html) => {
  const transformed = transform(html);
  const baseHandler = tagHandlers[transformed.tagName];
  if (!baseHandler) {
    return errorHandler(transformed);
  }
  return baseHandler(transformed).flat(20);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertHtmlToStructuredContent
});
