import express from 'express';
import multer from 'multer';
import { extractTextFromFile } from '../utils/parseFile.js';
import { extractRelevantText } from '../utils/extractRelevantText.js';
import { refineScope } from '../utils/refineScope.js';
import { buildProposalDoc } from '../utils/buildProposalDoc.js';
import { parseRFP, generateProposal, costProposal } from '../services/claudeService.js';

export const proposalRouter = express.Router();

// In-memory job store — fine for single-instance free tier
const jobs = new Map();

function createJob() {
  const id = Math.random().toString(36).slice(2, 10);
  jobs.set(id, { status: 'pending' });
  // Auto-clean after 10 minutes
  setTimeout(() => jobs.delete(id), 10 * 60 * 1000);
  return id;
}

// GET /api/proposal/job/:id  — poll for async job result
proposalRouter.get('/job/:id', (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are supported'));
    }
  },
});

// POST /api/proposal/parse  — upload RFP, returns jobId immediately
proposalRouter.post('/parse', upload.single('rfp'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const jobId = createJob();
  res.json({ jobId });  // respond immediately — client polls /job/:id

  // Run Claude in background
  (async () => {
    try {
      console.log(`Parsing RFP: ${req.file.originalname} (${req.file.mimetype})`);
      const text = await extractTextFromFile(req.file.buffer, req.file.mimetype);

      if (!text || text.trim().length < 50) {
        jobs.set(jobId, { status: 'error', error: 'Could not extract readable text from the file' });
        return;
      }

      const relevantText = extractRelevantText(text);
      console.log(`Sending ${relevantText.length} characters to Claude...`);
      const parsed = await parseRFP(relevantText);
      jobs.set(jobId, { status: 'done', parsed });
      console.log(`Parse job ${jobId} complete`);
    } catch (err) {
      console.error('Parse error:', err.message);
      jobs.set(jobId, { status: 'error', error: err.message });
    }
  })();
});

// POST /api/proposal/refine  — apply user answers to update scope (no Claude call)
proposalRouter.post('/refine', (req, res) => {
  try {
    const { parsed, answers } = req.body;
    if (!parsed) return res.status(400).json({ error: 'Missing parsed data' });
    const refined = refineScope(parsed, answers || {});
    res.json({ success: true, parsed: refined });
  } catch (err) {
    console.error('Refine error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/proposal/document  — generate a filled Word (.docx) proposal
proposalRouter.post('/document', async (req, res) => {
  try {
    const { parsed, contactInfo } = req.body;
    if (!parsed) return res.status(400).json({ error: 'Missing parsed data' });

    const buffer = await buildProposalDoc(parsed, contactInfo || {});
    const filename = `Proposal_${(parsed.projectName || 'Project').replace(/[^a-zA-Z0-9]/g, '_')}.docx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error('Document error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/proposal/cost  — apply costing rules to parsed RFP, return structured fee estimate
proposalRouter.post('/cost', async (req, res) => {
  try {
    const { parsed } = req.body;
    if (!parsed) return res.status(400).json({ error: 'Missing parsed data' });

    console.log('Calculating fees...');
    const costing = await costProposal(parsed);
    res.json({ success: true, costing });
  } catch (err) {
    console.error('Cost error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/proposal/generate  — returns jobId immediately
proposalRouter.post('/generate', async (req, res) => {
  const { parsed, answers } = req.body;
  if (!parsed) return res.status(400).json({ error: 'Missing parsed RFP data' });

  const jobId = createJob();
  res.json({ jobId });

  (async () => {
    try {
      console.log('Generating proposal...');
      const proposal = await generateProposal(parsed, answers);
      jobs.set(jobId, { status: 'done', proposal });
      console.log(`Generate job ${jobId} complete`);
    } catch (err) {
      console.error('Generate error:', err.message);
      jobs.set(jobId, { status: 'error', error: err.message });
    }
  })();
});
