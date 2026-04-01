/**
 * BSQ Financial Assessment — HTML Email Template Generator
 * ─────────────────────────────────────────────────────────
 * Generates a professional, personalized HTML email with assessment results
 * and recommended products. Inline-styled for maximum email client compatibility.
 */

const SITE_URL = 'https://www.prubsq.com'
const BRAND_RED = '#D92D20'
const BRAND_DARK = '#1a1a1a'

/* ─── Product visual config ─────────────────────────────────────────── */
const PRODUCT_CONFIG: Record<string, { color: string; image?: string; icon: string }> = {
  'prulifetime-income': {
    color:  '#16a34a',
    image:  `${SITE_URL}/images/products/prulifetime-income.jpg`,
    icon:   '💰',
  },
  'pru-million-protect': {
    color: '#2563eb',
    icon:  '🛡️',
  },
  'elite-series': {
    color: '#d97706',
    icon:  '⭐',
  },
  'prulink-assurance-account-plus': {
    color: '#7c3aed',
    icon:  '📈',
  },
  'prulove-for-life': {
    color: '#db2777',
    icon:  '❤️',
  },
}

/* ─── Risk level config ─────────────────────────────────────────────── */
const RISK_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  Low:      { color: '#15803d', bg: '#dcfce7', label: 'Well Protected'  },
  Moderate: { color: '#b45309', bg: '#fef3c7', label: 'Moderate Risk'   },
  High:     { color: '#c2410c', bg: '#ffedd5', label: 'High Risk'       },
  Critical: { color: '#b91c1c', bg: '#fee2e2', label: 'Critical Risk'   },
}

interface Recommendation {
  name:     string
  slug:     string
  reason:   string
  priority: number
  payTerm?: number
}

interface EmailData {
  name:            string
  score:           number
  statusLabel:     string
  riskLevel:       string
  gaps:            string[]
  recommendations: Recommendation[]
  agentName?:      string
  agentPhone?:     string
  agentMessenger?: string
}

function productCard(rec: Recommendation): string {
  const cfg     = PRODUCT_CONFIG[rec.slug] ?? { color: BRAND_RED, icon: '📋' }
  const display = rec.payTerm ? `${rec.name} (${rec.payTerm}-Pay)` : rec.name
  const imgHtml = cfg.image
    ? `<img src="${cfg.image}" alt="${rec.name}" width="100%" style="display:block;width:100%;height:160px;object-fit:cover;border-radius:12px 12px 0 0;" />`
    : `<div style="width:100%;height:120px;background:linear-gradient(135deg,${cfg.color}22,${cfg.color}44);border-radius:12px 12px 0 0;display:flex;align-items:center;justify-content:center;font-size:48px;">${cfg.icon}</div>`

  return `
    <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);margin-bottom:16px;">
      ${imgHtml}
      <div style="padding:16px;">
        <div style="display:inline-block;background:${cfg.color}22;color:${cfg.color};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;margin-bottom:8px;letter-spacing:0.05em;text-transform:uppercase;">
          ${rec.priority === 1 ? '⭐ Top Recommendation' : `Recommendation #${rec.priority}`}
        </div>
        <h3 style="margin:0 0 8px;font-size:16px;font-weight:700;color:${BRAND_DARK};">${display}</h3>
        <p style="margin:0 0 14px;font-size:13px;color:#555;line-height:1.6;">${rec.reason}</p>
        <a href="${SITE_URL}?product=${rec.slug}" style="display:inline-block;background:${BRAND_RED};color:#fff;font-size:13px;font-weight:600;padding:8px 18px;border-radius:8px;text-decoration:none;">
          Learn More →
        </a>
      </div>
    </div>
  `
}

export function generateAssessmentEmail(data: EmailData): string {
  const risk      = RISK_CONFIG[data.riskLevel] ?? RISK_CONFIG['Moderate']
  const firstName = data.name.split(' ')[0]
  const products  = [...data.recommendations]
    .sort((a, b) => a.priority - b.priority)
    .map(productCard)
    .join('')

  const gapsHtml = data.gaps.length
    ? data.gaps.map(g => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
            <span style="color:${BRAND_RED};margin-right:8px;">⚠</span>
            <span style="font-size:13px;color:#333;">${g}</span>
          </td>
        </tr>`).join('')
    : `<tr><td style="padding:8px 0;font-size:13px;color:#555;">No critical gaps detected. Great job!</td></tr>`

  const agentSection = (data.agentName || data.agentPhone || data.agentMessenger) ? `
    <div style="background:#fff8f8;border:1px solid #ffd5d5;border-radius:12px;padding:20px;margin-top:24px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.05em;">Your Financial Advisor</p>
      <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:${BRAND_DARK};">${data.agentName ?? 'BSQ Financial Advisor'}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        ${data.agentMessenger ? `<a href="${data.agentMessenger}" style="background:${BRAND_RED};color:#fff;font-size:13px;font-weight:600;padding:8px 16px;border-radius:8px;text-decoration:none;">💬 Message on Messenger</a>` : ''}
        ${data.agentPhone ? `<a href="tel:${data.agentPhone}" style="background:#1a1a1a;color:#fff;font-size:13px;font-weight:600;padding:8px 16px;border-radius:8px;text-decoration:none;">📞 Call ${data.agentPhone}</a>` : ''}
      </div>
    </div>
  ` : `
    <div style="text-align:center;margin-top:24px;">
      <a href="${SITE_URL}" style="background:${BRAND_RED};color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;display:inline-block;">
        Talk to a BSQ Advisor
      </a>
    </div>
  `

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your BSQ Financial Assessment Results</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND_DARK};border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
            <img src="${SITE_URL}/images/bsq-logo.png" alt="BSQ" height="48" style="margin-bottom:12px;" />
            <p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Brilliant Star Quartz · PRU Life UK</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;padding:32px;">

            <!-- Greeting -->
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${BRAND_DARK};">
              Hi ${firstName}! 👋
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.6;">
              Here are your personalized financial assessment results. Our AI analyzed your profile and identified the best protection solutions for you.
            </p>

            <!-- Score card -->
            <div style="background:${risk.bg};border:1px solid ${risk.color}33;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:${risk.color};text-transform:uppercase;letter-spacing:0.05em;">Your Financial Health Score</p>
              <div style="font-size:52px;font-weight:900;color:${risk.color};line-height:1;">${data.score}</div>
              <div style="display:inline-block;background:${risk.color};color:#fff;font-size:12px;font-weight:700;padding:4px 14px;border-radius:20px;margin-top:8px;">
                ${risk.label}
              </div>
            </div>

            <!-- Gaps -->
            <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:${BRAND_DARK};">
              ⚠️ Protection Gaps Identified
            </h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              ${gapsHtml}
            </table>

            <!-- Recommendations -->
            <h2 style="margin:0 0 16px;font-size:16px;font-weight:700;color:${BRAND_DARK};">
              ✅ Recommended Solutions For You
            </h2>
            ${products}

            <!-- Agent / CTA -->
            ${agentSection}

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0 0 4px;font-size:12px;color:#999;">
              This assessment was generated by BSQ AI Financial Tool · <a href="${SITE_URL}" style="color:${BRAND_RED};text-decoration:none;">www.prubsq.com</a>
            </p>
            <p style="margin:0;font-size:11px;color:#bbb;">
              PRU Life Insurance Corporation of UK · Regulated by the Insurance Commission of the Philippines
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`
}
