const FLAG_STYLES = {
  coordinate_only: { bg: '#fffbeb', border: '#f6ad55', label: 'Coordinate only', color: '#c05621' },
  not_applicable:  { bg: '#fff5f5', border: '#fc8181', label: 'Not applicable',   color: '#c53030' },
  recommend_remove:{ bg: '#fff5f5', border: '#fc8181', label: 'Recommend remove', color: '#c53030' },
};

export default function StepReview({ parsed, onNext, onBack, heading, description, nextLabel }) {
  const hasMissing   = parsed.missingInfo?.length > 0;
  const hasQuestions = parsed.userQuestions?.length > 0;
  const totalDeliverables = parsed.phases?.reduce((n, p) => n + (p.deliverables?.length || 0), 0) || 0;
  const flaggedCount = parsed.phases?.reduce((n, p) =>
    n + (p.deliverables?.filter(d => d.flag).length || 0), 0) || 0;

  return (
    <div className="card">
      <h2>{heading || 'Review Extracted Scope'}</h2>
      <p className="description">{description || 'Claude has parsed your RFP. Review flagged items and answer questions before continuing.'}</p>

      {parsed.summary && <div className="summary-box">{parsed.summary}</div>}

      <p className="section-heading">Project Details</p>
      <div className="info-grid">
        <div className="info-field">
          <label>Project Name</label>
          <span className={!parsed.projectName ? 'missing' : ''}>{parsed.projectName || 'Not found'}</span>
        </div>
        <div className="info-field">
          <label>Client</label>
          <span className={!parsed.clientName ? 'missing' : ''}>{parsed.clientName || 'Not found'}</span>
        </div>
        <div className="info-field">
          <label>Location</label>
          <span className={!parsed.location ? 'missing' : ''}>{parsed.location || 'Not found'}</span>
        </div>
        <div className="info-field">
          <label>Deadline</label>
          <span className={!parsed.deadline ? 'missing' : ''}>{parsed.deadline || 'Not specified'}</span>
        </div>
        {parsed.constructionBudget && (
          <div className="info-field">
            <label>Construction Budget</label>
            <span>{parsed.constructionBudget}</span>
          </div>
        )}
        {parsed.consultingBudget && (
          <div className="info-field">
            <label>Consulting Budget</label>
            <span>{parsed.consultingBudget}</span>
          </div>
        )}
        {parsed.buildingSize && (
          <div className="info-field">
            <label>Building Size</label>
            <span>{parsed.buildingSize}</span>
          </div>
        )}
        {parsed.siteAreaHectares && (
          <div className="info-field">
            <label>Site Area</label>
            <span>{parsed.siteAreaHectares} ha</span>
          </div>
        )}
        {parsed.leedRequired && (
          <div className="info-field">
            <label>LEED</label>
            <span style={{ color: '#276749', fontWeight: 600 }}>Required</span>
          </div>
        )}
      </div>

      {parsed.phases?.length > 0 && (
        <>
          <p className="section-heading">
            Scope by Phase — {parsed.phases.length} phases · {totalDeliverables} deliverables
            {flaggedCount > 0 && <span style={{ color: '#c05621' }}> · {flaggedCount} flagged</span>}
          </p>
          <div className="phases-list">
            {parsed.phases.map((phase, i) => (
              <div key={i} className="phase-block">
                <div className="phase-header">
                  <span className="phase-name">{phase.name}</span>
                  {phase.estimatedStart && phase.estimatedEnd && (
                    <span className="phase-timeline">
                      {phase.estimatedStart} – {phase.estimatedEnd}
                      {phase.estimatedDurationMonths && ` (${phase.estimatedDurationMonths} mo)`}
                    </span>
                  )}
                </div>
                {phase.deliverables?.length > 0 && (
                  <ul className="deliverables-list">
                    {phase.deliverables.map((d, j) => {
                      const style = d.flag ? FLAG_STYLES[d.flag] : null;
                      return (
                        <li
                          key={j}
                          style={style ? {
                            background: style.bg,
                            borderLeft: `3px solid ${style.border}`,
                            paddingLeft: '10px',
                            marginLeft: '-14px',
                            paddingRight: '8px',
                            borderRadius: '0 4px 4px 0',
                          } : {}}
                        >
                          <span>{d.description}</span>
                          {style && (
                            <span style={{
                              display: 'inline-block',
                              marginLeft: '8px',
                              fontSize: '11px',
                              color: style.color,
                              fontWeight: 600,
                              textTransform: 'uppercase',
                            }}>
                              [{style.label}]
                            </span>
                          )}
                          {d.flagNote && (
                            <div style={{ fontSize: '11px', color: '#718096', marginTop: '2px' }}>
                              {d.flagNote}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {parsed.assumptions?.length > 0 && (
        <>
          <p className="section-heading">Standard Assumptions ({parsed.assumptions.length})</p>
          <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#4a5568' }}>
            {parsed.assumptions.map((a, i) => <li key={i} style={{ marginBottom: '4px' }}>{a}</li>)}
          </ul>
        </>
      )}

      {hasMissing && (
        <>
          <p className="section-heading" style={{ color: '#c05621' }}>
            Missing from RFP ({parsed.missingInfo.length})
          </p>
          <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#744210' }}>
            {parsed.missingInfo.map((q, i) => <li key={i} style={{ marginBottom: '6px' }}>{q}</li>)}
          </ul>
        </>
      )}

      {hasQuestions && (
        <>
          <p className="section-heading" style={{ color: '#2b6cb0' }}>
            Questions for You ({parsed.userQuestions.length})
          </p>
          <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#2c5282' }}>
            {parsed.userQuestions.map((q, i) => <li key={i} style={{ marginBottom: '6px' }}>{q}</li>)}
          </ul>
          <p style={{ fontSize: '12px', color: '#718096', marginTop: '8px' }}>
            You'll answer these on the next screen.
          </p>
        </>
      )}

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext}>
          {nextLabel || ((hasMissing || hasQuestions) ? 'Answer Questions →' : 'Generate Proposal →')}
        </button>
      </div>
    </div>
  );
}
