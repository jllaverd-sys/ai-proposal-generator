import { useState, useRef } from 'react';

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

export default function StepUpload({ onParsed }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    setError('');
    setLoading(true);

    const form = new FormData();
    form.append('rfp', file);

    try {
      const res = await fetch(`${API}/proposal/parse`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      const job = await pollJob(data.jobId);
      onParsed(job.parsed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner" />
          <span>Parsing RFP with Claude AI — this may take 60–90 seconds...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Upload RFP Document</h2>
      <p className="description">Upload a PDF or Word document and Claude will extract the project details, scope, and flag any missing information.</p>

      {error && <div className="error-banner">{error}</div>}

      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <div className="upload-icon">📄</div>
        <p>Drop your RFP here, or click to browse</p>
        <p className="hint">Supports PDF and Word (.docx) files up to 20MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}
