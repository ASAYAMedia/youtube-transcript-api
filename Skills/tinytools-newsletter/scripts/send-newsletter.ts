#!/usr/bin/env bun
/**
 * TinyTools Weekly Newsletter - Sender
 * Sends the generated newsletter to all subscribers via Resend
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SUBSCRIBERS_PATH = '/home/workspace/tinytoolbox-github/data/subscribers.json';
const NEWSLETTER_PATH = join(__dirname, '..', 'latest-newsletter.html');
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'TinyTools Weekly <asaya_ai@proton.me>';
const BATCH_SIZE = 10; // Resend free tier limit
const BATCH_DELAY_MS = 1000; // Delay between batches to avoid rate limits

// --- CLI Entry Point ---
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const testEmail = args.includes('--to') ? args[args.indexOf('--to') + 1] : null;

interface Subscriber {
  email: string;
  date: string;
}

interface ResendResponse {
  id?: string;
  error?: string;
}

function getSubscribers(): Subscriber[] {
  try {
    const content = readFileSync(SUBSCRIBERS_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error('❌ Failed to read subscribers:', e);
    return [];
  }
}

function getNewsletterHtml(): string | null {
  try {
    return readFileSync(NEWSLETTER_PATH, 'utf-8');
  } catch (e) {
    console.error('❌ Failed to read newsletter HTML. Run generate-newsletter.ts first:', e);
    return null;
  }
}

async function sendEmail(to: string, html: string): Promise<ResendResponse> {
  if (!RESEND_API_KEY) {
    return { error: 'RESEND_API_KEY not set' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: '🛠️ TinyTools Weekly - New Tools & Tips',
        html: html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { error: `Resend API error: ${response.status} - ${error}` };
    }

    const data = await response.json();
    return { id: data.id };
  } catch (e: any) {
    return { error: e.message };
  }
}

async function sendNewsletter() {
  console.log('📧 TinyTools Newsletter Sender\n');
  console.log('='.repeat(40) + '\n');

  // Check API key
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY environment variable not set.');
    console.error('\n📋 Setup required:');
    console.error('   1. Get API key from https://resend.com');
    console.error('   2. Add to Zo Settings > Advanced as secret: RESEND_API_KEY');
    process.exit(1);
  }

  // Get newsletter HTML
  const html = getNewsletterHtml();
  if (!html) {
    console.log('💡 Tip: Run `bun run generate-newsletter.ts` first to create the newsletter.');
    process.exit(1);
  }

  // Extract week from newsletter (for logging)
  const weekMatch = html.match(/Week of ([^<]+)/);
  const weekOf = weekMatch ? weekMatch[1] : 'this week';

  // Test mode: send to specific email
  if (testEmail) {
    console.log(`🧪 TEST MODE - Sending to: ${testEmail}\n`);
    const result = await sendEmail(testEmail, html);
    if (result.id) {
      console.log(`✅ Test email sent successfully!`);
      console.log(`   Resend ID: ${result.id}`);
    } else {
      console.error(`❌ Failed: ${result.error}`);
      process.exit(1);
    }
    return;
  }

  // Normal mode: get subscribers
  const subscribers = getSubscribers();
  if (subscribers.length === 0) {
    console.log('📭 No subscribers found. Nothing to send.');
    return;
  }
  console.log(`📋 Found ${subscribers.length} subscriber(s)\n`);
  console.log(`📅 Sending newsletter for: ${weekOf}\n`);
  console.log('-'.repeat(40));

  let sent = 0;
  let failed = 0;
  const failedEmails: string[] = [];

  // Send in batches
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 Sending batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(subscribers.length / BATCH_SIZE)} (${batch.length} emails)...`);

    const results = await Promise.all(
      batch.map(async (sub) => {
        const result = await sendEmail(sub.email, html);
        if (result.id) {
          console.log(`   ✅ ${sub.email}`);
          return { email: sub.email, success: true };
        } else {
          console.log(`   ❌ ${sub.email}: ${result.error}`);
          return { email: sub.email, success: false, error: result.error };
        }
      })
    );

    results.forEach(r => {
      if (r.success) sent++;
      else { failed++; if (r.error) failedEmails.push(r.email); }
    });

    if (i + BATCH_SIZE < subscribers.length) {
      await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  console.log('\n' + '='.repeat(40));
  console.log('\n📊 SEND SUMMARY');
  console.log(`   ✅ Sent: ${sent}`);
  console.log(`   ❌ Failed: ${failed}`);
  if (failedEmails.length > 0) {
    console.log(`\n⚠️ Failed emails:`);
    failedEmails.forEach(e => console.log(`   - ${e}`));
  }
  
  const logEntry = { timestamp: new Date().toISOString(), weekOf, total: subscribers.length, sent, failed, failedEmails };
  const logPath = join(__dirname, '..', 'send-log.json');
  const logs = [];
  try { const existing = readFileSync(logPath, 'utf-8'); logs.push(...JSON.parse(existing)); } catch {}
  logs.unshift(logEntry);
  writeFileSync(logPath, JSON.stringify(logs.slice(0, 52), null, 2));

  if (failed === 0) console.log('\n🎉 All emails sent successfully!');
  else console.log('\n⚠️ Some emails failed.');
}

sendNewsletter().catch(console.error);
