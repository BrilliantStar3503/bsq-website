import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Brilliant Star Quartz (BSQ)',
  description:
    'Learn how Brilliant Star Quartz (BSQ) collects, uses, and protects your personal information in compliance with the Data Privacy Act of 2012 (RA 10173).',
}

const SECTIONS = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: (
      <>
        <p>
          When you interact with our website, Facebook Page, Messenger chatbot,
          or financial assessment tool, we may collect the following information:
        </p>
        <ul>
          <li>Your name and publicly available profile information</li>
          <li>Messages, inquiries, and responses you submit to us</li>
          <li>Contact details you voluntarily provide — such as your email address or mobile number</li>
          <li>Your responses to our financial assessment questionnaire, including income, coverage, and savings information</li>
          <li>Inquiry categories you select when reaching out to our team</li>
          <li>Agent verification codes used by authorised BSQ personnel only</li>
        </ul>
        <p className="italic">
          We collect only the minimum information necessary to respond to your inquiry, deliver our services,
          and provide you with a personalised financial guidance experience.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    content: (
      <>
        <p>Your personal information is used solely for the following purposes:</p>
        <ul>
          <li>Responding to your inquiries and providing financial guidance</li>
          <li>Delivering your financial assessment results and personalised recommendations</li>
          <li>Connecting you with a licensed BSQ · PRU Life UK financial advisor</li>
          <li>Sending follow-up communications you have explicitly requested (email or SMS)</li>
          <li>Verifying the identity of authorised BSQ agents and team members</li>
          <li>Improving our services, tools, and content based on aggregated, non-identifiable insights</li>
          <li>Complying with applicable laws, regulations, and legal obligations</li>
        </ul>
        <p className="font-semibold text-gray-900">
          We do not sell, rent, share, or trade your personal information with any third party for marketing purposes.
        </p>
      </>
    ),
  },
  {
    id: 'financial-assessment',
    title: '3. Financial Assessment & Lead Capture',
    content: (
      <>
        <p>
          Our website offers a free AI-powered financial assessment tool. When you complete the assessment
          and voluntarily submit your contact details via the <em>"Send My Results"</em> form:
        </p>
        <ul>
          <li>Your assessment results (risk score, identified gaps, and recommendations) are processed to generate personalised insights</li>
          <li>If you submit your contact details, this information is used solely to deliver your report and facilitate follow-up from a licensed advisor</li>
          <li>Assessment data is transmitted securely and is not shared with any third party outside of our authorised advisory team</li>
          <li>You may request deletion of your data at any time by contacting us at <a href="mailto:support@prubsq.com" className="text-[#ed1b2e] hover:underline">support@prubsq.com</a></li>
        </ul>
        <p>
          Completing the assessment and submitting your contact details does not constitute an insurance application
          or create any financial obligation on your part.
        </p>
      </>
    ),
  },
  {
    id: 'messenger-chatbot',
    title: '4. Messenger & AI Chatbot Disclosure',
    content: (
      <>
        <p>
          We operate an AI-assisted chatbot via Facebook Messenger to help answer inquiries and guide users
          through our services. By interacting with our chatbot or Messenger page, you acknowledge that:
        </p>
        <ul>
          <li>Messages you send are automatically processed to generate responses</li>
          <li>Conversations may be reviewed by authorised team members to improve service quality</li>
          <li>Conversations are not retained longer than necessary to fulfil your request</li>
          <li>You may request to speak with a human representative at any time by typing <strong>"Talk to an advisor"</strong></li>
        </ul>
        <p>
          Facebook Messenger interactions are also subject to{' '}
          <a
            href="https://www.facebook.com/privacy/policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ed1b2e] hover:underline"
          >
            Meta's Privacy Policy
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'insurance-disclaimer',
    title: '5. Insurance & Financial Disclaimer',
    content: (
      <>
        <p>
          The information provided on this website — including financial assessments, gap analyses, product
          descriptions, and recommendation outputs — is intended for <strong>general educational and informational
          purposes only</strong>. It does not constitute:
        </p>
        <ul>
          <li>Certified financial advice or investment advice</li>
          <li>A guarantee of insurance policy approval or coverage</li>
          <li>A binding quotation or offer of any insurance or investment product</li>
        </ul>
        <p>
          All insurance applications are subject to PRU Life UK's underwriting assessment, eligibility criteria,
          and standard terms and conditions. Benefit illustrations and projection figures are for reference only
          and do not represent guaranteed performance or returns.
        </p>
        <p>
          Brilliant Star Quartz (BSQ) is an <strong>independent insurance advisory team</strong> affiliated with
          PRU Life UK. This website is not the official corporate website of Prudential Life Plans, Inc.
          (PRU Life UK).
        </p>
      </>
    ),
  },
  {
    id: 'data-privacy-compliance',
    title: '6. Data Privacy Compliance (Philippines)',
    content: (
      <>
        <p>
          Brilliant Star Quartz (BSQ) operates in full compliance with the{' '}
          <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> of the Philippines and its
          Implementing Rules and Regulations.
        </p>
        <p>As a data subject, you have the following rights:</p>
        <ul>
          <li><strong>Right to be Informed</strong> — to know what personal data we collect and how it is used</li>
          <li><strong>Right to Access</strong> — to request a copy of your personal data held by us</li>
          <li><strong>Right to Rectification</strong> — to request corrections to inaccurate or incomplete data</li>
          <li><strong>Right to Erasure</strong> — to request deletion of your personal data, subject to legal retention requirements</li>
          <li><strong>Right to Object</strong> — to object to the processing of your data for specific purposes</li>
          <li><strong>Right to Data Portability</strong> — to receive your data in a structured, commonly used format</li>
          <li><strong>Right to Lodge a Complaint</strong> — to file a complaint with the National Privacy Commission (NPC) at <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="text-[#ed1b2e] hover:underline">www.privacy.gov.ph</a></li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at{' '}
          <a href="mailto:support@prubsq.com" className="text-[#ed1b2e] hover:underline">support@prubsq.com</a>.
          We will respond to all verified requests within <strong>15 business days</strong>.
        </p>
      </>
    ),
  },
  {
    id: 'data-security',
    title: '7. Data Security',
    content: (
      <>
        <p>
          We implement reasonable administrative, technical, and organisational safeguards to protect your
          personal information from unauthorised access, disclosure, alteration, or destruction. These include:
        </p>
        <ul>
          <li>Encrypted data transmission via HTTPS / TLS</li>
          <li>Restricted access to personal data on a need-to-know basis</li>
          <li>Secure server infrastructure hosted on industry-standard cloud platforms</li>
          <li>Regular review of data handling practices and access controls</li>
        </ul>
        <p>
          While we take every reasonable precaution, no method of electronic transmission or storage is
          completely secure. In the unlikely event of a data breach that affects your rights, we will notify
          you and the National Privacy Commission as required by law.
        </p>
      </>
    ),
  },
  {
    id: 'data-retention',
    title: '8. Data Retention',
    content: (
      <>
        <p>
          We retain your personal data only for as long as necessary to fulfil the purposes for which it
          was collected, or as required by applicable law. Specifically:
        </p>
        <ul>
          <li>Assessment data and contact submissions are retained for a maximum of <strong>12 months</strong> unless you request earlier deletion</li>
          <li>Advisor correspondence and records may be retained longer to comply with financial services regulatory requirements</li>
          <li>Aggregated, anonymised data (with no personally identifiable information) may be retained indefinitely for analytics and service improvement</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '9. Cookies & Tracking',
    content: (
      <>
        <p>
          Our website may use cookies and similar tracking technologies to improve your browsing experience
          and understand how visitors use our site. These may include:
        </p>
        <ul>
          <li><strong>Essential cookies</strong> — required for the website to function correctly</li>
          <li><strong>Analytics cookies</strong> — used to understand visitor behaviour in aggregate (e.g., page views, session duration)</li>
          <li><strong>Third-party cookies</strong> — set by embedded tools such as Facebook Pixel, Google Analytics, or Calendly</li>
        </ul>
        <p>
          You may disable non-essential cookies through your browser settings. Doing so will not affect your
          ability to use the core features of this website.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: '10. Changes to This Policy',
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, services,
          or legal requirements. When we do, we will revise the <strong>"Effective Date"</strong> at the top
          of this page.
        </p>
        <p>
          We encourage you to review this page periodically. Your continued use of our website or services
          after any changes constitutes your acceptance of the updated policy.
        </p>
      </>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>

      {/* ── Hero header ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)' }}>
        {/* Red accent top line */}
        <div style={{ height: 4, background: 'linear-gradient(to right, #ed1b2e, #f87171 60%, transparent)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-20">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#ed1b2e' }}>
            Legal &amp; Compliance
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl">
            We are fully committed to maintaining the privacy, confidentiality, and
            security of your personal data.
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: '#ed1b2e' }} />
              <span className="text-xs text-white/40">Effective Date: January 1, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: '#ed1b2e' }} />
              <span className="text-xs text-white/40">Last Updated: March 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: '#ed1b2e' }} />
              <span className="text-xs text-white/40">RA 10173 Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">

        {/* Quick navigation */}
        <div className="bg-white rounded-2xl p-6 mb-10 border border-gray-100" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Navigation</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SECTIONS.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-xs font-medium text-gray-600 hover:text-[#ed1b2e] transition-colors duration-150 flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Policy sections */}
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white rounded-2xl p-7 md:p-9 border border-gray-100"
              style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.05)', scrollMarginTop: '100px' }}
            >
              {/* Section accent line */}
              <div className="flex items-center gap-3 mb-5">
                <div style={{ width: 3, height: 20, background: '#ed1b2e', borderRadius: 2, flexShrink: 0 }} />
                <h2 className="text-base md:text-lg font-black text-gray-900">{section.title}</h2>
              </div>

              {/* Section content */}
              <div className="prose-custom text-sm text-gray-600 leading-relaxed space-y-4">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Contact card */}
        <div
          className="mt-10 rounded-3xl p-8 md:p-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)' }}
        >
          <div style={{ height: 3, background: 'linear-gradient(to right, #ed1b2e, #f87171 60%, transparent)', position: 'absolute', top: 0, left: 0, right: 0 }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 80% at 10% 50%, rgba(237,27,46,0.1) 0%, transparent 70%)' }} />
          <div className="relative">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: '#ed1b2e' }}>Questions?</p>
            <h3 className="text-xl md:text-2xl font-black text-white mb-3 leading-tight">
              Contact Our Privacy Officer
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md">
              For any privacy-related concerns, data access requests, or complaints, please reach out to us directly.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#ed1b2e' }} />
                <span className="text-sm text-white/60">Email: <a href="mailto:support@prubsq.com" className="text-white hover:text-[#ed1b2e] transition-colors font-medium">support@prubsq.com</a></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#ed1b2e' }} />
                <span className="text-sm text-white/60">Website: <a href="https://www.prubsq.com" className="text-white hover:text-[#ed1b2e] transition-colors font-medium">www.prubsq.com</a></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#ed1b2e' }} />
                <span className="text-sm text-white/60">Address: 18th Floor Exquadra Tower, 1 Jade Street corner Exchange Road, Bgy. San Antonio, Pasig City, Metro Manila, Philippines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
          © 2026 Brilliant Star Quartz (BSQ). All Rights Reserved. &nbsp;·&nbsp; Licensed PRU Life UK Advisor &nbsp;·&nbsp; Pasig City, Metro Manila
        </p>
      </div>

      {/* Prose styles */}
      <style>{`
        .prose-custom ul {
          list-style: none;
          padding: 0;
          margin: 0.75rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .prose-custom li {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          color: #4b5563;
        }
        .prose-custom li::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          min-width: 6px;
          border-radius: 50%;
          background: #ed1b2e;
          margin-top: 0.45rem;
        }
        .prose-custom p {
          color: #4b5563;
        }
        .prose-custom strong {
          color: #111827;
          font-weight: 700;
        }
      `}</style>
    </div>
  )
}
