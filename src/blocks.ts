export type ParagraphBlock = {
  type: "paragraph";
  data: {
    text: string;
  };
};

export type QuoteBlock = {
  type: "quote";
  data: {
    text: string;
    caption?: string;
    alignment: "left" | "center";
  };
};

export type SimpleImageBlock = {
  type: "image";
  data: {
    url: string;
    caption: string;
    withBorder?: boolean;
    withBackground?: boolean;
    stretched?: boolean;
  };
};

export type HeaderBlock = {
  type: "header";
  data: {
    text: string;
    level: number;
  };
};

export type ListBlock = {
  type: "list";
  data: {
    style: "unordered" | "ordered";
    items: string[];
  };
};

export type RawBlock = {
  type: "raw";
  data: {
    html: string;
  };
};

export type TableBlock = {
  type: "table";
  data: {
    withHeadings: boolean;
    stretched: boolean;
    content: string[][];
  };
};

export type BlockData =
  | ParagraphBlock
  | QuoteBlock
  | SimpleImageBlock
  | HeaderBlock
  | ListBlock
  | RawBlock
  | TableBlock;

export type EditorContent = BlockData[];
