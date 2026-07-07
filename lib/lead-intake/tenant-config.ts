/**
 * Tenant configuration — server-only.
 *
 * Every BSQ-specific value the intake pipeline needs lives here, sourced
 * from env vars. Nothing in contract.ts, channel.ts, connector.ts, or the
 * route handler should contain a hardcoded tenant name, recruiter, branch,
 * or agent code — those all flow through this one module. A future tenant
 * (ABC Agency, XYZ Financial) is a new deployment with different env vars,
 * not a code fork.
 */
export const TENANT_CONFIG = {
  tenant: process.env.TENANT_ID ?? 'bsq',
  website: process.env.WEBSITE_DOMAIN ?? 'prubsq.com',

  /** Applied only when a lead arrives without these attribution values
   *  (i.e. no QR/referral params were present). */
  defaultAttribution: {
    branch: process.env.DEFAULT_BRANCH ?? 'Brilliant Star Quartz',
    recruiter: process.env.DEFAULT_RECRUITER ?? 'Christopher Garcia',
    unitManager: process.env.DEFAULT_UNIT_MANAGER ?? 'Christopher Garcia',
    agentCode: process.env.DEFAULT_AGENT_CODE ?? '70003503',
  },
} as const
