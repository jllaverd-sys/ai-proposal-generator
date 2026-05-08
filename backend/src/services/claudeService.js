import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SKILLS_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../skills');

async function loadSkill(...filenames) {
  const parts = await Promise.all(
    filenames.map((f) => readFile(join(SKILLS_DIR, f), 'utf8'))
  );
  return parts.join('\n\n---\n\n');
}

export async function parseRFP(rfpText) {
  const system = await loadSkill('parse-rfp.md');

  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system,
    messages: [
      {
        role: 'user',
        content: `Parse the RFP below and return the JSON object described in your instructions.

RFP Document:
---
${rfpText}
---

Return only the JSON. No markdown fences, no explanation.`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('No text response from Claude');

  const raw = textBlock.text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('Claude returned invalid JSON: ' + raw.slice(0, 200));
  }
}

export async function costProposal(parsedRFP) {
  const system = await loadSkill('proposal-costing.md');

  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 8192,
    thinking: { type: 'adaptive' },
    system,
    messages: [
      {
        role: 'user',
        content: `Calculate the fee estimate for the following parsed RFP. Apply the costing rules from your instructions.

Return ONLY the JSON object described in the Output Format section. No markdown fences, no explanation.

PARSED RFP:
${JSON.stringify(parsedRFP, null, 2)}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('No text response from Claude');

  const raw = textBlock.text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('Claude returned invalid JSON: ' + raw.slice(0, 200));
  }
}

export async function generateProposal(parsedRFP, userAnswers) {
  const system = await loadSkill('generate-proposal.md', 'phase-mapping.md');

  const answersText = userAnswers && Object.keys(userAnswers).length > 0
    ? Object.entries(userAnswers).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')
    : 'No additional information provided.';

  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 8192,
    thinking: { type: 'adaptive' },
    system,
    messages: [
      {
        role: 'user',
        content: `Write a professional engineering services proposal using the information below.

PARSED RFP:
${JSON.stringify(parsedRFP, null, 2)}

ENGINEER'S ANSWERS TO MISSING INFO:
${answersText}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('No text response from Claude');
  return textBlock.text;
}
