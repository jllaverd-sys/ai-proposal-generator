import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, WidthType, HeadingLevel, BorderStyle, convertInchesToTwip,
  ShadingType,
} from 'docx';

// ── Helpers ───────────────────────────────────────────────────────────────────

const FONT = 'Calibri';
const SIZE_BODY = 20;     // 10pt in half-points
const SIZE_SMALL = 18;    // 9pt
const NAVY = '0A2B5B';
const GRAY = '595959';

function run(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: SIZE_BODY, ...opts });
}

function bold(text, opts = {}) {
  return run(text, { bold: true, ...opts });
}

function para(content, opts = {}) {
  const children = typeof content === 'string'
    ? [run(content)]
    : Array.isArray(content)
      ? content
      : [content];
  return new Paragraph({ children, spacing: { after: 80 }, ...opts });
}

function spacer(after = 120) {
  return new Paragraph({ text: '', spacing: { after } });
}

function sectionHeading(text) {
  return new Paragraph({
    children: [run(text, { bold: true, color: NAVY, size: 22, allCaps: true })],
    spacing: { before: 280, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 4 } },
  });
}

function subHeading(text) {
  return new Paragraph({
    children: [run(text, { bold: true, size: 21 })],
    spacing: { before: 200, after: 60 },
  });
}

function bullet(text) {
  return new Paragraph({
    children: [run(text)],
    bullet: { level: 0 },
    spacing: { after: 40 },
  });
}

function cell(content, opts = {}) {
  const children = typeof content === 'string'
    ? [para([run(content)])]
    : [para(content)];
  return new TableCell({
    children,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    ...opts,
  });
}

function headerCell(text) {
  return new TableCell({
    children: [new Paragraph({ children: [bold(text, { color: 'FFFFFF', size: 20 })], spacing: { after: 0 } })],
    shading: { type: ShadingType.SOLID, fill: NAVY },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
  });
}

// ── Boilerplate blocks ────────────────────────────────────────────────────────

const WATT_ABOUT = [
  'WATT Consulting Group (WATT) is a multi-disciplinary engineering firm serving private and public sector clients across Western Canada. Since 1983 we have contributed to the advancement of best practices in the creation and enhancement of the built environments we depend on every day.',
  'We work collaboratively with our clients, and with each other, from regional offices established throughout British Columbia and Alberta. Clients benefit from our advanced local knowledge, industry expertise and genuine passion for our local communities.',
  'We are locally invested and passionate about the work we do in our own backyards.',
  'Our vision is to be a recognized leader in the creation of vibrant + livable communities.',
];

const CIVIL_ABOUT = 'Our Civil Engineering Division provides a full spectrum of municipal engineering services focusing on land development and municipal infrastructure. From feasibility studies, through to planning, design approvals and construction we remain focused on performance, efficiency and client satisfaction. We effectively overcome such project issues as tight and complex scheduling, resource coordination, budget constraints, contract administration, design complications and approval-related negotiations.';

const TEAM_INTRO = 'Our professional team is composed of individuals who are committed to the success of each other, our clients, and our communities. We are united in our values. We engage the right people with the right experience, skills and resources to safely deliver the best, sustainable solutions.';

const TEAM_MEMBERS = [
  {
    name: 'Tibor Tuss, P.L.(Eng.)',
    role: 'Regional Lead, Civil Engineering',
    bio: 'Tibor Tuss brings over 15 years of experience in land development to his role in civil design. His recent experience includes some of Calgary\'s most progressive projects including cultural and heritage inner city redevelopments, master-planned residential and mixed-use developments, and sites requiring creative stormwater management solutions.',
  },
  {
    name: 'Zach Bridger, P.Eng.',
    role: 'Project Manager, Civil Engineering',
    bio: 'Zach brings over 8 years of experience, excelling in land development and civil engineering while working as a dynamic Project Manager at Watt Consulting Group. Zach is a proven problem-solver skilled in project coordination and detail-oriented design work, including managing tendering processes, stormwater management design and implementation, sanitary servicing studies, fire flow letters, and utility inspections.',
  },
  {
    name: 'Jeremy Laverdiere, E.I.T.',
    role: 'Civil Engineer-in-Training, Civil Engineering',
    bio: 'Jeremy is a Civil E.I.T. with 4 years of experience in land development and civil engineering. Jeremy is a proven problem-solver skilled in project management, due-diligence studies, sanitary servicing studies, stormwater management and civil engineering design. His experience in civil/municipal engineering ranges from private residential and multi-family projects to larger scale subdivisions.',
  },
];

const CLOSING = 'We trust this proposal will meet your requirements and we look forward to working with you on this project. We are happy to receive your questions or requests for additional information.';

const FEE_NOTE = 'All fees are exclusive of GST. Fees are valid through December 31, ' + new Date().getFullYear() + '. Disbursements will be billed in accordance with the terms and conditions.';

// ── Main builder ─────────────────────────────────────────────────────────────

export async function buildProposalDoc(parsed, contactInfo) {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const year = today.getFullYear();

  const projectName = parsed.projectName || 'Project';
  const rfpNumber = parsed.rfpNumber || '';
  const rfpRef = rfpNumber
    ? `${projectName} – RFP No. ${rfpNumber}`
    : projectName;

  const children = [];

  // ── Recipient block ──────────────────────────────────────────────────────
  if (contactInfo.company) {
    children.push(para([bold(contactInfo.company)]));
  }
  if (contactInfo.address) {
    children.push(para(contactInfo.address, { spacing: { after: 40 } }));
  }
  const cityLine = [contactInfo.city, contactInfo.province, contactInfo.postal]
    .filter(Boolean).join(', ');
  if (cityLine) {
    children.push(para(cityLine, { spacing: { after: 120 } }));
  }

  if (contactInfo.attn) {
    const attnTitle = contactInfo.title ? `${contactInfo.attn}, ${contactInfo.title}` : contactInfo.attn;
    children.push(para([run('Attn:\t'), run(attnTitle)]));
    children.push(spacer(80));
  }

  children.push(para(`Re: ${rfpRef}`));
  children.push(spacer(80));
  children.push(para(dateStr));
  children.push(para(`Our File No: ${year}-XX`));
  children.push(spacer(160));

  // ── Opening ──────────────────────────────────────────────────────────────
  children.push(para(
    `Thank you for the opportunity to provide a proposal for the Civil Engineering services associated with the ${projectName} project.`
  ));
  children.push(para('The following outlines our company profile, understanding of the project, our proposed team, and our work plan and fees.'));
  children.push(spacer());

  // ── WE ARE WATT ──────────────────────────────────────────────────────────
  children.push(sectionHeading('WE ARE WATT'));
  for (const line of WATT_ABOUT) {
    children.push(para(line));
  }
  children.push(spacer(80));
  children.push(subHeading('Civil Engineering'));
  children.push(para(CIVIL_ABOUT));
  children.push(spacer());

  // ── PROJECT UNDERSTANDING ─────────────────────────────────────────────────
  children.push(sectionHeading('PROJECT UNDERSTANDING'));
  const understanding = parsed.summary ||
    `Per the information provided, we understand that the City of Calgary is planning ${projectName}` +
    (parsed.location ? ` located in ${parsed.location}` : '') + '.';
  children.push(para(understanding));
  children.push(spacer());

  // ── SCOPE OF WORK ─────────────────────────────────────────────────────────
  children.push(sectionHeading('SCOPE OF WORK'));
  children.push(para('Based on the above noted information, our Team has developed the following scope of work:'));
  children.push(spacer(80));

  if (parsed.phases?.length > 0) {
    for (const phase of parsed.phases) {
      const activeDeliverables = (phase.deliverables || []).filter(
        (d) => d.flag !== 'not_applicable' && d.flag !== 'recommend_remove'
      );
      if (activeDeliverables.length === 0) continue;

      children.push(subHeading(phase.name));

      for (const d of activeDeliverables) {
        children.push(bullet(d.description));
      }
      children.push(spacer(80));
    }
  }

  // ── ASSUMPTIONS ──────────────────────────────────────────────────────────
  children.push(sectionHeading('Assumptions'));
  children.push(para(
    'WATT has assumed the following services are not included in this proposal. Should they be required we would be pleased to provide fee estimates or solicit quotes from specialist subconsultants to complete the associated scope of work:'
  ));
  children.push(spacer(80));

  const assumptions = parsed.assumptions?.length > 0
    ? parsed.assumptions
    : [
        'All permit and application fees.',
        'Development Permit submission.',
        'Existing utility information will be collected from City of Calgary record plans.',
        'As-built survey.',
        'ESC Inspections.',
        'Shallow utility design and engagement.',
        'Landscape design and irrigation.',
        'Building permit submissions and approvals.',
        'Co-ordination of other project team disciplines.',
        'Public engagement or attendance at stakeholder events.',
      ];

  for (const a of assumptions) {
    children.push(bullet(a));
  }
  children.push(spacer());

  // ── OUR TEAM ─────────────────────────────────────────────────────────────
  children.push(sectionHeading('Our team'));
  children.push(para(TEAM_INTRO));
  children.push(spacer(80));

  for (const member of TEAM_MEMBERS) {
    children.push(subHeading(member.name));
    children.push(para([run(member.role, { bold: true, italics: true })]));
    children.push(para(member.bio));
    children.push(spacer(80));
  }

  // ── FEES ──────────────────────────────────────────────────────────────────
  children.push(sectionHeading('FEES'));
  children.push(para('Based on our experience on similar projects, we have prepared a fee estimate for your consideration as summarized below.'));
  children.push(spacer(80));

  const phaseNames = (parsed.phases || [])
    .filter((p) => {
      const active = (p.deliverables || []).filter(
        (d) => d.flag !== 'not_applicable' && d.flag !== 'recommend_remove'
      );
      return active.length > 0;
    })
    .map((p) => p.name);

  const feeTableRows = [
    new TableRow({
      children: [headerCell('Service'), headerCell('Fee Estimate')],
      tableHeader: true,
    }),
    ...phaseNames.map(
      (name) =>
        new TableRow({
          children: [
            cell(name, { width: { size: 75, type: WidthType.PERCENTAGE } }),
            cell('TBD', { width: { size: 25, type: WidthType.PERCENTAGE } }),
          ],
        })
    ),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [bold('Total – Civil Engineering')], spacing: { after: 0 } })],
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          shading: { type: ShadingType.SOLID, fill: 'E8ECF2' },
        }),
        new TableCell({
          children: [new Paragraph({ children: [bold('TBD')], spacing: { after: 0 } })],
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          shading: { type: ShadingType.SOLID, fill: 'E8ECF2' },
        }),
      ],
    }),
  ];

  children.push(
    new Table({
      rows: feeTableRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    })
  );
  children.push(spacer(80));
  children.push(para(FEE_NOTE));
  children.push(spacer());

  // ── Closing ───────────────────────────────────────────────────────────────
  children.push(para(CLOSING));
  children.push(spacer(120));
  children.push(para('Sincerely,'));
  children.push(para([bold('WATT Consulting Group')]));
  children.push(spacer(160));
  children.push(para([bold('Jeremy Laverdiere, E.I.T.')]));
  children.push(para('Civil Engineer-in-Training, Land Development'));
  children.push(para([
    run('C  403.463.6609', { size: SIZE_SMALL }),
    run('   |   ', { size: SIZE_SMALL, color: GRAY }),
    run('E  jlaverdiere@wattconsultinggroup.com', { size: SIZE_SMALL }),
  ]));

  // ── Document ─────────────────────────────────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE_BODY },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.25),
            },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
