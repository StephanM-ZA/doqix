/* Do.Qix Services Content — IP-protected sections injected via JS */
/* Sections 3 (What We Automate), 4 (Quick Wins), 8 (Real Results) */

(function(){
  'use strict';

  var el = document.getElementById('services-workflows');
  if (!el) return;

  /* ── SVG helper ─────────────────────────────── */
  function svg(paths, size, extraClass) {
    var s = size || '1.5rem';
    var cls = 'hi text-primary' + (extraClass ? ' ' + extraClass : '');
    return '<svg style="width:' + s + ';height:' + s + '" class="' + cls + '" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">' + paths + '</svg>';
  }

  /* ── Icon paths ─────────────────────────────── */
  var icons = {
    /* Section 3: What We Automate */
    finance: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"/>',
    sales: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/>',
    cart: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>',
    users: '<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>',
    support: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288"/>',
    megaphone: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"/>',
    sync: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>',
    calendar: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>',
    shield: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>',
    share: '<path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"/>',
    paintbrush: '<path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"/>',
    cog: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>',

    /* Section 4: Quick Wins */
    qwSales: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z"/>',
    qwSupport: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>',
    qwFinance: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"/>',
    qwEcommerce: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>',
    qwHR: '<path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"/>',
    qwMarketing: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"/>',
    qwEvents: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/>',
    qwCompliance: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"/>'
  };

  /* ── Section 3: What We Automate (12 categories) */
  var workflows = [
    { icon: 'finance',    label: 'Finance',     title: 'Finance & Billing',           apps: 'Xero, QuickBooks, Stripe, Google Drive, Typeform, Airtable',          stop: 'Manual invoicing, chasing approvals, reconciling spreadsheets' },
    { icon: 'sales',      label: 'Sales',       title: 'Sales & Leads',               apps: 'HubSpot, Pipedrive, Salesforce, Mailchimp, DocuSign',                stop: 'Manually qualifying leads, forgetting follow-ups, chasing signatures' },
    { icon: 'cart',        label: 'E-commerce',  title: 'E-commerce & Orders',          apps: 'Shopify, WooCommerce, Airtable, Xero, Slack',                        stop: 'Manually updating stock, emailing tracking numbers, reacting to stockouts' },
    { icon: 'users',      label: 'HR',          title: 'HR & Onboarding',             apps: 'BambooHR, Google Workspace, Notion, Slack',                           stop: '2-day onboarding admin compressed into minutes' },
    { icon: 'support',    label: 'Support',     title: 'Customer Support',            apps: 'Zendesk, Intercom, Airtable',                                        stop: 'Manually sorting tickets, slow first-response times' },
    { icon: 'megaphone',  label: 'Marketing',   title: 'Marketing & Content',          apps: 'Google Sheets, Trello, WordPress, Buffer, Slack',                     stop: 'Manual publishing, forgetting social posts, chasing approvals' },
    { icon: 'sync',       label: 'Data Sync',   title: 'Data Sync & Reporting',        apps: 'PostgreSQL, MySQL, Elasticsearch, Google Sheets',                     stop: 'Friday afternoon data marathons, "which version is latest?" conversations' },
    { icon: 'calendar',   label: 'Events',      title: 'Event Management',            apps: 'Eventbrite, Google Contacts, Mailchimp, SMS, Typeform',               stop: 'Manual attendee management, forgetting post-event follow-up' },
    { icon: 'shield',     label: 'Compliance',  title: 'Compliance & Audits',          apps: 'Box, Google Sheets, Jira',                                           stop: 'Manual compliance checks, hoping nothing slips through' },
    { icon: 'share',      label: 'Social Media',title: 'Social Media & Feedback',      apps: 'Twitter/X, Typeform, Airtable, Trello, Buffer',                      stop: 'Manual sentiment tracking, feedback sitting unread in a spreadsheet' },
    { icon: 'paintbrush', label: 'Creative',    title: 'Creative Approvals',           apps: 'Google Drive, Slack, Asana',                                         stop: '"Did you see my email about the design?" conversations' },
    { icon: 'cog',         label: 'Facility/IoT',title: 'Facility & IoT',              apps: 'IoT sensors, IFTTT, Asana, Twilio, Google Sheets',                   stop: 'Reacting to building issues instead of preventing them' }
  ];

  function workflowCard(w) {
    return '<div class="card p-6 flex flex-col h-full">' +
      '<div class="flex justify-between items-start mb-6">' +
      svg(icons[w.icon]) +
      '<span class="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">' + w.label + '</span>' +
      '</div>' +
      '<h3 class="text-lg font-bold mb-4">' + w.title + '</h3>' +
      '<div class="mt-auto space-y-4">' +
      '<div>' +
      '<p class="text-[10px] uppercase tracking-tighter text-primary font-bold mb-1">Apps we connect</p>' +
      '<p class="text-xs text-on-surface-variant">' + w.apps + '</p>' +
      '</div>' +
      '<div class="pt-4 border-t border-outline-variant/10">' +
      '<p class="text-[10px] uppercase tracking-tighter text-secondary font-bold mb-1">What you stop doing</p>' +
      '<p class="text-xs text-on-surface-variant">' + w.stop + '</p>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  /* ── Section 4: Quick Wins ─────────────────── */
  var quickWins = [
    { icon: 'qwSales',      title: 'Sales',      desc: 'Leads auto-qualify from HubSpot into Salesforce. Contracts generate and send for DocuSign signature. No more lost leads.' },
    { icon: 'qwSupport',    title: 'Support',    desc: 'Zendesk tickets get categorised, routed to the right agent, and auto-replied to, in seconds.' },
    { icon: 'qwFinance',    title: 'Finance',    desc: 'Typeform submissions trigger invoice creation in QuickBooks, with approval flows and payment confirmations built in.' },
    { icon: 'qwEcommerce',  title: 'E-commerce', desc: 'Shopify orders update Airtable inventory, generate shipping labels, and alert your team when stock runs low.' },
    { icon: 'qwHR',         title: 'HR',         desc: 'BambooHR new hire triggers Google Workspace setup, Notion onboarding docs, and a Slack welcome, all in minutes.' },
    { icon: 'qwMarketing',  title: 'Marketing',  desc: 'Blog posts flow from Google Sheets through Trello approval to WordPress publishing and Buffer social scheduling. Hands-free.' },
    { icon: 'qwEvents',     title: 'Events',     desc: 'Eventbrite registrations sync to contacts, trigger email sequences, send SMS reminders, and fire post-event surveys automatically.' },
    { icon: 'qwCompliance', title: 'Compliance', desc: 'Scheduled audits pull files, check against policy, log results, and flag issues in Jira. No manual checks.' }
  ];

  function quickWinCard(q) {
    return '<div class="card p-6">' +
      svg(icons[q.icon], '1.5rem', 'text-2xl mb-3') +
      '<h3 class="text-base font-bold mb-2">' + q.title + '</h3>' +
      '<p class="text-on-surface-variant text-sm">' + q.desc + '</p>' +
      '</div>';
  }

  /* ── Section 8: Real Results ───────────────── */
  var stats = [
    { value: '8-15',   label: 'hours/week reclaimed' },
    { value: '95%+',   label: 'reduction in data entry errors' },
    { value: 'R11-30k',label: 'per month in recovered time' },
    { value: 'Days',   label: 'to minutes onboarding' }
  ];

  var caseStudies = [
    {
      badge: 'Lead response: hours to under a minute',
      title: 'The property agency that stopped losing leads',
      desc: 'A Joburg-based property group was capturing leads from five different portals, manually. We automated the entire flow: leads now land in the right agent\'s pipeline instantly, with a welcome WhatsApp sent within seconds.'
    },
    {
      badge: '300+ hours/year back to billable work',
      title: 'The accounting firm that got Fridays back',
      desc: 'A mid-size firm in Cape Town was spending 6+ hours every Friday pulling data from Xero, formatting reports, and emailing them to clients. We built an automation that pulls the numbers, populates the report template, and delivers it. Every Friday at 7am, without anyone lifting a finger.'
    },
    {
      badge: '40% growth after redeploying admin budget',
      title: 'The e-commerce brand that stopped hiring for admin',
      desc: 'An online retailer was about to hire a third admin assistant just to keep up with order processing, stock updates, and shipping notifications. We automated the lot. They redeployed the budget into marketing and grew 40% that quarter.'
    },
    {
      badge: 'Onboarding: 2 days to 20 minutes',
      title: 'The professional services firm that killed the copy-paste',
      desc: 'A Durban consultancy had staff entering the same client data into four different systems for every new engagement. We connected the systems. Now they enter client details once, and everything cascades. Errors dropped to near zero.'
    }
  ];

  function caseCard(c) {
    return '<div class="card p-8">' +
      '<div class="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">' +
      '<span class="text-xs font-bold text-primary">' + c.badge + '</span>' +
      '</div>' +
      '<h3 class="mb-3">' + c.title + '</h3>' +
      '<p class="text-on-surface-variant text-sm">' + c.desc + '</p>' +
      '</div>';
  }

  /* ── Build helpers ─────────────────────────── */
  function buildAll(arr, fn) {
    var html = '';
    for (var i = 0; i < arr.length; i++) { html += fn(arr[i]); }
    return html;
  }

  function buildStats() {
    var html = '';
    for (var i = 0; i < stats.length; i++) {
      html += '<div class="text-center p-6">' +
        '<p class="stat-number teal">' + stats[i].value + '</p>' +
        '<p class="text-on-surface-variant text-sm">' + stats[i].label + '</p>' +
        '</div>';
    }
    return html;
  }

  /* ── Inject sections 3 + 4 into #services-workflows ── */
  el.innerHTML =

    /* 3. What We Automate */
    '<section id="what-we-automate" class="py-24 px-8 bg-surface-container-low overflow-hidden">' +
    '<div class="max-w-7xl mx-auto">' +
    '<div class="text-center mb-16 scroll-reveal">' +
    '<span class="label">Our Workflows</span>' +
    '<h2 class="mt-6 mb-4">The Workflows We Build <span class="text-primary">Every Day</span></h2>' +
    '<p class="max-w-2xl mx-auto">We connect the apps you already use and make them talk to each other. Here\'s a taste of what that looks like.</p>' +
    '</div>' +
    '<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 scroll-reveal">' +
    buildAll(workflows, workflowCard) +
    '</div>' +
    '<p class="caption text-center scroll-reveal" style="margin-top:1.5rem;">The apps shown above are just the start. We connect 400+ tools. If it has an API, we can plug it in.</p>' +
    '</div>' +
    '</section>' +

    /* 4. Quick Wins */
    '<section id="quick-wins" class="py-24 px-8 overflow-hidden">' +
    '<div class="max-w-7xl mx-auto">' +
    '<div class="text-center mb-16 scroll-reveal">' +
    '<span class="label">Start Here</span>' +
    '<h2 class="mt-6 mb-4">Where Most Businesses <span class="text-primary">Start</span></h2>' +
    '<p class="max-w-2xl mx-auto">Not sure where to begin? These deliver the fastest results.</p>' +
    '</div>' +
    '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 scroll-reveal">' +
    buildAll(quickWins, quickWinCard) +
    '</div>' +
    '</div>' +
    '</section>';

  if (window.doqixReveal) window.doqixReveal(el);

  /* ── Inject section 8 into #services-results ── */
  var el2 = document.getElementById('services-results');
  if (el2) {
    el2.innerHTML =
      '<section id="real-results" class="py-24 px-8 overflow-hidden">' +
      '<div class="max-w-7xl mx-auto">' +
      '<div class="text-center mb-16 scroll-reveal">' +
      '<span class="label">Results</span>' +
      '<h2 class="mt-6 mb-4">This Is What Automation <span class="text-primary">Actually Looks Like</span></h2>' +
      '<p class="max-w-2xl mx-auto">These are the kinds of results we build for, the same patterns we implement for SA businesses every day.</p>' +
      '</div>' +
      '<div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 scroll-reveal">' +
      buildStats() +
      '</div>' +
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-reveal">' +
      buildAll(caseStudies, caseCard) +
      '</div>' +
      '<p class="caption text-center scroll-reveal" style="margin-top:1.5rem;">Research shows 60% of all jobs have at least 30% of activities that can be automated. This isn\'t about replacing people. It\'s about freeing them to do work that actually needs a human brain.</p>' +
      '</div>' +
      '</section>';
    if (window.doqixReveal) window.doqixReveal(el2);
  }

})();
