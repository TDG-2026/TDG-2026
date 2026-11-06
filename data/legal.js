// Terms updated 5 November 2026.
// Privacy, refund and delivery retain their existing draft content.
// The updated public privacy page is /security-and-privacy.

export const privacyHeadings = [
  'Introduction and scope',
  'Who we are',
  'Information we collect',
  'How we use your information',
  'Legal bases for processing',
  'What stays on your device',
  'Cookies and similar technologies',
  'How we share information',
  'Service providers we rely on',
  'International data transfers',
  'How long we keep information',
  'How we protect information',
  'Your privacy rights',
  'Notice to California residents',
  'Marketing communications',
  'Children’s privacy',
  'Changes to this policy',
  'Contact and complaints',
];

export const legalPages = {
  privacy: {
    title: 'Privacy',
    intro:
      'How information is handled across our website and desktop software.',
    sections: privacyHeadings.map((title, i) => ({
      title,
      text:
        i === 6
          ? 'Cookie preferences are stored in this browser. Optional analytics and marketing preferences default to off. No analytics or advertising scripts are installed in this website package.'
          : i === 17
            ? 'For privacy questions, contact traveldeskgenie@gmail.com. The operator must add its registered identity, address and applicable complaint authority before publishing this policy.'
            : '[Owner to complete: describe ' +
              title.toLowerCase() +
              ' accurately for the deployed website, desktop application and relevant service providers.]',
    })),
  },

  terms: {
    title: 'Terms of Use',
    intro:
      'These terms apply to Travel Genie Magic Toolbar and its related account and subscription services, provided under the Travel Desk Genie business name. Last updated: 5 November 2026.',
    sections: [
      {
        title: 'About these terms',
        text:
          'Travel Genie Magic Toolbar is Windows desktop software that assists with passenger entries and everyday travel-desk tasks. Please read these terms before using the software or purchasing access. If you use the software for an agency or another organisation, you must have permission to do so. Purchase-specific details confirmed in writing, including the price, subscription period and device allowance, form part of your agreement with us.',
      },
      {
        title: 'Contact and support',
        text:
          'For account, activation, subscription, payment or privacy questions, contact info@traveldeskgenie.com. You may also contact traveldeskgenie@gmail.com. Include your account email, application version and relevant purchase reference when appropriate. Never send Google passwords, authentication codes, private keys, full payment-card details or passenger documents through public support chat.',
      },
      {
        title: 'Google sign-in',
        text:
          'Google sign-in identifies your customer account using your Google account identifier, verified email address and display name. Your Google password is entered on Google’s own sign-in page and is not provided to Travel Desk Genie. Our sign-in integration does not request access to your Gmail messages, Google Drive files or Google contacts. Google authentication does not by itself purchase a subscription, approve a device or grant paid access.',
      },
      {
        title: 'Account security',
        text:
          'Use an account you control or are authorised to use. Keep your Google account and Windows computer secure, and notify support if you suspect unauthorised access. Do not share activation credentials or allow others to bypass account or device controls. Account recovery and changes to linked devices may require verification of account ownership.',
      },
      {
        title: 'Licence and approved devices',
        text:
          'Subject to your agreed plan and valid access status, you may install and use the software on approved Windows devices within your device allowance. The software is licensed for use and is not sold as a transfer of its intellectual property. Do not resell access, distribute modified installers, remove access controls or use another customer’s credentials. Contact support before transferring access to a replacement computer.',
      },
      {
        title: 'Plans, prices and payment',
        text:
          'Before paying, confirm the product, price, currency, subscription period, device allowance and any applicable charges with the team. The written offer or purchase confirmation records the terms of your purchase. Signing in or installing the software does not authorise a payment. Paid access depends on payment verification, licence activation and any required device approval. Keep your payment reference and contact support if the recorded access period does not match your confirmed purchase.',
      },
      {
        title: 'Renewal and expiry',
        text:
          'Your subscription permits access for its recorded paid-through period, subject to these terms. Contact the team to arrange renewal before expiry. Do not assume that payment or renewal will occur automatically unless you have separately agreed to a recurring-payment arrangement. Expired subscriptions may lose access to subscription-dependent features. Uninstalling the application does not itself submit a cancellation or refund request.',
      },
      {
        title: 'Connectivity and offline access',
        text:
          'Internet access is required for Google sign-in and online account, device and subscription checks. Where the application provides temporary offline access, that access remains subject to its verification limits and subscription expiry. Offline availability is not a permanent licence or an extension of the paid period. Network failures or interruptions affecting Google, Cloudflare or other service providers may temporarily prevent authentication or verification.',
      },
      {
        title: 'Passenger data and generated output',
        text:
          'You are responsible for having permission to process passenger and customer information and for following your agency’s security procedures. Review extracted text, names, document numbers, dates, contact details and generated GDS entries before submission. OCR, translation and automated formatting may contain errors. The toolbar assists your work; it does not replace professional checks, airline rules or the requirements of your booking-system provider.',
      },
      {
        title: 'Third-party systems and translation',
        text:
          'Access to Amadeus, Travelport, Sabre and other third-party systems depends on your own authorised arrangements with their providers. Preparing an entry does not itself establish a booking-system connection or confirm a reservation. Online translation sends selected text to an external service. Submit confidential or passenger information only when you have appropriate permission and your agency approves that use. Third-party names and trademarks belong to their respective owners; their appearance does not imply endorsement.',
      },
      {
        title: 'Privacy and information handling',
        text:
          'Our Security and Privacy page at https://www.traveldeskgenie.com/en/security-and-privacy explains local processing, Google sign-in information, Cloudflare-hosted account and subscription records, access events and privacy requests. Google identity information is used for customer identification, account linking, access management and related support as described there. Signing out, uninstalling the application or disconnecting Google access does not automatically delete server records. Contact support to request access, correction or deletion; we may verify ownership before acting.',
      },
      {
        title: 'Acceptable use',
        text:
          'Do not use the software for unlawful activity, unauthorised processing of personal information, credential theft or interference with other systems. Do not exploit vulnerabilities, evade subscription or device limits, or attempt to access another customer’s records. Security concerns should be reported privately to support with enough information to investigate and without exposing other people’s data.',
      },
      {
        title: 'Updates and availability',
        text:
          'We may release updates to correct defects, improve security or change supported features. Review update information and obtain installers through our official website or support channels. Compatibility may change as Windows or third-party services change. We do not promise uninterrupted availability, error-free output or compatibility with every computer or external system. Any specific support or service commitments must be confirmed separately in writing.',
      },
      {
        title: 'Cancellation and refund requests',
        text:
          'To request cancellation or a refund, contact support with your account email, purchase reference and reason for the request. Eligibility depends on the purchase terms disclosed before payment and any applicable mandatory rights. These terms do not create a blanket no-refund rule or an unconditional refund guarantee. We will communicate the outcome of a request and any agreed next steps. A refund, account deletion and subscription cancellation are separate actions and should be requested explicitly.',
      },
      {
        title: 'Suspension and termination',
        text:
          'Access may be restricted when a subscription expires, payment is disputed, a device is revoked, account security is at risk or these terms are breached. Where reasonably practicable, we will explain the restriction and how to contact support about it. Immediate restrictions may be necessary to protect accounts or the service. Any remaining payment or refund issues will be considered under the purchase terms and applicable mandatory rights.',
      },
      {
        title: 'Responsibilities and legal rights',
        text:
          'You remain responsible for checking generated output, protecting your own records and maintaining appropriate backups. If a problem occurs, contact support promptly so that we can investigate. Nothing in these terms excludes or limits rights, remedies or responsibilities that cannot lawfully be excluded or limited. These terms do not require you to give up mandatory consumer protections or access to a competent court.',
      },
      {
        title: 'Complaints and disputes',
        text:
          'Please first send complaints to info@traveldeskgenie.com with the relevant dates, account email, purchase reference and a description of the outcome you seek. We will review the information and seek to resolve the matter directly. If it remains unresolved, either party may use the remedies and dispute procedures available under applicable law. These terms do not impose mandatory arbitration or an exclusive foreign court.',
      },
      {
        title: 'Changes to these terms',
        text:
          'We may update these terms as the software or service changes. The updated version will show its revision date. Material changes affecting an existing paid arrangement will be communicated through an appropriate available channel before taking effect where required. An update does not retrospectively change a confirmed purchase price or remove applicable mandatory rights. Contact support if you have questions about a change.',
      },
    ],
  },

  refund: {
    title: 'Refund',
    intro: 'Information about cancellations and refund requests.',
    sections: [
      {
        title: 'Requesting a refund',
        text:
          'Contact traveldeskgenie@gmail.com with your purchase reference and account email. Do not include payment-card details.',
      },
      {
        title: 'Eligibility and timing',
        text:
          '[Owner to complete: applicable refund eligibility, request deadlines, trial rules, statutory rights, cancellation rules and processing times.]',
      },
    ],
  },

  delivery: {
    title: 'Delivery',
    intro: 'Digital software delivery and account activation.',
    sections: [
      {
        title: 'Digital delivery',
        text:
          'Travel Genie Magic Toolbar is delivered as a downloadable Windows installer. No physical shipment is involved.',
      },
      {
        title: 'Activation and support',
        text:
          'Paid access is arranged through the team. [Owner to complete: activation delivery time, confirmation method, support hours and escalation procedure.]',
      },
    ],
  },
};