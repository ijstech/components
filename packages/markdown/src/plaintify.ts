function escape(html: string): string {
    const escapeMap: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }

    return html.replace(/[&<>"']/g, match => escapeMap[match])
}

/*---------------------------------------------------------------------------------------------
  *  Copyright (c) 2019 Eric Buss
  *  Licensed under the MIT License.
  *  https://github.com/ejrbuss/markdown-to-txt/blob/cf689435d38ad1528b9b796d2da835b8c05d47c1/LICENSE
  *--------------------------------------------------------------------------------------------*/

// https://github.com/ejrbuss/markdown-to-txt/blob/cf689435d38ad1528b9b796d2da835b8c05d47c1/src/markdown-to-txt.ts
const block = (text: string) => text + "\n\n";
const escapeBlock = (text: string) => escape(text) + "\n\n";
const line = (text: string) => text + "\n";
const inline = (text: string) => text;
const newline = () => "\n";
const empty = () => "";

export const TxtRenderer: any = {
	// Block elements
	code: escapeBlock,
	blockquote: block,
	html: empty,
	heading: block,
	hr: newline,
	list: (text: string) => block(text.trim()),
	listitem: line,
	checkbox: empty,
	paragraph: block,
	table: (header: string, body: string) => line(header + body),
	tablerow: (text: string) => line(text.trim()),
	tablecell: (text: string) => text + " ",
	// Inline elements
	strong: inline,
	em: inline,
	codespan: inline,
	br: newline,
	del: inline,
	link: (_0: string, _1: string, text: string) => text,
	image: (_0: string, _1: string, text: string) => text,
	text: inline,
	// etc.
	options: {},
};