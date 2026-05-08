/**
 * Pre-filters RFP text to just the Information Table and Requirements section.
 * Skips all procurement boilerplate, TOC, appendix forms, and evaluation criteria.
 */
export function extractRelevantText(fullText) {
  const parts = [];

  // ── 1. Information Table ──────────────────────────────────────────────────
  // The real Info Table contains "RFP NUMBER AND TITLE" (not in TOC).
  // Start from that line, end before "DEFINED TERMS" or "PART 1" or after 4000 chars.
  const infoAnchor = fullText.indexOf('RFP NUMBER AND TITLE');
  if (infoAnchor > -1) {
    // Walk back to the nearest preceding newline to get the full section header
    const start = Math.max(0, infoAnchor - 50);
    // End at whichever marker comes first
    // Cut off when the Info Table transitions to submission/process boilerplate
    const endMarkers = [
      'RFP TIMETABLE', 'SUBMISSION PAGE', 'SUBMISSIONS WITH PROPOSAL',
      'DEFINED TERMS', 'PART 1', 'INELIGIBLE PERSONS',
    ];
    let end = start + 4000; // hard cap
    for (const m of endMarkers) {
      const idx = fullText.indexOf(m, start);
      if (idx > start && idx < end) end = idx;
    }
    parts.push(fullText.slice(start, end).trim());
    parts.push('\n\n[... procurement boilerplate omitted ...]\n\n');
  }

  // ── 2. Appendix B (Requirements) ─────────────────────────────────────────
  // Find the LAST occurrence of "APPENDIX B" — that's the actual content, not the TOC entry.
  const appBRegex = /APPENDIX\s+B\s*[–—-]\s*REQUIREMENTS/gi;
  let appBStart = -1;
  let m;
  while ((m = appBRegex.exec(fullText)) !== null) appBStart = m.index;

  if (appBStart === -1) {
    // Fallback: look for just "APPENDIX B"
    const fallback = fullText.lastIndexOf('APPENDIX B');
    if (fallback > -1) appBStart = fallback;
  }

  // Find where Appendix B ends: the LAST occurrence of "APPENDIX C"
  const appCRegex = /APPENDIX\s+C\s*[–—-]/gi;
  let appCStart = fullText.length;
  while ((m = appCRegex.exec(fullText)) !== null) appCStart = m.index;

  if (appBStart > -1) {
    parts.push(fullText.slice(appBStart, appCStart).trim());
  }

  const extracted = parts.join('\n\n');

  if (extracted.length < 500) {
    console.error('Warning: extraction found too little content — sending full text');
    return fullText;
  }

  console.error(
    `Extracted ${extracted.length} chars from ${fullText.length} chars ` +
    `(${Math.round(extracted.length / fullText.length * 100)}% of original)`
  );
  return extracted;
}
