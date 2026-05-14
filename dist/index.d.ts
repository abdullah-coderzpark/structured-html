type ParagraphBlock = {
    type: "paragraph";
    data: {
        text: string;
    };
};
type QuoteBlock = {
    type: "quote";
    data: {
        text: string;
        caption?: string;
        alignment: "left" | "center";
    };
};
type SimpleImageBlock = {
    type: "image";
    data: {
        url: string;
        caption: string;
        withBorder?: boolean;
        withBackground?: boolean;
        stretched?: boolean;
    };
};
type HeaderBlock = {
    type: "header";
    data: {
        text: string;
        level: number;
    };
};
type ListBlock = {
    type: "list";
    data: {
        style: "unordered" | "ordered";
        items: string[];
    };
};
type RawBlock = {
    type: "raw";
    data: {
        html: string;
    };
};
type TableBlock = {
    type: "table";
    data: {
        withHeadings: boolean;
        stretched: boolean;
        content: string[][];
    };
};
type BlockData = ParagraphBlock | QuoteBlock | SimpleImageBlock | HeaderBlock | ListBlock | RawBlock | TableBlock;
type EditorContent = BlockData[];

/**
 * Converts HTML to structured content
 *
 * @param html input HTML
 * @returns the restructured and simplified HTML
 */
declare const convertHtmlToStructuredContent: (html: Element) => EditorContent;

export { convertHtmlToStructuredContent };
