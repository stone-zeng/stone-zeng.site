// From https://github.com/vuejs/blog/blob/master/.vitepress/posts.data.js

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createMarkdownRenderer } from 'vitepress';

interface Post {
  title: string;
  href: string;
  date: Date;
  updated?: Date;
  tags: string[];
  excerpt: string;
  _draft: boolean;
}

interface CacheEntry {
  timestamp: number;
  post: Post;
}

const cache: Map<string, CacheEntry> = new Map();

const md = createMarkdownRenderer(process.cwd(), { typographer: true }, '');

const getPost = (fullPath: string, relativePath: string, asFeed = false) => {
  const timestamp = fs.statSync(fullPath).mtimeMs;
  const cached = cache.get(fullPath);
  if (cached && timestamp === cached.timestamp) {
    return cached.post;
  }

  const src = fs.readFileSync(fullPath, 'utf-8');
  const { data, excerpt } = matter(src, {
    excerpt: true,
    excerpt_separator: '<!-- more -->',
  });

  const post: Post = {
    title: data.title,
    href: relativePath.replace(/\.md$/, '.html'),
    date: data.date,
    updated: data.updated,
    tags: data.tags || [],
    excerpt: md.render(data.excerpt ? data.excerpt : excerpt),
    _draft: data.draft,
  };
  // if (asFeed) {
  //   // only attach these when building the RSS feed to avoid bloating the
  //   // client bundle size
  //   post.data = data;
  // }

  cache.set(fullPath, { timestamp, post });
  return post;
};

const getPosts = (dir: string) => {
  const postDir = path.resolve(__dirname, '../docs/' + dir);
  return fs
    .readdirSync(postDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => getPost(path.join(postDir, file), path.join('/', dir, file)))
    .filter((post) => !post._draft)
    .sort()
    .reverse();
};

module.exports = {
  watch: '../docs/**/*.md',
  load: (asFeed = false) => getPosts('posts'),
};
