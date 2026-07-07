import { NextRequest, NextResponse } from 'next/server'
import { sanitize } from '@/lib/api-guard'
import { TENANT_CONFIG } from '@/lib/lead-intake/tenant-config'
import { deriveChannel } from '@/lib/lead-intake/channel'
import { submitLead } from '@/lib/lead-intake/connector'
import type { LeadIntakeContract, RecruitmentIntakeRequest } from '@/lib/lead-intake/contract'

/** Filipino mobile numbers are typically typed with a leading 0
 *  (e.g. "09171234567"). E.164 drops it: "+639171234567". */
function toE164PH(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '').replace(/^0+/, '')
  return `+63${digits}`
}

export async function POST(req: NextRequest) {
  try {
    const body: RecruitmentIntakeRequest = await req.json()

    const firstName = sanitize(body.firstName, 60)
    const lastName = sanitize(body.lastName, 60)
    const phone = sanitize(body.phone, 20)
    const location = sanitize(body.location, 60)
    const roleInterest = sanitize(body.roleInterest, 60) || undefined

    if (!firstName || !lastName || !phone || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const branch = sanitize(body.branch, 100) || TENANT_CONFIG.defaultAttribution.branch
    const recruiter = sanitize(body.recruiter, 100) || TENANT_CONFIG.defaultAttribution.recruiter
    const unitManager = sanitize(body.unitManager, 100) || TENANT_CONFIG.defaultAttribution.unitManager
    const agentCode = sanitize(body.agentCode, 30) || TENANT_CONFIG.defaultAttribution.agentCode

    const utmSource = sanitize(body.utmSource, 64) || undefined
    const utmMedium = sanitize(body.utmMedium, 64) || undefined
    const referrer = sanitize(body.referrer, 500) || undefined

    const contract: LeadIntakeContract = {
      tenant: TENANT_CONFIG.tenant,
      website: TENANT_CONFIG.website,
      leadSource: 'recruitment_landing_page',

      channel: deriveChannel(utmSource, utmMedium, referrer),
      campaign: sanitize(body.campaign, 100) || undefined,
      landingPageUrl: sanitize(body.landingPageUrl, 500) || undefined,
      referrer,
      utm: {
        source: utmSource,
        medium: utmMedium,
        campaign: sanitize(body.utmCampaign, 100) || undefined,
        term: sanitize(body.utmTerm, 100) || undefined,
        content: sanitize(body.utmContent, 100) || undefined,
      },

      attribution: { branch, recruiter, unitManager, agentCode },

      event: body.event
        ? {
            eventId: sanitize(body.event.eventId, 100),
            eventName: sanitize(body.event.eventName, 150),
            eventDate: sanitize(body.event.eventDate, 100),
            venue: sanitize(body.event.venue, 150),
          }
        : undefined,

      prospect: { firstName, lastName, phone: toE164PH(phone), location, roleInterest },

      leadId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    }

    const result = await submitLead(contract)
    return NextResponse.json({ success: result.ok, forwarded: result.forwarded })
  } catch (err) {
    console.error('[recruitment-lead] Unexpected error:', err)
    return NextResponse.json({ success: true, forwarded: false })
  }
}
