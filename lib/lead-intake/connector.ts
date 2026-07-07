import type { LeadIntakeContract } from './contract'

/**
 * Lead Intake Connector.
 *
 * This is the ONLY place in the codebase allowed to know how a lead
 * actually gets delivered. The website and the API route only ever build
 * a LeadIntakeContract and call submitLead() — neither knows or cares
 * whether the destination is n8n, BSQ AIMP's own API, Salesforce, HubSpot,
 * or anything else.
 *
 * Today: forwards to n8n via N8N_WEBHOOK_RECRUITMENT_LEADS, which in turn
 * writes to BSQ AIMP. When BSQ AIMP exposes a direct intake API, swap the
 * implementation below — the contract, the route handler, and the
 * frontend all stay unchanged.
 */
export async function submitLead(
  contract: LeadIntakeContract
): Promise<{ ok: boolean; forwarded: boolean }> {
  return submitViaN8n(contract)
}

async function submitViaN8n(
  contract: LeadIntakeContract
): Promise<{ ok: boolean; forwarded: boolean }> {
  const webhookUrl = process.env.N8N_WEBHOOK_RECRUITMENT_LEADS

  if (!webhookUrl) {
    console.warn('[lead-intake] N8N_WEBHOOK_RECRUITMENT_LEADS is not set. Lead not forwarded.')
    return { ok: true, forwarded: false }
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contract),
    })

    if (!res.ok) {
      console.error('[lead-intake] n8n returned', res.status)
      return { ok: true, forwarded: false }
    }

    return { ok: true, forwarded: true }
  } catch (err) {
    console.error('[lead-intake] Connector delivery failed:', err)
    return { ok: true, forwarded: false }
  }
}
