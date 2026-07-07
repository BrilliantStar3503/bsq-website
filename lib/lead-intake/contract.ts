/**
 * Lead Intake Contract — BSQ AIMP architecture
 *
 * This is the STABLE shape every tenant website submits a lead in. It never
 * changes based on which connector (n8n today, BSQ AIMP API tomorrow,
 * Salesforce, HubSpot, ...) receives it — see connector.ts for the only
 * place that's allowed to know about the destination.
 *
 * Three distinct identities travel with every lead (do not conflate them):
 *   - tenant     WHO owns the lead (e.g. 'bsq', future 'abc-agency')
 *   - website    WHICH branded portal captured it (e.g. 'prubsq.com')
 *   - leadSource WHICH feature generated it (e.g. 'recruitment_landing_page')
 *
 * The website only ever builds this shape and hands it to submitLead().
 * It must never encode classification, CRM workflow, or recruiter
 * assignment — those are BSQ AIMP's job, decided after interview.
 */

export interface LeadIntakeContract {
  tenant: string
  website: string
  leadSource: string

  channel: string
  campaign?: string
  landingPageUrl?: string
  referrer?: string
  utm: {
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  }

  /** BSQ-specific attribution values — sourced from QR params or tenant defaults, never hardcoded in logic */
  attribution: {
    branch?: string
    recruiter?: string
    unitManager?: string
    agentCode?: string
  }

  /** Marketing attribution only — explains why the lead exists, never drives business logic */
  event?: {
    eventId: string
    eventName: string
    eventDate: string
    venue: string
  }

  prospect: {
    firstName: string
    lastName: string
    phone: string
    location: string
    /** Self-reported, non-binding — real classification happens after interview in BSQ AIMP */
    roleInterest?: string
  }

  leadId: string
  timestamp: string
}

/** What the website's frontend actually sends — the server stamps identity
 *  (tenant/website/leadSource/leadId/timestamp) and fills attribution
 *  defaults, so the client never needs to know those values. */
export interface RecruitmentIntakeRequest {
  firstName: string
  lastName: string
  phone: string
  location: string
  roleInterest?: string

  branch?: string
  recruiter?: string
  unitManager?: string
  agentCode?: string

  event?: {
    eventId: string
    eventName: string
    eventDate: string
    venue: string
  }

  campaign?: string
  landingPageUrl?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
}
