<?php
/**
 * Plugin Name: Do.Qix Workflow Advisor
 * Plugin URI:  https://doqix.co.za
 * Description: Interactive workflow advisor matching your business tools against curated automation workflows. Use shortcode [doqix_workflow_advisor] on any page.
 * Version:     1.0.0
 * Author:      Do.Qix
 * Author URI:  https://doqix.co.za
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: doqix-workflow-advisor
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ── Constants ── */
define( 'DOQIX_WFA_VERSION',    '1.0.0' );
define( 'DOQIX_WFA_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'DOQIX_WFA_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'DOQIX_WFA_OPTION_KEY', 'doqix_wfa_settings' );

/**
 * Single source of truth for all default settings.
 *
 * @return array
 */
function doqix_wfa_get_defaults() {
	return array(
		/* ── Categories ── */
		'categories' => array(
			array( 'key' => 'accounting',    'name' => 'Accounting & Finance' ),
			array( 'key' => 'crm',           'name' => 'CRM & Sales' ),
			array( 'key' => 'communication', 'name' => 'Email & Communication' ),
			array( 'key' => 'project',       'name' => 'Project Management' ),
			array( 'key' => 'ecommerce',     'name' => 'eCommerce & Payments' ),
			array( 'key' => 'marketing',     'name' => 'Marketing & Email Marketing' ),
			array( 'key' => 'support',       'name' => 'Customer Support' ),
			array( 'key' => 'hr',            'name' => 'HR & Payroll' ),
			array( 'key' => 'scheduling',    'name' => 'Scheduling & Booking' ),
			array( 'key' => 'storage',       'name' => 'Document Storage' ),
		),

		/* ── Services (31 across 10 categories) ── */
		'services' => array(
			array( 'key' => 'xero',              'name' => 'Xero',                     'category' => 'accounting' ),
			array( 'key' => 'sage',              'name' => 'Sage',                     'category' => 'accounting' ),
			array( 'key' => 'quickbooks',        'name' => 'QuickBooks',               'category' => 'accounting' ),
			array( 'key' => 'zoho-books',        'name' => 'Zoho Books',               'category' => 'accounting' ),
			array( 'key' => 'wave',              'name' => 'Wave',                     'category' => 'accounting' ),
			array( 'key' => 'hubspot-crm',       'name' => 'HubSpot',                  'category' => 'crm' ),
			array( 'key' => 'zoho-crm',          'name' => 'Zoho CRM',                 'category' => 'crm' ),
			array( 'key' => 'pipedrive',         'name' => 'Pipedrive',                'category' => 'crm' ),
			array( 'key' => 'salesforce',        'name' => 'Salesforce',               'category' => 'crm' ),
			array( 'key' => 'google-workspace',  'name' => 'Gmail / Google Workspace', 'category' => 'communication' ),
			array( 'key' => 'microsoft-365',     'name' => 'Microsoft 365 / Outlook',  'category' => 'communication' ),
			array( 'key' => 'whatsapp-business', 'name' => 'WhatsApp Business',        'category' => 'communication' ),
			array( 'key' => 'slack',             'name' => 'Slack',                    'category' => 'communication' ),
			array( 'key' => 'monday',            'name' => 'Monday.com',               'category' => 'project' ),
			array( 'key' => 'asana',             'name' => 'Asana',                    'category' => 'project' ),
			array( 'key' => 'trello',            'name' => 'Trello',                   'category' => 'project' ),
			array( 'key' => 'shopify',           'name' => 'Shopify',                  'category' => 'ecommerce' ),
			array( 'key' => 'woocommerce',       'name' => 'WooCommerce',              'category' => 'ecommerce' ),
			array( 'key' => 'yoco',              'name' => 'Yoco',                     'category' => 'ecommerce' ),
			array( 'key' => 'shopstar',          'name' => 'Shopstar',                 'category' => 'ecommerce' ),
			array( 'key' => 'mailchimp',         'name' => 'Mailchimp',                'category' => 'marketing' ),
			array( 'key' => 'hubspot-marketing', 'name' => 'HubSpot Marketing',        'category' => 'marketing' ),
			array( 'key' => 'activecampaign',    'name' => 'ActiveCampaign',           'category' => 'marketing' ),
			array( 'key' => 'freshdesk',         'name' => 'Freshdesk',                'category' => 'support' ),
			array( 'key' => 'zendesk',           'name' => 'Zendesk',                  'category' => 'support' ),
			array( 'key' => 'intercom',          'name' => 'Intercom',                 'category' => 'support' ),
			array( 'key' => 'simplepay',         'name' => 'SimplePay',                'category' => 'hr' ),
			array( 'key' => 'sage-hr',           'name' => 'Sage HR',                  'category' => 'hr' ),
			array( 'key' => 'calendly',          'name' => 'Calendly',                 'category' => 'scheduling' ),
			array( 'key' => 'ms-bookings',       'name' => 'Microsoft Bookings',       'category' => 'scheduling' ),
			array( 'key' => 'google-drive',      'name' => 'Google Drive',             'category' => 'storage' ),
		),

		/* ── 15 Curated Workflows ── */
		'workflows' => array(
			array(
				'title'       => 'Order-to-Invoice Automation',
				'description' => 'Automatically generate and send invoices when new orders come in.',
				'categories'  => array( 'ecommerce', 'accounting' ),
				'steps'       => array(
					array( 'label' => 'New Order',        'type' => 'trigger', 'category' => 'ecommerce' ),
					array( 'label' => 'Create Invoice',   'type' => 'action', 'category' => 'accounting' ),
					array( 'label' => 'Send to Customer', 'type' => 'action', 'category' => 'accounting' ),
					array( 'label' => 'Log Payment',      'type' => 'action', 'category' => 'accounting' ),
				),
				'benefits'    => array(
					'Eliminates manual invoice creation for every order',
					'Customers receive invoices instantly — reduces payment delays',
					'Every transaction auto-logged in your accounting system',
				),
				'hours_saved' => 12,
				'difficulty'  => 'easy',
			),
			array(
				'title'       => 'Lead Capture to CRM Pipeline',
				'description' => 'Route new enquiries from email or web forms directly into your CRM pipeline with status tracking.',
				'categories'  => array( 'crm', 'communication' ),
				'steps'       => array(
					array( 'label' => 'New Enquiry',      'type' => 'trigger', 'category' => 'communication' ),
					array( 'label' => 'Create CRM Deal',  'type' => 'action', 'category' => 'crm' ),
					array( 'label' => 'Assign Owner',     'type' => 'action', 'category' => 'crm' ),
					array( 'label' => 'Send Welcome Mail', 'type' => 'action', 'category' => 'communication' ),
				),
				'benefits'    => array(
					'No leads slip through the cracks — every enquiry tracked',
					'Auto-creates CRM contacts from emails and form submissions',
					'Welcome email sent within seconds of enquiry',
				),
				'hours_saved' => 8,
				'difficulty'  => 'easy',
			),
			array(
				'title'       => 'Support Ticket Routing',
				'description' => 'Automatically route incoming support requests to the right team member based on topic or priority.',
				'categories'  => array( 'support', 'communication' ),
				'steps'       => array(
					array( 'label' => 'New Ticket',       'type' => 'trigger', 'category' => 'support' ),
					array( 'label' => 'Classify Topic',   'type' => 'action', 'category' => 'support' ),
					array( 'label' => 'Assign Agent',     'type' => 'action', 'category' => 'support' ),
					array( 'label' => 'Notify via Slack/Email', 'type' => 'action', 'category' => 'communication' ),
				),
				'benefits'    => array(
					'Tickets reach the right person instantly — no manual triage',
					'Priority issues escalated automatically',
					'Average first-response time drops significantly',
				),
				'hours_saved' => 10,
				'difficulty'  => 'medium',
			),
			array(
				'title'       => 'Invoice Payment Reconciliation',
				'description' => 'Match incoming payments to outstanding invoices and update your books automatically.',
				'categories'  => array( 'ecommerce', 'accounting' ),
				'steps'       => array(
					array( 'label' => 'Payment Received', 'type' => 'trigger', 'category' => 'ecommerce' ),
					array( 'label' => 'Match Invoice',    'type' => 'action', 'category' => 'accounting' ),
					array( 'label' => 'Mark as Paid',     'type' => 'action', 'category' => 'accounting' ),
					array( 'label' => 'Send Receipt',     'type' => 'action', 'category' => 'accounting' ),
				),
				'benefits'    => array(
					'Payments matched to invoices automatically — no spreadsheet reconciliation',
					'Overdue accounts flagged immediately',
					'Saves hours of manual bank-statement matching each month',
				),
				'hours_saved' => 15,
				'difficulty'  => 'medium',
			),
			array(
				'title'       => 'New Customer Onboarding',
				'description' => 'Trigger a complete onboarding sequence when a new client is added — schedule a call, create a project, and send a welcome pack.',
				'categories'  => array( 'crm', 'project', 'communication', 'scheduling' ),
				'steps'       => array(
					array( 'label' => 'New Client Added', 'type' => 'trigger', 'category' => 'crm' ),
					array( 'label' => 'Create Project',   'type' => 'action', 'category' => 'project' ),
					array( 'label' => 'Schedule Kickoff', 'type' => 'action', 'category' => 'scheduling' ),
					array( 'label' => 'Send Welcome Pack', 'type' => 'action', 'category' => 'communication' ),
				),
				'benefits'    => array(
					'New clients get a professional welcome within minutes',
					'Onboarding tasks created in your project board automatically',
					'Kickoff call scheduled without the back-and-forth emails',
				),
				'hours_saved' => 10,
				'difficulty'  => 'medium',
			),
			array(
				'title'       => 'Marketing Lead Nurture',
				'description' => 'Automatically add new leads to an email nurture sequence and update their CRM status as they engage.',
				'categories'  => array( 'marketing', 'crm', 'communication' ),
				'steps'       => array(
					array( 'label' => 'New Lead',            'type' => 'trigger', 'category' => 'crm' ),
					array( 'label' => 'Add to Nurture List', 'type' => 'action', 'category' => 'marketing' ),
					array( 'label' => 'Send Drip Email',     'type' => 'action', 'category' => 'communication' ),
					array( 'label' => 'Update CRM Stage',    'type' => 'action', 'category' => 'crm' ),
				),
				'benefits'    => array(
					'Warm leads receive follow-up sequences automatically',
					'CRM pipeline status updates as leads engage with content',
					'Marketing segments stay synced in real time',
				),
				'hours_saved' => 8,
				'difficulty'  => 'easy',
			),
			array(
				'title'       => 'Payroll Notification & Filing',
				'description' => 'Process payroll, update your accounting records, and file payslips into document storage automatically each pay cycle.',
				'categories'  => array( 'hr', 'storage', 'accounting' ),
				'steps'       => array(
					array( 'label' => 'Payroll Run',         'type' => 'trigger', 'category' => 'hr' ),
					array( 'label' => 'Generate Payslips',   'type' => 'action', 'category' => 'hr' ),
					array( 'label' => 'Update Accounts',     'type' => 'action', 'category' => 'accounting' ),
					array( 'label' => 'File to Drive',       'type' => 'action', 'category' => 'storage' ),
				),
				'benefits'    => array(
					'Payslips generated and filed automatically for compliance',
					'Accounting records synced the moment payroll completes',
					'Every pay run archived in your document storage',
				),
				'hours_saved' => 6,
				'difficulty'  => 'medium',
			),
			array(
				'title'       => 'Stock Level Alerts',
				'description' => 'Get notified when product stock drops below a threshold so you can reorder before running out.',
				'categories'  => array( 'ecommerce', 'communication' ),
				'steps'       => array(
					array( 'label' => 'Stock Below Threshold', 'type' => 'trigger', 'category' => 'ecommerce' ),
					array( 'label' => 'Check Reorder Point',   'type' => 'action', 'category' => 'ecommerce' ),
					array( 'label' => 'Send Alert',            'type' => 'action', 'category' => 'communication' ),
				),
				'benefits'    => array(
					'Never run out of stock — alerts before it happens',
					'Team notified via email or chat to action reorders',
					'Prevents lost sales from out-of-stock products',
				),
				'hours_saved' => 5,
				'difficulty'  => 'easy',
			),
			array(
				'title'       => 'Quote-to-Invoice Pipeline',
				'description' => 'When a quote is accepted in your CRM, automatically create the invoice, update the project, and notify the team.',
				'categories'  => array( 'crm', 'accounting', 'project' ),
				'steps'       => array(
					array( 'label' => 'Quote Accepted',     'type' => 'trigger', 'category' => 'crm' ),
					array( 'label' => 'Create Invoice',     'type' => 'action', 'category' => 'accounting' ),
					array( 'label' => 'Create Project Task', 'type' => 'action', 'category' => 'project' ),
					array( 'label' => 'Notify Team',        'type' => 'action', 'category' => 'crm' ),
				),
				'benefits'    => array(
					'Accepted quotes convert to invoices with zero re-typing',
					'Project tasks created the moment a deal closes',
					'Full audit trail from quote to payment',
				),
				'hours_saved' => 10,
				'difficulty'  => 'medium',
			),
			array(
				'title'       => 'Meeting Follow-Up Automation',
				'description' => 'After a scheduled meeting ends, automatically send a follow-up email and update the CRM record.',
				'categories'  => array( 'scheduling', 'crm', 'communication' ),
				'steps'       => array(
					array( 'label' => 'Meeting Ended',       'type' => 'trigger', 'category' => 'scheduling' ),
					array( 'label' => 'Update CRM Record',   'type' => 'action', 'category' => 'crm' ),
					array( 'label' => 'Send Follow-Up Email', 'type' => 'action', 'category' => 'communication' ),
				),
				'benefits'    => array(
					'Follow-up email sent automatically after every meeting',
					'CRM record updated with meeting notes and next steps',
					'Nothing falls through the cracks between calls',
				),
				'hours_saved' => 6,
				'difficulty'  => 'easy',
			),
			array(
				'title'       => 'Customer Feedback Loop',
				'description' => 'After a support ticket is resolved, send a satisfaction survey, log results in the CRM, and trigger re-engagement if the score is low.',
				'categories'  => array( 'support', 'crm', 'marketing' ),
				'steps'       => array(
					array( 'label' => 'Ticket Resolved',     'type' => 'trigger', 'category' => 'support' ),
					array( 'label' => 'Send Survey',         'type' => 'action', 'category' => 'marketing' ),
					array( 'label' => 'Log Score in CRM',    'type' => 'action', 'category' => 'crm' ),
					array( 'label' => 'Trigger Re-Engage',   'type' => 'action', 'category' => 'marketing' ),
				),
				'benefits'    => array(
					'Post-resolution surveys sent automatically',
					'Customer satisfaction data feeds directly into your CRM',
					'Low scores trigger re-engagement campaigns',
				),
				'hours_saved' => 5,
				'difficulty'  => 'medium',
			),
			array(
				'title'       => 'Full Order-to-Cash',
				'description' => 'End-to-end automation from new order to payment confirmation — invoice, track payment, send receipt, and notify your team.',
				'categories'  => array( 'ecommerce', 'accounting', 'communication' ),
				'steps'       => array(
					array( 'label' => 'New Order',           'type' => 'trigger', 'category' => 'ecommerce' ),
					array( 'label' => 'Create Invoice',      'type' => 'action', 'category' => 'accounting' ),
					array( 'label' => 'Track Payment',       'type' => 'action', 'category' => 'accounting' ),
					array( 'label' => 'Send Receipt',        'type' => 'action', 'category' => 'communication' ),
					array( 'label' => 'Notify Team',         'type' => 'action', 'category' => 'communication' ),
				),
				'benefits'    => array(
					'Complete order-to-cash cycle without touching a spreadsheet',
					'Customers notified at every stage — order, invoice, receipt',
					'Accounting entries created automatically on each transaction',
				),
				'hours_saved' => 20,
				'difficulty'  => 'hard',
			),
			array(
				'title'       => 'Document-Backed Project Kickoff',
				'description' => 'When a new project is created, automatically generate a folder structure in your document storage with templates.',
				'categories'  => array( 'project', 'storage' ),
				'steps'       => array(
					array( 'label' => 'New Project',         'type' => 'trigger', 'category' => 'project' ),
					array( 'label' => 'Create Folder',       'type' => 'action', 'category' => 'storage' ),
					array( 'label' => 'Copy Templates',      'type' => 'action', 'category' => 'storage' ),
				),
				'benefits'    => array(
					'Template folders created for every new project automatically',
					'Briefs and documents auto-linked to project tasks',
					'Team starts with everything in one place — no setup time',
				),
				'hours_saved' => 4,
				'difficulty'  => 'easy',
			),
			array(
				'title'       => 'Sales Pipeline Reporting',
				'description' => 'Automatically compile a weekly pipeline summary from your CRM and email it to stakeholders.',
				'categories'  => array( 'crm', 'communication' ),
				'steps'       => array(
					array( 'label' => 'Weekly Schedule',     'type' => 'trigger', 'category' => 'crm' ),
					array( 'label' => 'Pull CRM Data',       'type' => 'action', 'category' => 'crm' ),
					array( 'label' => 'Generate Report',     'type' => 'action', 'category' => 'crm' ),
					array( 'label' => 'Email Stakeholders',  'type' => 'action', 'category' => 'communication' ),
				),
				'benefits'    => array(
					'Weekly pipeline summary delivered to your inbox automatically',
					'Deal stage changes tracked without manual updates',
					'Revenue forecasts always up to date for stakeholders',
				),
				'hours_saved' => 6,
				'difficulty'  => 'easy',
			),
			array(
				'title'       => 'Multi-Channel Campaign Sync',
				'description' => 'Keep your marketing lists, CRM segments, and project tasks in sync across platforms when a new campaign launches.',
				'categories'  => array( 'marketing', 'crm', 'project' ),
				'steps'       => array(
					array( 'label' => 'Campaign Created',    'type' => 'trigger', 'category' => 'marketing' ),
					array( 'label' => 'Sync Audience List',  'type' => 'action', 'category' => 'marketing' ),
					array( 'label' => 'Create Project Tasks', 'type' => 'action', 'category' => 'project' ),
					array( 'label' => 'Update CRM Tags',     'type' => 'action', 'category' => 'crm' ),
				),
				'benefits'    => array(
					'Campaign tasks auto-created in your project board',
					'Audience lists sync across marketing and CRM platforms',
					'Campaign results tracked in one place',
				),
				'hours_saved' => 8,
				'difficulty'  => 'medium',
			),
		),

		/* Colors — empty = use theme defaults from CSS */
		'color_accent' => '',
		'color_cta'    => '',

		/* Call to action */
		'cta_url'     => '/contact',
		'cta_text'    => "Let\u2019s Build Your First Workflow",
		'cta_subtext' => 'Book a free 15-minute workflow mapping call.',

		/* Lead capture */
		'lead_form_enabled' => 0,
		'lead_form_heading' => 'Get your personalised workflow report',

		/* Display */
		'disclaimer_text' => 'Time estimates are based on typical SA business automation projects.',
	);
}

/* ── Load classes ── */
require_once DOQIX_WFA_PLUGIN_DIR . 'includes/class-doqix-wfa-admin.php';
require_once DOQIX_WFA_PLUGIN_DIR . 'includes/class-doqix-wfa-frontend.php';

/* ── Instantiate ── */
if ( is_admin() ) {
	new Doqix_WFA_Admin();
}
new Doqix_WFA_Frontend();

/* ── Activation: seed defaults (preserves existing on re-activation) ── */
register_activation_hook( __FILE__, function () {
	add_option( DOQIX_WFA_OPTION_KEY, doqix_wfa_get_defaults() );
} );
