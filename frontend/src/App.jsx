import { useState } from 'react';
import StepUpload from './steps/StepUpload.jsx';
import StepReview from './steps/StepReview.jsx';
import StepMissingInfo from './steps/StepMissingInfo.jsx';
import StepProposal from './steps/StepProposal.jsx';
import './App.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const STEPS = ['Upload RFP', 'Review Scope', 'Answer Questions', 'Confirm Scope', 'Proposal'];

export default function App() {
  const [step, setStep] = useState(0);
  const [parsed, setParsed] = useState(null);       // initial parse
  const [refined, setRefined] = useState(null);     // after user answers applied
  const [answers, setAnswers] = useState({});
  const [proposal, setProposal] = useState('');

  function reset() {
    setStep(0);
    setParsed(null);
    setRefined(null);
    setAnswers({});
    setProposal('');
  }

  function allQuestions(p) {
    return [...(p?.missingInfo || []), ...(p?.userQuestions || [])];
  }

  async function handleAnswersSubmit(submittedAnswers) {
    const res = await fetch(`${API}/proposal/refine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parsed, answers: submittedAnswers }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Refinement failed');
    setRefined(data.parsed);
    setStep(3);
  }

  const hasQuestions = allQuestions(parsed).length > 0;
  const displayParsed = refined || parsed;

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Proposal Generator</h1>
        <p className="subtitle">Civil Engineering · Land Development</p>
      </header>

      <nav className="stepper">
        {STEPS.map((label, i) => (
          <div key={i} className={`step-item ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <span className="step-num">{i < step ? '✓' : i + 1}</span>
            <span className="step-label">{label}</span>
            {i < STEPS.length - 1 && <span className="step-line" />}
          </div>
        ))}
      </nav>

      <main className="app-main">
        {step === 0 && (
          <StepUpload
            onParsed={(data) => {
              setParsed(data);
              setRefined(null);
              setStep(1);
            }}
          />
        )}

        {step === 1 && parsed && (
          <StepReview
            parsed={parsed}
            heading="Review Extracted Scope"
            description="Claude has parsed your RFP. Review before answering questions."
            onNext={() => setStep(hasQuestions ? 2 : 3)}
            onBack={() => setStep(0)}
            nextLabel={hasQuestions ? 'Answer Questions →' : 'Confirm Scope →'}
          />
        )}

        {step === 2 && parsed && (
          <StepMissingInfo
            questions={allQuestions(parsed)}
            answers={answers}
            onAnswersChange={setAnswers}
            onNext={handleAnswersSubmit}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && displayParsed && (
          <StepReview
            parsed={displayParsed}
            heading="Confirm Updated Scope"
            description="Your answers have been applied. Review the final scope before generating the proposal."
            onNext={() => setStep(4)}
            onBack={() => setStep(hasQuestions ? 2 : 1)}
            nextLabel="Generate Proposal →"
          />
        )}

        {step === 4 && displayParsed && (
          <StepProposal
            parsed={displayParsed}
            answers={answers}
            proposal={proposal}
            onProposalReady={setProposal}
            onReset={reset}
            onBack={() => setStep(3)}
          />
        )}
      </main>
    </div>
  );
}
