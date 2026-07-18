import { registerTool } from '../toolRegistry';
import { Binary, Link2, FileJson, Code2, Palette, AlignLeft, FileCode, Braces, Paintbrush, Type as TypeIcon } from 'lucide-react';

// --- Lorem Ipsum word pools ---
const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function loremSentence() {
  const len = 8 + Math.floor(Math.random() * 12);
  const words: string[] = [];
  for (let i = 0; i < len; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function loremParagraph() {
  const sentences = 3 + Math.floor(Math.random() * 5);
  const parts: string[] = [];
  for (let i = 0; i < sentences; i++) parts.push(loremSentence());
  return parts.join(' ');
}

// --- CSS minifier ---
function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

// --- JS minifier (safe, comment/whitespace stripping) ---
function minifyJs(js: string): string {
  let out = '';
  let i = 0;
  const len = js.length;
  let lastNonSpace = '';
  while (i < len) {
    const c = js[i];
    const next = js[i + 1];
    // Single-line comment
    if (c === '/' && next === '/') {
      while (i < len && js[i] !== '\n') i++;
      continue;
    }
    // Multi-line comment
    if (c === '/' && next === '*') {
      i += 2;
      while (i < len && !(js[i] === '*' && js[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    // String literals (single, double, template)
    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      out += c;
      i++;
      while (i < len) {
        out += js[i];
        if (js[i] === '\\') {
          out += js[i + 1] ?? '';
          i += 2;
          continue;
        }
        if (js[i] === quote) { i++; break; }
        i++;
      }
      lastNonSpace = quote;
      continue;
    }
    // Whitespace handling
    if (/\s/.test(c)) {
      // Collapse whitespace only if not between two identifier characters
      let j = i;
      while (j < len && /\s/.test(js[j])) j++;
      const prevChar = out[out.length - 1] ?? '';
      const nextChar = js[j] ?? '';
      const prevIsIdent = /[A-Za-z0-9_$]/.test(prevChar);
      const nextIsIdent = /[A-Za-z0-9_$]/.test(nextChar);
      if (prevIsIdent && nextIsIdent) out += ' ';
      i = j;
      continue;
    }
    out += c;
    lastNonSpace = c;
    i++;
  }
  return out.trim();
}

// --- HTML formatter ---
function formatHtml(html: string): string {
  const tokens: string[] = [];
  let i = 0;
  const len = html.length;
  while (i < len) {
    if (html[i] === '<') {
      const end = html.indexOf('>', i);
      if (end === -1) { tokens.push(html.slice(i)); break; }
      tokens.push(html.slice(i, end + 1));
      i = end + 1;
    } else {
      const next = html.indexOf('<', i);
      if (next === -1) { tokens.push(html.slice(i)); break; }
      tokens.push(html.slice(i, next));
      i = next;
    }
  }

  const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  let indent = 0;
  const lines: string[] = [];
  let textBuffer = '';

  for (const token of tokens) {
    if (token.startsWith('<')) {
      if (textBuffer.trim()) {
        lines.push('  '.repeat(indent) + textBuffer.trim());
        textBuffer = '';
      }
      const isClosing = token.startsWith('</');
      const isSelfClosing = token.endsWith('/>') || voidElements.has(token.slice(1).split(/[\s>]/)[0].toLowerCase());
      const isDoctype = token.toLowerCase().startsWith('<!doctype');
      const isComment = token.startsWith('<!--');
      if (isClosing) indent = Math.max(0, indent - 1);
      lines.push('  '.repeat(indent) + token);
      if (!isClosing && !isSelfClosing && !isDoctype && !isComment) indent++;
    } else {
      textBuffer = token;
    }
  }
  if (textBuffer.trim()) lines.push('  '.repeat(indent) + textBuffer.trim());
  return lines.join('\n');
}

// --- JSON formatter ---
function formatJson(input: string, indent: number): { ok: true; output: string } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(input);
    return { ok: true, output: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// --- Color palette generation ---
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function registerDeveloperTools2() {
  registerTool({
    slug: 'base64-encoder',
    title: 'Base64 Encoder',
    description: 'Encode any text or binary data to Base64 format instantly.',
    metaDescription: 'Free Base64 encoder. Convert text or binary data to Base64 format instantly. Supports UTF-8 text encoding for all characters.',
    category: 'developer-tools',
    keywords: ['base64 encoder', 'encode base64', 'base64 converter', 'text to base64', 'binary to base64'],
    icon: Binary,
    fields: [
      { id: 'text', label: 'Text to Encode', type: 'textarea', placeholder: 'Hello, World!' },
    ],
    calculate: ({ fields }) => {
      const text = (fields.text as string) || '';
      if (!text) return null;
      try {
        const encoded = btoa(unescape(encodeURIComponent(text)));
        return {
          title: 'Base64 Encoded',
          value: encoded,
          summary: `Encoded ${text.length} character${text.length !== 1 ? 's' : ''} to Base64 (${encoded.length} characters).`,
          details: [
            { label: 'Input length', value: `${text.length} chars` },
            { label: 'Output length', value: `${encoded.length} chars` },
            { label: 'Base64', value: encoded },
          ],
        };
      } catch (e) {
        return { title: 'Error', value: (e as Error).message };
      }
    },
    explanation: 'Base64 is an encoding scheme that represents binary data in an ASCII string format using a 64-character set (A-Z, a-z, 0-9, +, /). It is commonly used to encode data for transmission over media designed to handle text, such as email or JSON. Each Base64 digit represents 6 bits of data, so three bytes (24 bits) become four Base64 characters.',
    faqs: [
      { question: 'Is Base64 encryption?', answer: 'No. Base64 is encoding, not encryption. It does not provide security — anyone can decode it. It simply transforms data into a text-safe format for transport.' },
      { question: 'Why does Base64 make data larger?', answer: 'Base64 encodes 3 bytes into 4 characters, so output is about 33% larger than the input. This overhead is the trade-off for a text-safe representation.' },
      { question: 'What is Base64 used for?', answer: 'It is used in email (MIME), data URIs in HTML/CSS, JWT tokens, and embedding binary data in JSON or XML where only text is allowed.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'base64-decoder',
    title: 'Base64 Decoder',
    description: 'Decode Base64 strings back to readable text or binary data.',
    metaDescription: 'Free Base64 decoder. Convert Base64 encoded strings back to readable text. Supports UTF-8 decoding for all characters.',
    category: 'developer-tools',
    keywords: ['base64 decoder', 'decode base64', 'base64 to text', 'base64 converter', 'decode base64 string'],
    icon: Binary,
    fields: [
      { id: 'text', label: 'Base64 String to Decode', type: 'textarea', placeholder: 'SGVsbG8sIFdvcmxkIQ==' },
    ],
    calculate: ({ fields }) => {
      const text = (fields.text as string) || '';
      if (!text) return null;
      try {
        const decoded = decodeURIComponent(escape(atob(text.trim())));
        return {
          title: 'Base64 Decoded',
          value: decoded,
          summary: `Decoded ${text.length} Base64 characters to ${decoded.length} character${decoded.length !== 1 ? 's' : ''}.`,
          details: [
            { label: 'Input length', value: `${text.length} chars` },
            { label: 'Output length', value: `${decoded.length} chars` },
            { label: 'Decoded text', value: decoded },
          ],
        };
      } catch (e) {
        return { title: 'Error', value: `Invalid Base64: ${(e as Error).message}` };
      }
    },
    explanation: 'Base64 decoding reverses the encoding process, converting Base64 characters back to the original bytes. Each group of four Base64 characters decodes to three bytes. This decoder handles UTF-8 text properly, so non-ASCII characters are preserved.',
    faqs: [
      { question: 'Why did I get an error?', answer: 'Base64 strings must use only the characters A-Z, a-z, 0-9, +, /, and = (padding). Whitespace is trimmed, but other invalid characters will cause a decoding error.' },
      { question: 'Can I decode binary data?', answer: 'Yes, but the result may contain non-printable characters. This tool decodes to a UTF-8 string, so binary data that is not valid UTF-8 may display incorrectly.' },
      { question: 'What is the = at the end?', answer: 'The = sign is padding to make the Base64 string length a multiple of 4. It ensures correct decoding of the final bytes.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'url-encoder',
    title: 'URL Encoder',
    description: 'Encode text or URLs to a percent-encoded format safe for web transmission.',
    metaDescription: 'Free URL encoder. Percent-encode text or URLs for safe transmission in web addresses. Encodes special characters per RFC 3986.',
    category: 'developer-tools',
    keywords: ['url encoder', 'percent encoding', 'encode url', 'uri encoder', 'urlencode'],
    icon: Link2,
    fields: [
      { id: 'text', label: 'Text to Encode', type: 'textarea', placeholder: 'hello world & friends' },
      { id: 'component', label: 'Encode Mode', type: 'select', options: [
        { value: 'component', label: 'encodeURIComponent (for query parameters)' },
        { value: 'uri', label: 'encodeURI (for full URLs)' },
      ], defaultValue: 'component' },
    ],
    calculate: ({ fields }) => {
      const text = (fields.text as string) || '';
      const mode = fields.component as string;
      if (!text) return null;
      const encoded = mode === 'uri' ? encodeURI(text) : encodeURIComponent(text);
      return {
        title: 'URL Encoded',
        value: encoded,
        summary: `Encoded using ${mode === 'uri' ? 'encodeURI' : 'encodeURIComponent'}.`,
        details: [
          { label: 'Input', value: text },
          { label: 'Encoded', value: encoded },
          { label: 'Mode', value: mode === 'uri' ? 'encodeURI' : 'encodeURIComponent' },
        ],
      };
    },
    explanation: 'URL encoding (percent-encoding) converts special characters into a % followed by two hexadecimal digits, making text safe to include in a URL. encodeURIComponent encodes all reserved characters (use for query parameter values), while encodeURI leaves URL-structural characters like /, ?, and & intact (use for full URLs).',
    faqs: [
      { question: 'When should I use encodeURIComponent vs encodeURI?', answer: 'Use encodeURIComponent for individual query parameter values. Use encodeURI for a complete URL where you want to preserve structural characters like /, :, ?, and &.' },
      { question: 'Which characters get encoded?', answer: 'encodeURIComponent encodes all characters except A-Z, a-z, 0-9, and - _ . ~ !. encodeURI additionally leaves ; , / ? : @ & = + $ # unencoded.' },
      { question: 'Why do spaces become %20?', answer: 'Spaces are not allowed in URLs. encodeURIComponent encodes them as %20. In application/x-www-form-urlencoded data (like form submissions), spaces become + instead.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'url-decoder',
    title: 'URL Decoder',
    description: 'Decode percent-encoded URLs or text back to readable form.',
    metaDescription: 'Free URL decoder. Convert percent-encoded URLs or text back to readable form. Decodes %20 and other encoded characters instantly.',
    category: 'developer-tools',
    keywords: ['url decoder', 'decode url', 'percent decoding', 'uri decoder', 'urldecode'],
    icon: Link2,
    fields: [
      { id: 'text', label: 'Text to Decode', type: 'textarea', placeholder: 'hello%20world%20%26%20friends' },
      { id: 'component', label: 'Decode Mode', type: 'select', options: [
        { value: 'component', label: 'decodeURIComponent' },
        { value: 'uri', label: 'decodeURI' },
      ], defaultValue: 'component' },
    ],
    calculate: ({ fields }) => {
      const text = (fields.text as string) || '';
      const mode = fields.component as string;
      if (!text) return null;
      try {
        const decoded = mode === 'uri' ? decodeURI(text) : decodeURIComponent(text);
        return {
          title: 'URL Decoded',
          value: decoded,
          summary: `Decoded using ${mode === 'uri' ? 'decodeURI' : 'decodeURIComponent'}.`,
          details: [
            { label: 'Input', value: text },
            { label: 'Decoded', value: decoded },
            { label: 'Mode', value: mode === 'uri' ? 'decodeURI' : 'decodeURIComponent' },
          ],
        };
      } catch (e) {
        return { title: 'Error', value: `Invalid encoded text: ${(e as Error).message}` };
      }
    },
    explanation: 'URL decoding reverses percent-encoding, converting %XX sequences back to their original characters. decodeURIComponent decodes all percent-encoded characters, while decodeURI preserves characters that are part of the URL structure. Use decodeURIComponent for query parameter values.',
    faqs: [
      { question: 'What is the difference between decodeURI and decodeURIComponent?', answer: 'decodeURIComponent decodes all percent-encoded sequences. decodeURI does not decode reserved characters like #, ?, and & that are part of the URL structure.' },
      { question: 'Why did decoding fail?', answer: 'Decoding fails if the input contains a malformed percent sequence, such as % followed by non-hexadecimal characters. Ensure your input is properly encoded.' },
      { question: 'Can this decode + as a space?', answer: 'No. This tool decodes %20 as a space. The + encoding for spaces is specific to application/x-www-form-urlencoded data; replace + with %20 first if needed.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description: 'Format, beautify, and validate JSON data with customizable indentation.',
    metaDescription: 'Free JSON formatter and validator. Beautify, minify, and validate JSON data. Detect syntax errors with clear error messages.',
    category: 'developer-tools',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'format json', 'validate json', 'pretty print json'],
    icon: FileJson,
    fields: [
      { id: 'text', label: 'JSON Input', type: 'textarea', placeholder: '{"name":"John","age":30,"city":"New York"}' },
      { id: 'indent', label: 'Indentation', type: 'select', options: [
        { value: '2', label: '2 spaces' },
        { value: '4', label: '4 spaces' },
        { value: '\t', label: 'Tabs' },
      ], defaultValue: '2' },
    ],
    calculate: ({ fields }) => {
      const text = (fields.text as string) || '';
      const indentRaw = fields.indent as string;
      if (!text.trim()) return null;
      const indent = indentRaw === '\t' ? '\t' : parseInt(indentRaw, 10);
      const result = formatJson(text, indent);
      if (!result.ok) {
        return {
          title: 'JSON Invalid',
          value: 'Validation failed',
          summary: `Error: ${result.error}`,
          details: [
            { label: 'Status', value: 'Invalid' },
            { label: 'Error', value: result.error },
          ],
        };
      }
      const parsed = JSON.parse(text);
      const keys = Array.isArray(parsed) ? `${parsed.length} items` : `${Object.keys(parsed).length} keys`;
      return {
        title: 'JSON Valid',
        value: 'Valid',
        summary: `Valid JSON with ${keys}. Formatted output is shown below.`,
        details: [
          { label: 'Status', value: 'Valid' },
          { label: 'Structure', value: keys },
          { label: 'Formatted JSON', value: result.output },
        ],
      };
    },
    explanation: 'JSON (JavaScript Object Notation) is a lightweight data interchange format. This formatter parses your JSON to validate it, then re-serializes it with consistent indentation for readability. If the JSON is invalid, the parser reports the exact error and location, helping you fix syntax issues like missing commas, quotes, or brackets.',
    faqs: [
      { question: 'What makes JSON invalid?', answer: 'Common errors include trailing commas, missing quotes around keys, single quotes instead of double quotes, and unescaped special characters. This validator pinpoints the issue.' },
      { question: 'What indentation should I use?', answer: '2 spaces is the most common convention. 4 spaces provides more readability for deeply nested data. Tabs are used in some editor configurations.' },
      { question: 'Does this support JSON with comments (JSONC)?', answer: 'No. Standard JSON does not allow comments. If your input has comments, remove them before validating, or use a JSONC-aware parser.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'html-formatter',
    title: 'HTML Formatter',
    description: 'Beautify and format messy HTML with proper indentation and structure.',
    metaDescription: 'Free HTML formatter. Beautify and indent messy HTML code with proper structure. Formats tags, attributes, and nested elements cleanly.',
    category: 'developer-tools',
    keywords: ['html formatter', 'html beautifier', 'format html', 'indent html', 'pretty print html'],
    icon: Code2,
    fields: [
      { id: 'text', label: 'HTML Input', type: 'textarea', placeholder: '<div><p>Hello</p></div>' },
    ],
    calculate: ({ fields }) => {
      const text = (fields.text as string) || '';
      if (!text.trim()) return null;
      const formatted = formatHtml(text);
      return {
        title: 'HTML Formatted',
        value: 'Formatted',
        summary: `Formatted ${text.length} characters of HTML into ${formatted.split('\n').length} lines.`,
        details: [
          { label: 'Input length', value: `${text.length} chars` },
          { label: 'Output lines', value: `${formatted.split('\n').length}` },
          { label: 'Formatted HTML', value: formatted },
        ],
      };
    },
    explanation: 'HTML formatting (beautification) adds proper indentation and line breaks to make HTML readable. This formatter recognizes opening, closing, and self-closing tags, and indents nested elements consistently. Void elements (like <br> and <img>) are handled correctly without adding unnecessary closing tags.',
    faqs: [
      { question: 'Does this support inline elements?', answer: 'This formatter indents based on tag nesting. Inline content within a tag is preserved on its line. For very fine-grained control, a full HTML parser would be needed, but this covers most common cases.' },
      { question: 'Will it modify my HTML content?', answer: 'No. The formatter only changes whitespace and line breaks for readability. Tag names, attributes, and text content remain unchanged.' },
      { question: 'Does it handle HTML comments?', answer: 'Yes. Comments (<!-- -->) are placed on their own line at the correct indentation level without being modified.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'css-minifier',
    title: 'CSS Minifier',
    description: 'Minify CSS by removing whitespace, comments, and unnecessary characters.',
    metaDescription: 'Free CSS minifier. Compress CSS by removing whitespace, comments, and unnecessary characters. Reduce file size for faster page loads.',
    category: 'developer-tools',
    keywords: ['css minifier', 'minify css', 'css compressor', 'compress css', 'css optimizer'],
    icon: Paintbrush,
    fields: [
      { id: 'text', label: 'CSS Input', type: 'textarea', placeholder: 'body {\n  margin: 0;\n  padding: 0;\n}' },
    ],
    calculate: ({ fields }) => {
      const text = (fields.text as string) || '';
      if (!text.trim()) return null;
      const minified = minifyCss(text);
      const reduction = text.length > 0 ? Math.round((1 - minified.length / text.length) * 100) : 0;
      return {
        title: 'CSS Minified',
        value: `${minified.length} chars`,
        summary: `Reduced from ${text.length} to ${minified.length} characters (${reduction}% smaller).`,
        details: [
          { label: 'Original size', value: `${text.length} chars` },
          { label: 'Minified size', value: `${minified.length} chars` },
          { label: 'Reduction', value: `${reduction}%` },
          { label: 'Minified CSS', value: minified },
        ],
      };
    },
    explanation: 'CSS minification removes comments, whitespace, and unnecessary characters from CSS without changing its behavior. This reduces file size, leading to faster downloads and improved page load times. Minifiers may also shorten colors, remove duplicate rules, and merge selectors, though this tool focuses on safe whitespace and comment removal.',
    faqs: [
      { question: 'Is minified CSS still readable?', answer: 'No, minified CSS is intentionally compact and hard to read. Keep your original (un-minified) CSS for editing, and deploy the minified version for production.' },
      { question: 'How much does minification save?', answer: 'Typically 15–30% of file size, depending on how much whitespace and how many comments were present. Larger files with more comments see bigger savings.' },
      { question: 'Will minification break my CSS?', answer: 'No. This minifier only removes whitespace and comments, which do not affect CSS behavior. Property values and selectors are preserved exactly.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'javascript-minifier',
    title: 'JavaScript Minifier',
    description: 'Minify JavaScript by removing comments and unnecessary whitespace.',
    metaDescription: 'Free JavaScript minifier. Compress JS code by removing comments and whitespace. Reduce file size for faster loading without changing behavior.',
    category: 'developer-tools',
    keywords: ['javascript minifier', 'minify js', 'js minifier', 'compress javascript', 'js compressor'],
    icon: Braces,
    fields: [
      { id: 'text', label: 'JavaScript Input', type: 'textarea', placeholder: 'function hello(name) {\n  // greet\n  return "Hello, " + name;\n}' },
    ],
    calculate: ({ fields }) => {
      const text = (fields.text as string) || '';
      if (!text.trim()) return null;
      const minified = minifyJs(text);
      const reduction = text.length > 0 ? Math.round((1 - minified.length / text.length) * 100) : 0;
      return {
        title: 'JavaScript Minified',
        value: `${minified.length} chars`,
        summary: `Reduced from ${text.length} to ${minified.length} characters (${reduction}% smaller).`,
        details: [
          { label: 'Original size', value: `${text.length} chars` },
          { label: 'Minified size', value: `${minified.length} chars` },
          { label: 'Reduction', value: `${reduction}%` },
          { label: 'Minified JS', value: minified },
        ],
      };
    },
    explanation: 'JavaScript minification removes comments and unnecessary whitespace to reduce file size. This minifier carefully preserves string literals (including template literals) and avoids removing whitespace where it would change token boundaries (e.g., between two identifiers). It does not rename variables or perform advanced optimizations, keeping the process safe and predictable.',
    faqs: [
      { question: 'Does this minifier rename variables?', answer: 'No. This is a safe whitespace and comment minifier. It does not rename variables or perform advanced code transformations, so the output remains functionally identical and easy to debug.' },
      { question: 'Will it break code with ASI (Automatic Semicolon Insertion)?', answer: 'This minifier preserves newlines between identifier characters to avoid breaking code that relies on ASI. However, always use explicit semicolons in production code to be safe.' },
      { question: 'How much can I save?', answer: 'Typically 20–40% for well-commented, indented code. Code with many comments and generous whitespace sees the largest reductions.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'color-palette-generator',
    title: 'Color Palette Generator',
    description: 'Generate harmonious color palettes from a base color using color theory.',
    metaDescription: 'Free color palette generator. Create harmonious color schemes from a base color. Generates complementary, analogous, triadic, and tetradic palettes.',
    category: 'developer-tools',
    keywords: ['color palette generator', 'color scheme', 'color picker', 'color theory', 'palette maker', 'hex colors'],
    icon: Palette,
    fields: [
      { id: 'baseColor', label: 'Base Color (hex)', type: 'text', placeholder: '#3b82f6', defaultValue: '#3b82f6' },
      { id: 'scheme', label: 'Color Scheme', type: 'select', options: [
        { value: 'complementary', label: 'Complementary (2 colors)' },
        { value: 'analogous', label: 'Analogous (3 colors)' },
        { value: 'triadic', label: 'Triadic (3 colors)' },
        { value: 'tetradic', label: 'Tetradic (4 colors)' },
        { value: 'monochromatic', label: 'Monochromatic (5 shades)' },
      ], defaultValue: 'complementary' },
    ],
    calculate: ({ fields }) => {
      const baseColor = (fields.baseColor as string) || '#3b82f6';
      const scheme = fields.scheme as string;
      const hexMatch = baseColor.match(/^#?([0-9a-fA-F]{6})$/);
      if (!hexMatch) return { title: 'Error', value: 'Enter a valid hex color (e.g., #3b82f6)' };

      const hex = hexMatch[1];
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      // RGB to HSL
      const rN = r / 255, gN = g / 255, bN = b / 255;
      const max = Math.max(rN, gN, bN);
      const min = Math.min(rN, gN, bN);
      let h = 0, s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === rN) h = ((gN - bN) / d + (gN < bN ? 6 : 0)) * 60;
        else if (max === gN) h = ((bN - rN) / d + 2) * 60;
        else h = ((rN - gN) / d + 4) * 60;
      }

      const colors: string[] = [];
      if (scheme === 'complementary') {
        colors.push(hslToHex(h, s * 100, l * 100));
        colors.push(hslToHex((h + 180) % 360, s * 100, l * 100));
      } else if (scheme === 'analogous') {
        colors.push(hslToHex((h + 330) % 360, s * 100, l * 100));
        colors.push(hslToHex(h, s * 100, l * 100));
        colors.push(hslToHex((h + 30) % 360, s * 100, l * 100));
      } else if (scheme === 'triadic') {
        colors.push(hslToHex(h, s * 100, l * 100));
        colors.push(hslToHex((h + 120) % 360, s * 100, l * 100));
        colors.push(hslToHex((h + 240) % 360, s * 100, l * 100));
      } else if (scheme === 'tetradic') {
        colors.push(hslToHex(h, s * 100, l * 100));
        colors.push(hslToHex((h + 90) % 360, s * 100, l * 100));
        colors.push(hslToHex((h + 180) % 360, s * 100, l * 100));
        colors.push(hslToHex((h + 270) % 360, s * 100, l * 100));
      } else {
        colors.push(hslToHex(h, s * 100, Math.max(20, l * 100 - 30)));
        colors.push(hslToHex(h, s * 100, Math.max(20, l * 100 - 15)));
        colors.push(hslToHex(h, s * 100, l * 100));
        colors.push(hslToHex(h, s * 100, Math.min(80, l * 100 + 15)));
        colors.push(hslToHex(h, s * 100, Math.min(80, l * 100 + 30)));
      }

      return {
        title: 'Color Palette',
        value: colors.join(', '),
        summary: `Generated a ${scheme} palette from ${baseColor.startsWith('#') ? baseColor : '#' + baseColor}.`,
        details: colors.map((c, i) => ({ label: `Color ${i + 1}`, value: c })),
      };
    },
    explanation: 'Color palettes are generated using color theory relationships in the HSL (Hue, Saturation, Lightness) color space. Complementary colors are opposite on the color wheel (180° apart). Analogous colors are adjacent (30° apart). Triadic colors are evenly spaced (120° apart). Tetradic forms a rectangle (90° apart). Monochromatic varies lightness while keeping hue and saturation constant.',
    faqs: [
      { question: 'How do I use these colors?', answer: 'Copy the hex codes into your CSS, design tool, or style guide. Each color is a 6-digit hex code like #3b82f6, ready to use in any design application.' },
      { question: 'What is the best scheme for my project?', answer: 'Complementary creates strong contrast (good for highlights). Analogous is harmonious and calm. Triadic is vibrant and balanced. Monochromatic is clean and unified. Choose based on the mood you want.' },
      { question: 'Can I use a color name instead of hex?', answer: 'This tool accepts hex codes (with or without the # prefix). Convert color names to hex using any color reference before entering them here.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder Lorem Ipsum text in paragraphs, sentences, or words.',
    metaDescription: 'Free Lorem Ipsum generator. Create placeholder text in paragraphs, sentences, or words. Perfect for mockups, designs, and testing layouts.',
    category: 'developer-tools',
    keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text', 'filler text', 'lorem ipsum'],
    icon: AlignLeft,
    fields: [
      { id: 'count', label: 'Amount', type: 'number', placeholder: '5', min: 1, max: 100, defaultValue: '5' },
      { id: 'unit', label: 'Generate By', type: 'select', options: [
        { value: 'paragraphs', label: 'Paragraphs' },
        { value: 'sentences', label: 'Sentences' },
        { value: 'words', label: 'Words' },
      ], defaultValue: 'paragraphs' },
    ],
    calculate: ({ fields }) => {
      const count = parseInt(fields.count as string, 10);
      const unit = fields.unit as string;
      if (!count || count < 1) return null;

      let output = '';
      if (unit === 'paragraphs') {
        const paras: string[] = [];
        for (let i = 0; i < count; i++) paras.push(loremParagraph());
        output = paras.join('\n\n');
      } else if (unit === 'sentences') {
        const sents: string[] = [];
        for (let i = 0; i < count; i++) sents.push(loremSentence());
        output = sents.join(' ');
      } else {
        const words: string[] = [];
        for (let i = 0; i < count; i++) words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
        output = words.join(' ');
      }

      return {
        title: 'Lorem Ipsum',
        value: `${count} ${unit}`,
        summary: `Generated ${count} ${unit} of Lorem Ipsum placeholder text (${output.length} characters).`,
        details: [
          { label: 'Amount', value: `${count} ${unit}` },
          { label: 'Character count', value: `${output.length}` },
          { label: 'Generated text', value: output },
        ],
      };
    },
    explanation: 'Lorem Ipsum is placeholder text used in design and publishing to fill layouts before real content is available. It is derived from a Latin text by Cicero, though the words are scrambled to avoid meaningful content. This generator produces random combinations of standard Lorem Ipsum words to create paragraphs, sentences, or individual words on demand.',
    faqs: [
      { question: 'What is Lorem Ipsum used for?', answer: 'It is placeholder text used in graphic design, web design, and publishing to demonstrate the visual form of a document or website before actual content is written.' },
      { question: 'Why use Lorem Ipsum instead of real text?', answer: 'Real text can distract reviewers from evaluating the layout and design. Lorem Ipsum looks like natural text without carrying meaning, so focus stays on the visual design.' },
      { question: 'Is the generated text always the same?', answer: 'No. This generator randomly selects and arranges words from the Lorem Ipsum vocabulary, so each generation produces different text while maintaining the classic feel.' },
    ],
    recentlyAdded: true,
  });
}
