#!/usr/bin/env bun
/**
 * TinyTools Weekly Newsletter Generator
 * Creates HTML email content for the weekly newsletter
 */

import { readFileSync, writeFileSync } from 'fs';

const TOOLS_PATH = '/home/workspace/tinytoolbox-github/lib/tools.ts';
const BLOG_PATH = '/home/workspace/tinytoolbox-github/lib/blog-posts.ts';
const TOOL_CONTENT_PATH = '/home/workspace/tinytoolbox-github/lib/tool-content.ts';
const SITE_URL = 'https://tinytoolbox.co';

// --- Parse tools.ts ---
function extractTools(): any[] {
  const content = readFileSync(TOOLS_PATH, 'utf-8');
  const match = content.match(/export\s+const\s+TOOLS\s*:\s*[\w\[\]]+\s*=\s*\[([\s\S]*?)\]\s*;/);
  if (!match) return [];
  const arrayContent = match[1];
  const tools: any[] = [];
  let depth = 0;
  let current = '';
  for (const char of arrayContent) {
    if (char === '{') { depth++; current += char; }
    else if (char === '}') { depth--; current += char; if (depth === 0) { 
      try { 
        // Strip icon: IconName references since they reference undefined variables
        const cleaned = current.replace(/,\s*icon:\s*\w+/g, '');
        tools.push(eval('(' + cleaned + ')')); 
        current = ''; 
      } catch (e) { 
        current = ''; 
      } 
    } }
    else if (depth > 0) current += char;
  }
  return tools;
}

// --- Parse blog-posts.ts ---
function extractBlogPosts(): any[] {
  const content = readFileSync(BLOG_PATH, 'utf-8');
  const match = content.match(/export\s+const\s+BLOG_POSTS\s*:\s*[\w\[\]]+\s*=\s*\[([\s\S]*?)\]\s*;/);
  if (!match) return [];
  const arrayContent = match[1];
  const posts: any[] = [];
  let depth = 0;
  let current = '';
  for (const char of arrayContent) {
    if (char === '{') { depth++; current += char; }
    else if (char === '}') { depth--; current += char; if (depth === 0) { try { posts.push(eval('(' + current + ')')); current = ''; } catch { current = ''; } } }
    else if (depth > 0) current += char;
  }
  return posts;
}

function getToolContent(slug: string): any {
  try {
    const content = readFileSync(TOOL_CONTENT_PATH, 'utf-8');
    const match = content.match(new RegExp(`['\"]${slug}['\"]\\s*:\\s*\\{([\\s\\S]*?)\\},?\\s*['\"]\\w+['\"]`));
    if (!match) return null;
    return { howToUse: '', howToSteps: [], faqs: [] };
  } catch { return null; }
}

interface NewsletterData {
  tools: any[];
  blogPosts: any[];
  weekOf: string;
}

function getNewsletterData(): NewsletterData {
  const tools = extractTools();
  const blogPosts = extractBlogPosts();
  const now = new Date();
  const weekOf = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return { tools, blogPosts, weekOf };
}

export function generateNewsletterHtml(data: NewsletterData): string {
  const { tools, blogPosts, weekOf } = data;
  
  // Get featured tools (top 6 from each major category)
  const categories = ['Developer', 'Text', 'Converter', 'SEO', 'Generator'];
  const featuredTools = categories.flatMap(cat => 
    tools.filter(t => t.category === cat).slice(0, 2)
  ).slice(0, 6);

  // Get recent blog posts (last 3)
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TinyTools Weekly - ${weekOf}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e4e4e7;">
  
  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#18181b 0%,#27272a 100%);border-radius:16px 16px 0 0;padding:40px 40px 30px;text-align:center;">
              <h1 style="margin:0;font-size:32px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                🛠️ TinyTools Weekly
              </h1>
              <p style="margin:12px 0 0;font-size:16px;color:#a1a1aa;">Week of ${weekOf}</p>
            </td>
          </tr>
          
          <!-- Intro -->
          <tr>
            <td style="background:#18181b;padding:30px 40px;border-left:1px solid #27272a;border-right:1px solid #27272a;">
              <p style="margin:0;font-size:16px;line-height:1.7;color:#a1a1aa;text-align:center;">
                Your weekly dose of free developer tools, tips, and updates from 
                <a href="${SITE_URL}" style="color:#3b82f6;text-decoration:none;font-weight:600;">TinyToolbox.co</a>.
                ${tools.length}+ tools to make your dev workflow faster.
              </p>
            </td>
          </tr>
          
          <!-- Featured Tools Section -->
          <tr>
            <td style="background:#18181b;padding:30px 40px 10px;border-left:1px solid #27272a;border-right:1px solid #27272a;">
              <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#ffffff;">🔥 Tools This Week</h2>
            </td>
          </tr>
          
          <!-- Tools Grid -->
          ${featuredTools.map((tool, i) => `
          <tr>
            <td style="background:#18181b;padding:10px 40px;border-left:1px solid #27272a;border-right:1px solid #27272a;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#27272a;border-radius:12px;padding:20px;">
                <tr>
                  <td style="padding:0;">
                    <h3 style="margin:0 0 8px;font-size:16px;font-weight:600;color:#ffffff;">
                      <a href="${SITE_URL}/tools/${tool.slug}" style="color:#ffffff;text-decoration:none;">${tool.name}</a>
                    </h3>
                    <p style="margin:0;font-size:14px;color:#a1a1aa;line-height:1.5;">${tool.description}</p>
                    <span style="display:inline-block;margin-top:10px;font-size:11px;font-weight:600;color:${tool.accent === 'cyan' ? '#22d3ee' : tool.accent === 'emerald' ? '#34d399' : tool.accent === 'violet' ? '#a78bfa' : '#f472b6'};text-transform:uppercase;letter-spacing:0.5px;">${tool.category}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `).join('')}
          
          <!-- Blog Section -->
          ${recentPosts.length > 0 ? `
          <tr>
            <td style="background:#18181b;padding:30px 40px 10px;border-left:1px solid #27272a;border-right:1px solid #27272a;">
              <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#ffffff;">📝 Latest from the Blog</h2>
            </td>
          </tr>
          ${recentPosts.map(post => `
          <tr>
            <td style="background:#18181b;padding:10px 40px;border-left:1px solid #27272a;border-right:1px solid #27272a;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#27272a;border-radius:12px;padding:20px;">
                <tr>
                  <td style="padding:0;">
                    <h3 style="margin:0 0 8px;font-size:16px;font-weight:600;color:#ffffff;">
                      <a href="${SITE_URL}/blog/${post.slug}" style="color:#ffffff;text-decoration:none;">${post.title}</a>
                    </h3>
                    <p style="margin:0 0 10px;font-size:13px;color:#71717a;">${post.date} · ${post.readTime} read</p>
                    <p style="margin:0;font-size:14px;color:#a1a1aa;line-height:1.5;">${post.description}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `).join('')}
          ` : ''}
          
          <!-- Tips Section -->
          <tr>
            <td style="background:#18181b;padding:30px 40px 10px;border-left:1px solid #27272a;border-right:1px solid #27272a;">
              <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#ffffff;">💡 Quick Tips</h2>
            </td>
          </tr>
          <tr>
            <td style="background:#18181b;padding:10px 40px 30px;border-left:1px solid #27272a;border-right:1px solid #27272a;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#27272a;border-radius:12px;padding:20px;">
                <tr>
                  <td style="padding:0;font-size:14px;color:#a1a1aa;line-height:1.7;">
                    <ul style="margin:0;padding-left:20px;">
                      <li style="margin-bottom:10px;"><strong style="color:#ffffff;">Bookmark your favorite tools</strong> — All TinyTools work client-side, so they're perfect for offline use once loaded.</li>
                      <li style="margin-bottom:10px;"><strong style="color:#ffffff;">Use the JSON formatter for API debugging</strong> — Paste messy API responses to instantly beautify and validate them.</li>
                      <li><strong style="color:#ffffff;">Share tools via embed</strong> — Every tool has an embeddable version at ${SITE_URL}/embed/[slug] for use in documentation or your own sites.</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Section -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a5f 0%,#1e40af 100%);border-radius:0 0 16px 16px;padding:40px;text-align:center;border-left:1px solid #27272a;border-right:1px solid #27272a;">
              <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#ffffff;">Ready to speed up your workflow?</h2>
              <p style="margin:0 0 24px;font-size:15px;color:#bfdbfe;">Explore all ${tools.length}+ free tools at TinyToolbox.co</p>
              <a href="${SITE_URL}" style="display:inline-block;background:#ffffff;color:#1e40af;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;">Browse All Tools →</a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:30px 40px;text-align:center;">
              <p style="margin:0 0 10px;font-size:13px;color:#71717a;">
                You're receiving this because you subscribed at <a href="${SITE_URL}" style="color:#3b82f6;text-decoration:none;">TinyToolbox.co</a>
              </p>
              <p style="margin:0;font-size:13px;color:#52525b;">
                <a href="${SITE_URL}" style="color:#71717a;text-decoration:none;">Home</a> · 
                <a href="${SITE_URL}/tools" style="color:#71717a;text-decoration:none;">Tools</a> · 
                <a href="${SITE_URL}/blog" style="color:#71717a;text-decoration:none;">Blog</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
  
</body>
</html>`;
}

// --- CLI Entry Point ---
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

async function main() {
  console.log('📧 Generating TinyTools Weekly Newsletter...\n');
  
  const data = getNewsletterData();
  const html = generateNewsletterHtml(data);
  
  if (isDryRun) {
    // Save to file for inspection
    const outputPath = '/home/workspace/Skills/tinytools-newsletter/newsletter-preview.html';
    writeFileSync(outputPath, html);
    console.log(`✅ Newsletter generated (dry run)`);
    console.log(`📄 Preview saved to: ${outputPath}`);
    console.log(`\n📊 Stats:`);
    console.log(`   - Total tools: ${data.tools.length}`);
    console.log(`   - Featured tools: 6`);
    console.log(`   - Blog posts: ${data.blogPosts.length}`);
    console.log(`   - Week of: ${data.weekOf}`);
  } else {
    // Output the HTML for use by send-newsletter.ts
    const outputPath = '/home/workspace/Skills/tinytools-newsletter/latest-newsletter.html';
    writeFileSync(outputPath, html);
    console.log(`✅ Newsletter HTML saved to: ${outputPath}`);
    console.log(`\n📊 Stats:`);
    console.log(`   - Total tools: ${data.tools.length}`);
    console.log(`   - Featured tools: 6`);
    console.log(`   - Blog posts: ${data.blogPosts.length}`);
    console.log(`   - Week of: ${data.weekOf}`);
  }
}

main().catch(console.error);
