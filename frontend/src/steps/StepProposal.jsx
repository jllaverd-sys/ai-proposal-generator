import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function pollJob(jobId, intervalMs = 3000, timeoutMs = 180000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const res = await fetch(`${API}/proposal/job/${jobId}`);
    const job = await res.json();
    if (job.status === 'done') return job;
    if (job.status === 'error') throw new Error(job.error || 'Job failed');
  }
  throw new Error('Timed out waiting for Claude — please try again');
}

const EMPTY_CONTACT = { company: '', address: '', city: '', province: '', postal: '', attn: '', title: '' };

export default function StepProposal({ parsed, answers, proposal, onProposalReady, onReset, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [contact, setContact] = useState(EMPTY_CONTACT);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState('');

  useEffect(() => {
    if (!proposal) generate();
  }, []);

  async function generate() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/proposal/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parsed, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      const job = await pollJob(data.jobId);
      onProposalReady(job.proposal);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(proposal).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function downloadWord() {
    setDocError('');
    setDocLoading(true);
    try {
      const res = await fetch(`${API}/proposal/document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parsed, contactInfo: contact }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Document generation failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Proposal_${(parsed.projectName || 'Project').replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      setShowDocModal(false);
    } catch (err) {
      setDocError(err.message);
    } finally {
      setDocLoading(false);
    }
  }

  function setField(field, value) {
    setContact((c) => ({ ...c, [field]: value }));
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner" />
          <span>Writing your proposal — this may take 20–45 seconds...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2>Generated Proposal</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {proposal && (
            <>
              <button className="copy-btn" onClick={copyToClipboard}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              <button
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '6px 14px' }}
                onClick={() => { setDocError(''); setShowDocModal(true); }}
              >
                ⬇ Download Word
              </button>
            </>
          )}
        </div>
      </div>

      {!proposal && !loading && (
        <p className="description">Ready to generate your proposal draft.</p>
      )}

      {error && (
        <>
          <div className="error-banner">{error}</div>
          <button className="btn btn-primary" onClick={generate} style={{ marginBottom: '16px' }}>
            Try Again
          </button>
        </>
      )}

      {proposal && (
        <div className="proposal-output">{proposal}</div>
      )}

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        {proposal && (
          <button className="btn btn-secondary" onClick={generate}>Regenerate</button>
        )}
        <button className="btn btn-primary" onClick={onReset}>Start New Proposal</button>
      </div>

      {showDocModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#fff', borderRadius: '10px', padding: '28px 32px',
            width: '480px', maxWidth: '95vw', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          }}>
            <h3 style={{ margin: '0 0 6px' }}>Download Word Proposal</h3>
            <p style={{ fontSize: '13px', color: '#718096', marginBottom: '20px' }}>
              Who are you addressing this proposal to?
            </p>

            {docError && (
              <div className="error-banner" style={{ marginBottom: '12px' }}>{docError}</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568' }}>
                Company Name
                <input
                  type="text"
                  value={contact.company}
                  onChange={(e) => setField('company', e.target.value)}
                  placeholder="e.g. ACI Architects Inc."
                  style={inputStyle}
                />
              </label>

              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568' }}>
                Street Address
                <input
                  type="text"
                  value={contact.address}
                  onChange={(e) => setField('address', e.target.value)}
                  placeholder="e.g. 17225-102 Avenue NW"
                  style={inputStyle}
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 90px', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568' }}>
                  City
                  <input
                    type="text"
                    value={contact.city}
                    onChange={(e) => setField('city', e.target.value)}
                    placeholder="Edmonton"
                    style={inputStyle}
                  />
                </label>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568' }}>
                  Prov.
                  <input
                    type="text"
                    value={contact.province}
                    onChange={(e) => setField('province', e.target.value)}
                    placeholder="AB"
                    style={inputStyle}
                  />
                </label>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568' }}>
                  Postal
                  <input
                    type="text"
                    value={contact.postal}
                    onChange={(e) => setField('postal', e.target.value)}
                    placeholder="T5S 1J8"
                    style={inputStyle}
                  />
                </label>
              </div>

              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568' }}>
                Attention (Name)
                <input
                  type="text"
                  value={contact.attn}
                  onChange={(e) => setField('attn', e.target.value)}
                  placeholder="e.g. Sarah Afolayan"
                  style={inputStyle}
                />
              </label>

              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568' }}>
                Title
                <input
                  type="text"
                  value={contact.title}
                  onChange={(e) => setField('title', e.target.value)}
                  placeholder="e.g. Proposal Coordinator"
                  style={inputStyle}
                />
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDocModal(false)}
                disabled={docLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={downloadWord}
                disabled={docLoading}
              >
                {docLoading ? 'Generating...' : '⬇ Download .docx'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  marginTop: '4px',
  padding: '7px 10px',
  border: '1px solid #cbd5e0',
  borderRadius: '6px',
  fontSize: '13px',
  boxSizing: 'border-box',
};
