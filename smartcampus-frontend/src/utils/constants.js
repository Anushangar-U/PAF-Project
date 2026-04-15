/* ═══════════════════════════════════════════════════════════
   constants.js  –  Single source of truth for all enumerations,
   allowed transitions, demo seed data, and role definitions.
═══════════════════════════════════════════════════════════ */

/* ── Ticket Status ── */
export const STATUS = {
  OPEN:        'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED:    'RESOLVED',
  CLOSED:      'CLOSED',
  REJECTED:    'REJECTED',
};

export const STATUS_LABELS = {
  OPEN:        '🔵 Open',
  IN_PROGRESS: '🟡 In Progress',
  RESOLVED:    '🟢 Resolved',
  CLOSED:      '⚫ Closed',
  REJECTED:    '🔴 Rejected',
};

/** Workflow in order (used by progress indicator) */
export const WORKFLOW_STEPS = [
  STATUS.OPEN,
  STATUS.IN_PROGRESS,
  STATUS.RESOLVED,
  STATUS.CLOSED,
];

/** Valid next statuses from each current status */
export const ALLOWED_TRANSITIONS = {
  [STATUS.OPEN]:        [STATUS.IN_PROGRESS, STATUS.REJECTED],
  [STATUS.IN_PROGRESS]: [STATUS.RESOLVED, STATUS.OPEN],
  [STATUS.RESOLVED]:    [STATUS.CLOSED, STATUS.IN_PROGRESS],
  [STATUS.CLOSED]:      [],
  [STATUS.REJECTED]:    [],
};

/* ── Priority ── */
export const PRIORITY = {
  HIGH:   'HIGH',
  MEDIUM: 'MEDIUM',
  LOW:    'LOW',
};

export const PRIORITY_ICONS = {
  HIGH:   '🔴',
  MEDIUM: '🟡',
  LOW:    '🟢',
};

/* ── Category ── */
export const CATEGORIES = [
  { value: 'ELECTRICAL',   label: '⚡ Electrical' },
  { value: 'PLUMBING',     label: '🔧 Plumbing' },
  { value: 'IT_EQUIPMENT', label: '💻 IT Equipment' },
  { value: 'HVAC',         label: '❄️ HVAC / AC' },
  { value: 'STRUCTURAL',   label: '🏗️ Structural' },
  { value: 'SAFETY',       label: '⚠️ Safety Hazard' },
  { value: 'OTHER',        label: '📌 Other' },
];

export const CATEGORY_ICONS = {
  ELECTRICAL:   '⚡',
  PLUMBING:     '🔧',
  IT_EQUIPMENT: '💻',
  HVAC:         '❄️',
  STRUCTURAL:   '🏗️',
  SAFETY:       '⚠️',
  OTHER:        '📌',
};

/* ── User Roles ── */
export const ROLES = {
  USER:       'USER',
  TECHNICIAN: 'TECHNICIAN',
  ADMIN:      'ADMIN',
};

/* ── Demo Users (used when no backend auth) ── */
export const DEMO_USERS = [
  { id: 1, name: 'Ali Hassan',  email: 'ali@campus.edu',   role: ROLES.USER,       avatar: 'AH' },
  { id: 2, name: 'Sara Khan',   email: 'sara@campus.edu',  role: ROLES.TECHNICIAN, avatar: 'SK' },
  { id: 3, name: 'Admin User',  email: 'admin@campus.edu', role: ROLES.ADMIN,      avatar: 'AD' },
];

/* ── Demo Seed Tickets ── */
export const DEMO_TICKETS = [
  {
    id: 1,
    title: 'AC not working in Lab 4',
    description: 'The air conditioning unit in Engineering Lab 4 has been non-functional since Monday. Students and staff are unable to work comfortably.',
    location: 'Engineering Lab 4',
    category: 'HVAC',
    priority: PRIORITY.HIGH,
    status: STATUS.OPEN,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    reportedBy: { name: 'Ali Hassan', role: ROLES.USER },
    comments: [],
    attachmentUrls: [],
  },
  {
    id: 2,
    title: 'Projector bulb burnt out',
    description: 'The projector in Auditorium B has a blown bulb, making it unusable for lectures.',
    location: 'Auditorium B',
    category: 'IT_EQUIPMENT',
    priority: PRIORITY.MEDIUM,
    status: STATUS.IN_PROGRESS,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    reportedBy: { name: 'Sara Malik', role: ROLES.USER },
    assignedTechnician: 'Imran Tech',
    comments: [
      { id: 101, authorName: 'Imran Tech', authorRole: ROLES.TECHNICIAN, content: 'Replacement bulb ordered, ETA 2 days.', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    ],
    attachmentUrls: [],
  },
  {
    id: 3,
    title: 'Water leak near canteen sink',
    description: 'A slow leak under the kitchen sink has caused water to pool on the floor creating a slip hazard.',
    location: 'Main Canteen',
    category: 'PLUMBING',
    priority: PRIORITY.HIGH,
    status: STATUS.RESOLVED,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    reportedBy: { name: 'Bilal Ahmed', role: ROLES.USER },
    assignedTechnician: 'Usman Plumber',
    resolutionNotes: 'Washer replaced and pipe re-sealed. Area declared safe.',
    comments: [],
    attachmentUrls: [],
  },
  {
    id: 4,
    title: 'Broken door lock – Room 201',
    description: 'The electronic lock on Room 201 is malfunctioning and fails to unlock with valid access cards.',
    location: 'Room 201',
    category: 'STRUCTURAL',
    priority: PRIORITY.MEDIUM,
    status: STATUS.OPEN,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    reportedBy: { name: 'Hira Baig', role: ROLES.USER },
    comments: [],
    attachmentUrls: [],
  },
  {
    id: 5,
    title: 'Power socket sparking in Library',
    description: 'A wall socket near reading table 5 in the Central Library sparked when a laptop was plugged in.',
    location: 'Central Library',
    category: 'ELECTRICAL',
    priority: PRIORITY.HIGH,
    status: STATUS.CLOSED,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    reportedBy: { name: 'Farhan Qureshi', role: ROLES.USER },
    resolutionNotes: 'Socket replaced by maintenance team. Area declared safe.',
    comments: [],
    attachmentUrls: [],
  },
];

/* ── Misc ── */
export const MAX_ATTACHMENTS = 3;
export const BACKEND_URL     = 'http://localhost:9090';
export const API_BASE_URL    = `${BACKEND_URL}/api`;
