/**
 * Applies user answers to conditional scope rules.
 * Updates parsed.phases and parsed.assumptions based on answers.
 * No Claude call needed — rules are deterministic.
 */
export function refineScope(parsed, answers) {
  if (!parsed || !answers) return parsed;

  const result = JSON.parse(JSON.stringify(parsed)); // deep clone
  const a = normalizeAnswers(answers);

  // Helper: add deliverable to a phase by partial name match
  function addToPhase(phaseKeyword, deliverable) {
    const phase = result.phases?.find(p =>
      p.name.toLowerCase().includes(phaseKeyword.toLowerCase())
    );
    if (phase) {
      const alreadyExists = phase.deliverables?.some(d =>
        d.description.toLowerCase().includes(deliverable.toLowerCase().slice(0, 30))
      );
      if (!alreadyExists) {
        phase.deliverables = phase.deliverables || [];
        // Insert before the last meetings line
        const meetingsIdx = phase.deliverables.findIndex(d =>
          d.description.toLowerCase().startsWith('attend ')
        );
        const insertAt = meetingsIdx > -1 ? meetingsIdx : phase.deliverables.length;
        phase.deliverables.splice(insertAt, 0, { description: deliverable, flag: null, flagNote: null });
      }
    }
  }

  // Helper: add to assumptions if not already there
  function addAssumption(text) {
    result.assumptions = result.assumptions || [];
    if (!result.assumptions.some(a => a.toLowerCase().includes(text.toLowerCase().slice(0, 30)))) {
      result.assumptions.push(text);
    }
  }

  // Helper: remove assumption containing keyword
  function removeAssumption(keyword) {
    result.assumptions = (result.assumptions || []).filter(a =>
      !a.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // ── DSSB ──────────────────────────────────────────────────────────────────
  if (isYes(a.dssb)) {
    addToPhase('construction', 'Prepare detailed stormwater management plan — stormwater runoffs and controls to meet City of Calgary requirements');
    removeAssumption('stormwater');
  } else if (isNo(a.dssb)) {
    addAssumption('Stormwater management report (DSSB) is excluded');
  }

  // ── Sanitary Servicing Study ───────────────────────────────────────────────
  if (isYes(a.sanitary)) {
    addToPhase('construction', 'Prepare sanitary servicing study');
    removeAssumption('sanitary servicing study');
  } else if (isNo(a.sanitary)) {
    addAssumption('Sanitary servicing study is excluded');
  }

  // ── Fire Flow Letter ───────────────────────────────────────────────────────
  if (isYes(a.fireFlow)) {
    addToPhase('design development', 'Prepare fire flow letter');
  }

  // ── Off-site / Surface Improvements ───────────────────────────────────────
  if (isYes(a.offsite)) {
    addToPhase('construction', 'Prepare off-site and surface improvement construction drawing package');
    removeAssumption('off-site');
  } else if (isNo(a.offsite)) {
    addAssumption('Off-site, underground, and surface improvements are excluded — adjacent utilities are assumed to have adequate capacities');
  }

  // ── Site Area → ESC type ───────────────────────────────────────────────────
  const siteHa = parseSiteHa(a.siteArea);
  if (siteHa !== null) {
    result.siteAreaHectares = siteHa;
    const constPhase = result.phases?.find(p =>
      p.name.toLowerCase().includes('construction') && p.name.toLowerCase().includes('doc')
    );
    if (constPhase) {
      // Remove existing ESC line and replace with correct one
      constPhase.deliverables = constPhase.deliverables.filter(d =>
        !d.description.toLowerCase().includes('esc')
      );
      const escItem = siteHa > 0.4
        ? 'Prepare ESC application for submission'
        : 'Prepare ESC good housekeeping letter';
      const reviewLine = { description: 'Review and respond to one round of City comments for ESC approval', flag: null, flagNote: null };
      const meetingsIdx = constPhase.deliverables.findIndex(d =>
        d.description.toLowerCase().startsWith('attend ')
      );
      const insertAt = meetingsIdx > -1 ? meetingsIdx : constPhase.deliverables.length;
      constPhase.deliverables.splice(insertAt, 0, { description: escItem, flag: null, flagNote: null }, reviewLine);
    }
  }

  return result;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizeAnswers(answers) {
  const normalized = {};
  for (const [key, val] of Object.entries(answers)) {
    const k = key.toLowerCase();
    if (k.includes('dssb') || k.includes('stormwater')) normalized.dssb = val;
    if (k.includes('sanitary')) normalized.sanitary = val;
    if (k.includes('fire flow') || k.includes('fireflow')) normalized.fireFlow = val;
    if (k.includes('off-site') || k.includes('offsite') || k.includes('surface improvement')) normalized.offsite = val;
    if (k.includes('site') && (k.includes('area') || k.includes('hectare'))) normalized.siteArea = val;
  }
  return normalized;
}

function isYes(val) {
  if (!val) return false;
  return /^(yes|y|true|1)/i.test(val.trim());
}

function isNo(val) {
  if (!val) return false;
  return /^(no|n|false|0)/i.test(val.trim());
}

function parseSiteHa(val) {
  if (!val) return null;
  const num = parseFloat(val);
  if (isNaN(num)) return null;
  // If value looks like acres (> 10 is likely acres for a typical site), convert
  // But default to hectares as that's what we ask for
  return num;
}
