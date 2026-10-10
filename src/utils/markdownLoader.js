import { marked } from 'marked';
import hljs from 'highlight.js';

// Configure marked with highlight.js
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error(err);
      }
    }
    return hljs.highlightAuto(code).value;
  }
});

// Resilient Frontmatter Parser
export function parseFrontmatter(rawContent, filePath = '') {
  const trimmed = rawContent.trimStart();
  if (!trimmed.startsWith('---')) {
    const filename = filePath.split('/').pop().replace('.md', '');
    return {
      metadata: {
        title: filename,
        slug: filename,
        date: new Date().toISOString().slice(0, 10),
        category: 'General',
        tags: [],
        difficulty: 'Medio',
        summary: ''
      },
      content: rawContent
    };
  }

  const endMatch = trimmed.indexOf('\n---', 3);
  if (endMatch === -1) {
    return { metadata: {}, content: rawContent };
  }

  const frontmatterStr = trimmed.slice(3, endMatch).trim();
  const markdownBody = trimmed.slice(endMatch + 4).trim();
  const metadata = {};

  const lines = frontmatterStr.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let val = line.slice(colonIndex + 1).trim();

    // Remove surrounding quotes if present
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    // Handle YAML arrays like ["a", "b", "c"]
    if (val.startsWith('[') && val.endsWith(']')) {
      try {
        // Parse array or fall back to comma split
        const arrayItems = val
          .slice(1, -1)
          .split(',')
          .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
        metadata[key] = arrayItems;
        continue;
      } catch (e) {
        // fallback
      }
    }

    // Handle booleans and numbers
    if (val.toLowerCase() === 'true') metadata[key] = true;
    else if (val.toLowerCase() === 'false') metadata[key] = false;
    else if (!isNaN(Number(val)) && val !== '') metadata[key] = Number(val);
    else metadata[key] = val;
  }

  // Ensure default slug and title if missing
  const fallbackSlug = filePath.split('/').pop().replace('.md', '');
  if (!metadata.slug) metadata.slug = fallbackSlug;
  if (!metadata.title) metadata.title = fallbackSlug;
  if (!metadata.tags) metadata.tags = [];
  if (!Array.isArray(metadata.tags)) metadata.tags = [metadata.tags];

  return { metadata, content: markdownBody };
}

// Vite glob imports: automatically loads all .md files in content directory
const projectModules = import.meta.glob('/src/content/projects/*.md', { query: '?raw', eager: true });
const ctfModules = import.meta.glob('/src/content/ctfs/*.md', { query: '?raw', eager: true });

function processGlob(modules, type) {
  const items = [];
  for (const [path, raw] of Object.entries(modules)) {
    const filename = path.split('/').pop();
    // Ignore template files that start with underscore
    if (filename.startsWith('_')) continue;

    const rawText = typeof raw === 'string' ? raw : (raw.default || '');
    const { metadata, content } = parseFrontmatter(rawText, path);
    items.push({
      ...metadata,
      type, // 'project' or 'ctf'
      filePath: path,
      rawMarkdown: content,
      renderedHtml: marked.parse(content)
    });
  }
  // Sort by date descending
  return items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

let cachedProjects = null;
let cachedCtfs = null;

export function getProjects() {
  if (!cachedProjects) {
    cachedProjects = processGlob(projectModules, 'project');
  }
  return cachedProjects;
}

export function getCtfs() {
  if (!cachedCtfs) {
    cachedCtfs = processGlob(ctfModules, 'ctf');
  }
  return cachedCtfs;
}

export function getAllItems() {
  return [...getProjects(), ...getCtfs()];
}

export function getItemBySlug(slug) {
  const all = getAllItems();
  return all.find(item => item.slug === slug || item.filePath.includes(slug));
}

export function renderMarkdown(content) {
  return marked.parse(content);
}
