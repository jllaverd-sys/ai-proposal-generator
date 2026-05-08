import { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function StepMissingInfo({ questions, answers, onAnswersChange, onNext, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function setAnswer(question, value) {
    onAnswersChange({ ...answers, [question]: value });
  }

  async function handleNext() {
    setError('');
    setLoading(true);
    try {
      await onNext(answers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!questions || questions.length === 0) {
    onNext(answers);
    return null;
  }

  return (
    <div className="card">
      <h2>Answer Before We Generate</h2>
      <p className="description">Your answers will update the scope. Skip any you don't have yet — they'll be noted as assumptions.</p>

      {error && <div className="error-banner">{error}</div>}

      <div className="missing-list">
        {questions.map((q, i) => (
          <div key={i} className="missing-item">
            <label>{q}</label>
            <textarea
              placeholder="Your answer (or leave blank to treat as unknown)"
              value={answers[q] || ''}
              onChange={(e) => setAnswer(q, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={onBack} disabled={loading}>← Back</button>
        <button className="btn btn-primary" onClick={handleNext} disabled={loading}>
          {loading ? 'Updating scope...' : 'Update Scope →'}
        </button>
      </div>
    </div>
  );
}
