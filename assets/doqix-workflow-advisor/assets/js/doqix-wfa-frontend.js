/**
 * Do.Qix Workflow Advisor — Frontend Logic
 * Version: 1.1.0
 *
 * Reads categories[], services[], workflows[] from
 * window.doqixWfaConfig (set by wp_localize_script).
 * Handles service selection, category filtering, matching algorithm,
 * result rendering with flow diagrams.
 */
(function() {
  'use strict';

  var config = window.doqixWfaConfig || {};
  var container = document.getElementById('workflow-advisor');
  if (!container) return;

  var categories = config.categories || [];
  var services   = config.services || [];
  var workflows  = config.workflows || [];

  /* ── Build category key→name map ── */
  var catMap = {};
  for (var ci = 0; ci < categories.length; ci++) {
    catMap[categories[ci].key] = categories[ci].name;
  }

  /* ── Build service key→category map and key→name map ── */
  var svcCatMap = {};
  var svcNameMap = {};
  for (var si = 0; si < services.length; si++) {
    svcCatMap[services[si].key] = services[si].category;
    svcNameMap[services[si].key] = services[si].name;
  }

  /* ── Brand data: colors + SVG paths (Simple Icons, viewBox 0 0 24 24) ── */
  var brandData = {
    'xero':              { color: '#13B5EA', svg: 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.585 14.655c-1.485 0-2.69-1.206-2.69-2.689 0-1.485 1.207-2.691 2.69-2.691 1.485 0 2.69 1.207 2.69 2.691s-1.207 2.689-2.69 2.689zM7.53 14.644a.37.37 0 01-.267-.116l-2.043-2.04-2.052 2.047a.37.37 0 01-.258.108c-.202 0-.368-.166-.368-.368 0-.099.04-.191.111-.263l2.04-2.05-2.038-2.047a.37.37 0 01-.113-.261c0-.203.166-.366.368-.366.098 0 .188.037.258.105l2.055 2.048 2.048-2.045a.37.37 0 01.26-.108c.211 0 .375.165.375.366 0 .098-.029.188-.104.258l-2.056 2.055 2.055 2.051c.068.069.104.16.104.258 0 .202-.165.368-.365.368h-.01zm8.017-4.591c-.796.101-.882.476-.882 1.404v2.787c0 .202-.165.366-.366.366-.203 0-.367-.165-.368-.366v-4.53c0-.204.16-.366.362-.366.166 0 .316.125.346.289.27-.209.6-.317.93-.317h.105c.195 0 .359.165.359.368 0 .201-.164.352-.375.359 0 0-.09 0-.164.008l.053-.002zm-3.091 2.205H8.625a1.1 1.1 0 00.089.367c.194.531.765 1.275 1.829 1.29.33-.003.631-.086.9-.229.21-.12.391-.271.525-.428.045-.058.09-.112.12-.168.18-.229.405-.186.54-.083.164.135.18.391.045.57l-.016.016c-.21.27-.435.495-.689.66s-.525.284-.811.345c-.33.09-.645.104-.975.06-1.095-.135-2.01-.93-2.28-2.01a2.5 2.5 0 01-.09-.645c0-.855.421-1.695 1.125-2.205.885-.615 2.085-.66 3-.075.63.405 1.035 1.021 1.185 1.771.075.419-.21.794-.734.81l.068-.046zm6.129-2.223c-1.064 0-1.931.865-1.931 1.931s.866 1.931 1.931 1.931 1.931-.867 1.931-1.931-.866-1.933-1.931-1.933v.002zm0 2.595a.666.666 0 11.001-1.331.666.666 0 01-.001 1.331zm-8.04-2.603c-.91 0-1.672.623-1.886 1.466v.03h3.776c-.203-.855-.973-1.494-1.891-1.494v-.002z' },
    'sage':              { color: '#00D639', svg: 'M2.702 5.316C1.167 5.316 0 6.48 0 7.972c0 1.635 1.167 2.267 2.46 2.655 1.224.387 1.804.818 1.804 1.666 0 .86-.64 1.465-1.477 1.465-.84 0-1.566-.604-1.566-1.535 0-.516.242-.647.242-.934 0-.33-.227-.574-.599-.574-.423 0-.864.647-.864 1.566 0 1.48 1.266 2.57 2.787 2.57 1.535 0 2.701-1.163 2.701-2.656 0-1.623-1.166-2.267-2.472-2.655-1.209-.372-1.792-.818-1.792-1.666 0-.845.626-1.45 1.463-1.45.867 0 1.565.617 1.577 1.465.016.388.285.617.599.617a.592.592 0 00.61-.647c-.027-1.48-1.263-2.543-2.771-2.543zm6.171 9.52c.683 0 1.21-.23 1.21-.69a.57.57 0 00-.557-.574c-.2 0-.341.085-.668.085-.882 0-1.577-.76-1.577-1.65 0-.962.71-1.725 1.608-1.725 1.009 0 1.65.775 1.65 1.895v2.054c0 .36.284.604.625.604.327 0 .61-.244.61-.604v-2.097c0-1.72-1.178-2.984-2.858-2.984-1.566 0-2.86 1.22-2.86 2.856 0 1.58 1.282 2.83 2.817 2.83zm6.257 3.848c1.535 0 2.701-1.163 2.701-2.656 0-1.635-1.166-2.267-2.472-2.655-1.209-.387-1.792-.818-1.792-1.666s.64-1.465 1.463-1.465c.84 0 1.577.604 1.577 1.535 0 .519-.241.647-.241.934 0 .33.226.574.583.574.441 0 .882-.647.882-1.566 0-1.48-1.278-2.57-2.801-2.57-1.535 0-2.687 1.163-2.687 2.656 0 1.623 1.152 2.267 2.46 2.655 1.224.372 1.804.818 1.804 1.666 0 .86-.64 1.45-1.462 1.45-.883 0-1.566-.601-1.578-1.465-.015-.388-.3-.604-.598-.604-.327 0-.626.216-.61.631.011 1.499 1.247 2.546 2.77 2.546zm6.171-3.849c.795 0 1.424-.229 1.862-.503.426-.272.595-.504.595-.76 0-.272-.2-.516-.568-.516-.441 0-.795.66-1.877.66-.952 0-1.707-.76-1.707-1.722 0-.95.725-1.724 1.635-1.724.982 0 1.508.647 1.508 1.062 0 .116-.085.174-.2.174h-1.194c-.326 0-.568.216-.568.503 0 .314.242.546.568.546h1.636c.625 0 1.009-.33 1.009-.89 0-1.408-1.194-2.512-2.774-2.512-1.566 0-2.83 1.263-2.83 2.84s1.312 2.842 2.905 2.842z' },
    'quickbooks':        { color: '#2CA01C', svg: 'M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm.642 4.134c.955 0 1.73.776 1.73 1.733v9.067h1.6c1.614 0 2.927-1.316 2.927-2.933s-1.314-2.933-2.928-2.933h-.665V7.333h.665c2.573 0 4.658 2.09 4.658 4.667s-2.085 4.667-4.658 4.667H12.642zM7.984 7.333h3.329v12.533c-.956 0-1.73-.776-1.73-1.733V9.066H7.984c-1.615 0-2.928 1.316-2.928 2.934s1.313 2.933 2.928 2.933h.665v1.733h-.665c-2.573 0-4.658-2.089-4.658-4.666s2.085-4.667 4.658-4.667z' },
    'zoho-books':        { color: '#C8202B' },
    'wave':              { color: '#003D79' },
    'hubspot-crm':       { color: '#FF7A59', svg: 'M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067c0 .832.47 1.564 1.265 1.979v2.852a6.22 6.22 0 00-2.969 1.31l-7.828-6.095A2.497 2.497 0 104.3 4.656l7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-2.342 2.343a1.968 1.968 0 00-.58-.095 2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207 3.206 3.206 0 01-3.207 3.207z' },
    'zoho-crm':          { color: '#C8202B' },
    'pipedrive':         { color: '#017737' },
    'salesforce':        { color: '#00A1E0', svg: 'M10.006 5.415a4.195 4.195 0 013.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 01-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.314 4.314 0 018.88 20.4a4.302 4.302 0 01-4.05-2.82c-.27.062-.54.076-.825.076-2.204 0-4.005-1.8-4.005-4.05 0-1.5.811-2.805 2.01-3.51-.255-.57-.39-1.2-.39-1.846 0-2.58 2.1-4.65 4.65-4.65 1.53 0 2.85.705 3.72 1.8' },
    'google-workspace':  { color: '#4285F4', svg: 'M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z' },
    'microsoft-365':     { color: '#0078D4', svg: 'M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z' },
    'whatsapp-business': { color: '#25D366', svg: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
    'slack':             { color: '#4A154B', svg: 'M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z' },
    'monday':            { color: '#FF3D57' },
    'asana':             { color: '#F06A6A', svg: 'M18.78 12.653c-2.882 0-5.22 2.336-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.34 5.22-5.22-2.336-5.22-5.22-5.22zm-13.56 0c-2.88 0-5.22 2.337-5.22 5.22s2.338 5.22 5.22 5.22 5.22-2.338 5.22-5.22-2.336-5.22-5.22-5.22zm12-6.525c0 2.883-2.337 5.22-5.22 5.22-2.882 0-5.22-2.337-5.22-5.22 0-2.88 2.338-5.22 5.22-5.22 2.883 0 5.22 2.34 5.22 5.22z' },
    'trello':            { color: '#0052CC', svg: 'M21.147 0H2.853A2.86 2.86 0 000 2.853v18.294A2.86 2.86 0 002.853 24h18.294A2.86 2.86 0 0024 21.147V2.853A2.86 2.86 0 0021.147 0zM10.34 17.287a.953.953 0 01-.953.953h-4a.954.954 0 01-.954-.953V5.38a.953.953 0 01.954-.953h4a.954.954 0 01.953.953zm9.233-5.467a.944.944 0 01-.953.947h-4a.947.947 0 01-.953-.947V5.38a.953.953 0 01.953-.953h4a.954.954 0 01.953.953z' },
    'shopify':           { color: '#7AB55C', svg: 'M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z' },
    'woocommerce':       { color: '#96588A', svg: 'M.754 9.58a.754.754 0 00-.754.758v2.525c0 .42.339.758.758.758h3.135l1.431.799-.326-.799h2.373a.757.757 0 00.758-.758v-2.525a.757.757 0 00-.758-.758H.754zm2.709.445h.03c.065.001.124.023.179.067a.26.26 0 01.103.19.29.29 0 01-.033.16c-.13.239-.236.64-.322 1.199-.083.541-.114.965-.094 1.267a.392.392 0 01-.039.219.213.213 0 01-.176.12c-.086.006-.177-.034-.263-.124-.31-.316-.555-.788-.735-1.416-.216.425-.375.744-.478.957-.196.376-.363.568-.502.578-.09.007-.166-.069-.233-.228-.17-.436-.352-1.277-.548-2.524a.297.297 0 01.054-.222c.047-.064.116-.095.21-.102.169-.013.265.065.288.238.103.695.217 1.284.336 1.766l.727-1.387c.066-.126.15-.192.25-.199.146-.01.237.083.273.28.083.441.188.817.315 1.136.086-.844.233-1.453.44-1.828a.255.255 0 01.218-.147z' },
    'yoco':              { color: '#00B4E6' },
    'shopstar':          { color: '#FF6B00' },
    'mailchimp':         { color: '#FFE01B', svg: 'M11.267 0C6.791-.015-1.82 10.246 1.397 12.964l.79.669a3.88 3.88 0 00-.22 1.792c.084.84.518 1.644 1.22 2.266.666.59 1.542.964 2.392.964 1.406 3.24 4.62 5.228 8.386 5.34 4.04.12 7.433-1.776 8.854-5.182.093-.24.488-1.316.488-2.267 0-.956-.54-1.352-.885-1.352-.01-.037-.078-.286-.172-.586s-.19-.51-.19-.51c.375-.563.382-1.065.332-1.35-.053-.353-.2-.653-.496-.964-.296-.311-.902-.63-1.753-.868l-.446-.124c-.002-.019-.024-1.053-.043-1.497-.014-.32-.042-.822-.197-1.315-.186-.668-.508-1.253-.911-1.627 1.112-1.152 1.806-2.422 1.804-3.511-.003-2.095-2.576-2.729-5.746-1.416l-.672.285A678.22 678.22 0 0012.7.504C12.304.159 11.817.002 11.267 0z' },
    'hubspot-marketing': { color: '#FF7A59', svg: 'M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067c0 .832.47 1.564 1.265 1.979v2.852a6.22 6.22 0 00-2.969 1.31l-7.828-6.095A2.497 2.497 0 104.3 4.656l7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-2.342 2.343a1.968 1.968 0 00-.58-.095 2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207 3.206 3.206 0 01-3.207 3.207z' },
    'activecampaign':    { color: '#356AE6' },
    'freshdesk':         { color: '#00B67A' },
    'zendesk':           { color: '#03363D', svg: 'M12.914 2.904V16.29L24 2.905H12.914zM0 2.906C0 5.966 2.483 8.45 5.543 8.45s5.542-2.484 5.543-5.544H0zm11.086 4.807L0 21.096h11.086V7.713zm7.37 7.84c-3.063 0-5.542 2.48-5.542 5.543H24c0-3.06-2.48-5.543-5.543-5.543z' },
    'intercom':          { color: '#6AFDEF', svg: 'M21 0H3C1.343 0 0 1.343 0 3v18c0 1.658 1.343 3 3 3h18c1.658 0 3-1.342 3-3V3c0-1.657-1.342-3-3-3zm-5.801 4.399a.802.802 0 011.602 0v10.688a.802.802 0 01-1.602 0V4.399zM11.2 3.994a.8.8 0 011.6 0v11.602a.8.8 0 01-1.6 0V3.994zm-4 .405a.8.8 0 011.601 0v10.688a.8.8 0 01-1.601 0V4.399zM3.199 6a.8.8 0 011.601 0v7.195a.8.8 0 01-1.601 0V6zm17.321 12.202c-.123.105-3.086 2.593-8.52 2.593-5.433 0-8.397-2.486-8.521-2.593a.802.802 0 011.039-1.218c.047.041 2.693 2.211 7.481 2.211 4.848 0 7.456-2.186 7.479-2.207a.801.801 0 011.042 1.214zm.281-5.007a.8.8 0 01-1.602 0V6a.8.8 0 011.602 0v7.195z' },
    'simplepay':         { color: '#3AA3E3' },
    'sage-hr':           { color: '#00D639', svg: 'M2.702 5.316C1.167 5.316 0 6.48 0 7.972c0 1.635 1.167 2.267 2.46 2.655 1.224.387 1.804.818 1.804 1.666 0 .86-.64 1.465-1.477 1.465-.84 0-1.566-.604-1.566-1.535 0-.516.242-.647.242-.934 0-.33-.227-.574-.599-.574-.423 0-.864.647-.864 1.566 0 1.48 1.266 2.57 2.787 2.57 1.535 0 2.701-1.163 2.701-2.656 0-1.623-1.166-2.267-2.472-2.655-1.209-.372-1.792-.818-1.792-1.666 0-.845.626-1.45 1.463-1.45.867 0 1.565.617 1.577 1.465.016.388.285.617.599.617a.592.592 0 00.61-.647c-.027-1.48-1.263-2.543-2.771-2.543z' },
    'calendly':          { color: '#006BFF', svg: 'M19.655 14.262c.281 0 .557.023.828.064 0 .005-.005.01-.005.014-.105.267-.234.534-.381.786l-1.219 2.106c-1.112 1.936-3.177 3.127-5.411 3.127h-2.432c-2.23 0-4.294-1.191-5.412-3.127l-1.218-2.106a6.251 6.251 0 010-6.252l1.218-2.106C6.736 4.832 8.8 3.641 11.035 3.641h2.432c2.23 0 4.294 1.191 5.411 3.127l1.219 2.106c.147.252.271.519.381.786 0 .004.005.009.005.014-.267.041-.543.064-.828.064-1.816 0-2.501-.607-3.291-1.306-.764-.676-1.711-1.517-3.44-1.517h-1.029c-1.251 0-2.387.455-3.2 1.278-.796.805-1.233 1.904-1.233 3.099v1.411c0 1.196.437 2.295 1.233 3.099.813.823 1.949 1.278 3.2 1.278h1.034c1.729 0 2.676-.841 3.439-1.517.791-.703 1.471-1.306 3.287-1.301z' },
    'ms-bookings':       { color: '#0078D4', svg: 'M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z' },
    'google-drive':      { color: '#4285F4', svg: 'M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 00-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653l-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 01-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z' }
  };

  /* ── Upgrade service cards with brand logos and colors ── */
  function upgradeServiceCards() {
    if (!servicesGrid) return;
    var cards = servicesGrid.querySelectorAll('.wfa-service-card');
    for (var i = 0; i < cards.length; i++) {
      var key = cards[i].getAttribute('data-service');
      var brand = brandData[key];
      if (!brand) continue;

      var el = cards[i].querySelector('.wfa-service-initial');
      if (!el) continue;

      el.style.background = brand.color + '18';
      el.style.color = brand.color;

      if (brand.svg) {
        el.innerHTML = '<svg viewBox="0 0 24 24" fill="' + brand.color + '" style="width:22px;height:22px;"><path d="' + brand.svg + '"/></svg>';
      }
    }
  }

  /* ── DOM refs ── */
  var filterTabs     = document.getElementById('wfa-filter-tabs');
  var servicesGrid   = document.getElementById('wfa-services-grid');
  var selectedCount  = document.getElementById('wfa-selected-count');
  var selectedBar    = document.getElementById('wfa-selected-bar');
  var showBtn        = document.getElementById('wfa-show-btn');
  var stepResults    = document.getElementById('wfa-step-results');
  var resultsGrid    = document.getElementById('wfa-results-grid');
  var noResults      = document.getElementById('wfa-no-results');
  var stepCta        = document.getElementById('wfa-step-cta');
  var disclaimer     = document.getElementById('wfa-disclaimer');
  var leadForm       = document.getElementById('wfa-lead-form');
  var ctaSubmit      = document.getElementById('wfa-cta-submit');

  /* ── State ── */
  var selectedServices = {};
  var activeFilter = 'all';

  /* ── SVG icons (inline to avoid external deps) ── */
  var arrowSvg = '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/></svg>';
  var clockSvg = '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>';
  var checkSvg = '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';
  var closeSvg = '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>';

  /* ── Category tab filtering ── */
  if (filterTabs) {
    filterTabs.addEventListener('click', function(e) {
      var tab = e.target.closest('.wfa-tab');
      if (!tab) return;

      /* Update active tab */
      var allTabs = filterTabs.querySelectorAll('.wfa-tab');
      for (var t = 0; t < allTabs.length; t++) {
        allTabs[t].classList.remove('wfa-tab-active');
      }
      tab.classList.add('wfa-tab-active');

      activeFilter = tab.getAttribute('data-category');
      filterServices();
    });
  }

  function filterServices() {
    var cards = servicesGrid.querySelectorAll('.wfa-service-card');
    for (var i = 0; i < cards.length; i++) {
      var cat = cards[i].getAttribute('data-category');
      if (activeFilter === 'all' || cat === activeFilter) {
        cards[i].classList.remove('wfa-hidden');
      } else {
        cards[i].classList.add('wfa-hidden');
      }
    }
  }

  /* ── Service card selection ── */
  if (servicesGrid) {
    servicesGrid.addEventListener('click', function(e) {
      var card = e.target.closest('.wfa-service-card');
      if (!card) return;

      var key = card.getAttribute('data-service');
      if (selectedServices[key]) {
        delete selectedServices[key];
        card.classList.remove('wfa-selected');
      } else {
        selectedServices[key] = true;
        card.classList.add('wfa-selected');
      }

      updateFooter();
      updateSelectedBar();
      updateTabBadges();
      refreshIfVisible();
    });
  }

  /* ── Selected tools chip bar ── */
  function updateSelectedBar() {
    if (!selectedBar) return;

    var keys = Object.keys(selectedServices);
    if (keys.length === 0) {
      selectedBar.style.display = 'none';
      selectedBar.innerHTML = '';
      return;
    }

    selectedBar.style.display = '';
    var html = '';
    for (var i = 0; i < keys.length; i++) {
      var name = svcNameMap[keys[i]] || keys[i];
      html += '<span class="wfa-chip" data-service="' + escAttr(keys[i]) + '">' +
        escHtml(name) +
        '<button type="button" class="wfa-chip-remove" aria-label="Remove">' + closeSvg + '</button>' +
      '</span>';
    }
    selectedBar.innerHTML = html;
  }

  /* Chip remove click */
  if (selectedBar) {
    selectedBar.addEventListener('click', function(e) {
      var btn = e.target.closest('.wfa-chip-remove');
      if (!btn) return;
      var chip = btn.closest('.wfa-chip');
      if (!chip) return;
      var key = chip.getAttribute('data-service');
      if (key && selectedServices[key]) {
        delete selectedServices[key];
        /* Un-highlight the card in the grid */
        var card = servicesGrid.querySelector('[data-service="' + key + '"]');
        if (card) card.classList.remove('wfa-selected');
        updateFooter();
        updateSelectedBar();
        updateTabBadges();
        refreshIfVisible();
      }
    });
  }

  /* ── Category tab badges ── */
  function updateTabBadges() {
    if (!filterTabs) return;

    /* Count selections per category */
    var catCounts = {};
    var keys = Object.keys(selectedServices);
    for (var i = 0; i < keys.length; i++) {
      var cat = svcCatMap[keys[i]];
      if (cat) {
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      }
    }

    /* Also count total for "All" tab */
    var total = keys.length;

    var tabs = filterTabs.querySelectorAll('.wfa-tab');
    for (var t = 0; t < tabs.length; t++) {
      var tabCat = tabs[t].getAttribute('data-category');
      var badge = tabs[t].querySelector('.wfa-tab-badge');
      var count = tabCat === 'all' ? total : (catCounts[tabCat] || 0);

      if (count > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'wfa-tab-badge';
          tabs[t].appendChild(badge);
        }
        badge.textContent = count;
      } else {
        if (badge) badge.remove();
      }
    }
  }

  function refreshIfVisible() {
    if (stepResults && stepResults.style.display !== 'none') {
      var matches = findMatches();
      renderResults(matches);
    }
  }

  function updateFooter() {
    var count = Object.keys(selectedServices).length;
    if (selectedCount) {
      selectedCount.textContent = count + (count === 1 ? ' tool selected' : ' tools selected');
    }
    if (showBtn) {
      showBtn.disabled = count < 1;
    }
  }

  /* ── Show My Workflows button ── */
  if (showBtn) {
    showBtn.addEventListener('click', function() {
      var matches = findMatches();
      renderResults(matches);

      /* Show results + CTA + disclaimer */
      if (stepResults) stepResults.style.display = '';
      if (stepCta) stepCta.style.display = '';
      if (disclaimer) disclaimer.style.display = '';

      /* Smooth scroll to results */
      if (stepResults) {
        stepResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* ── Matching Algorithm ──
   * For each workflow, check if the user has selected at least one service
   * from each required category.
   *
   * Scoring:
   * 1. Perfect matches first (all categories covered)
   * 2. Then by match ratio (covered/required)
   * 3. Then by hours_saved descending
   */
  function findMatches() {
    /* Build set of user-selected category keys */
    var userCategories = {};
    var keys = Object.keys(selectedServices);
    for (var i = 0; i < keys.length; i++) {
      var cat = svcCatMap[keys[i]];
      if (cat) {
        userCategories[cat] = true;
      }
    }

    var scored = [];

    for (var wi = 0; wi < workflows.length; wi++) {
      var wf = workflows[wi];
      var reqCats = wf.categories || [];
      if (reqCats.length === 0) continue;

      var matched = 0;
      var missing = [];
      for (var rc = 0; rc < reqCats.length; rc++) {
        if (userCategories[reqCats[rc]]) {
          matched++;
        } else {
          missing.push(reqCats[rc]);
        }
      }

      if (matched === 0) continue;

      var ratio = matched / reqCats.length;
      var perfect = missing.length === 0;

      scored.push({
        workflow: wf,
        ratio: ratio,
        perfect: perfect,
        missing: missing,
        hours: wf.hours_saved || 0
      });
    }

    /* Sort: perfect first, then by ratio desc, then by hours desc */
    scored.sort(function(a, b) {
      if (a.perfect !== b.perfect) return a.perfect ? -1 : 1;
      if (a.ratio !== b.ratio) return b.ratio - a.ratio;
      return b.hours - a.hours;
    });

    return scored;
  }

  /* ── Get user's connected tools for a workflow ── */
  function getConnectedTools(wfCategories) {
    var tools = [];
    var keys = Object.keys(selectedServices);
    for (var i = 0; i < keys.length; i++) {
      var svcCat = svcCatMap[keys[i]];
      if (svcCat && wfCategories.indexOf(svcCat) !== -1) {
        tools.push(svcNameMap[keys[i]] || keys[i]);
      }
    }
    return tools;
  }

  /* ── Get user's tool name for a category ── */
  function getUserToolForCategory(cat) {
    var keys = Object.keys(selectedServices);
    for (var i = 0; i < keys.length; i++) {
      if (svcCatMap[keys[i]] === cat) {
        return svcNameMap[keys[i]] || keys[i];
      }
    }
    return '';
  }

  /* ── Render Results ── */
  function renderResults(matches) {
    /* Build user categories for flow step rendering */
    var userCategories = {};
    var selKeys = Object.keys(selectedServices);
    for (var sk = 0; sk < selKeys.length; sk++) {
      var sc = svcCatMap[selKeys[sk]];
      if (sc) userCategories[sc] = true;
    }

    resultsGrid.innerHTML = '';

    if (matches.length === 0) {
      if (noResults) noResults.style.display = '';
      return;
    }

    if (noResults) noResults.style.display = 'none';

    for (var i = 0; i < matches.length; i++) {
      var m = matches[i];
      var wf = m.workflow;

      var card = document.createElement('div');
      card.className = 'wfa-workflow-card' + (m.perfect ? '' : ' wfa-workflow-partial');

      /* Header: title + difficulty badge */
      var badgeClass = 'wfa-wf-badge wfa-wf-badge-' + wf.difficulty;
      var badgeText = wf.difficulty.charAt(0).toUpperCase() + wf.difficulty.slice(1);

      var html = '<div class="wfa-wf-header">' +
        '<h3 class="wfa-wf-title">' + escHtml(wf.title) + '</h3>' +
        '<span class="' + badgeClass + '">' + badgeText + '</span>' +
      '</div>';

      /* Description */
      html += '<p class="wfa-wf-desc">' + escHtml(wf.description) + '</p>';

      /* Connected tools from user selection */
      var connectedTools = getConnectedTools(wf.categories || []);
      if (connectedTools.length > 0) {
        html += '<div class="wfa-connected">';
        html += '<span class="wfa-connected-label">Your tools in this workflow:</span>';
        html += '<div class="wfa-connected-tools">';
        for (var ct = 0; ct < connectedTools.length; ct++) {
          html += '<span class="wfa-tool-chip">' + checkSvg + ' ' + escHtml(connectedTools[ct]) + '</span>';
        }
        html += '</div></div>';
      }

      /* Flow diagram */
      html += renderFlow(wf.steps || [], userCategories);

      /* Benefits list */
      var benefits = wf.benefits || [];
      if (benefits.length > 0) {
        html += '<ul class="wfa-benefits">';
        for (var bi = 0; bi < benefits.length; bi++) {
          html += '<li>' + escHtml(benefits[bi]) + '</li>';
        }
        html += '</ul>';
      }

      /* Hours saved badge */
      html += '<div class="wfa-hours-badge">' + clockSvg +
        '<span>~' + wf.hours_saved + ' hrs saved per month</span></div>';

      /* Partial match note */
      if (m.missing.length > 0) {
        var missingNames = [];
        for (var mi = 0; mi < m.missing.length; mi++) {
          missingNames.push(catMap[m.missing[mi]] || m.missing[mi]);
        }
        html += '<div class="wfa-partial-note">You\u2019d also need a tool from: ' +
          escHtml(missingNames.join(', ')) + '</div>';
      }

      card.innerHTML = html;
      resultsGrid.appendChild(card);
    }
  }

  /* ── Render flow diagram ── */
  function renderFlow(steps, userCategories) {
    if (steps.length === 0) return '';

    var html = '<div class="wfa-flow">';
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      var stepCat = step.category || '';
      var hasTools = stepCat && userCategories && userCategories[stepCat];
      var nodeClass = step.type === 'trigger' ? 'wfa-flow-trigger' : 'wfa-flow-action';
      if (!hasTools && stepCat) nodeClass += ' wfa-flow-inactive';

      html += '<div class="wfa-flow-step">';
      html += '<div class="wfa-flow-node ' + nodeClass + '">' + escHtml(step.label) + '</div>';

      /* Show tool name (active) or category needed (inactive) */
      if (hasTools) {
        var toolName = getUserToolForCategory(stepCat);
        if (toolName) {
          html += '<div class="wfa-flow-step-label wfa-flow-label-active">' + escHtml(toolName) + '</div>';
        }
      } else if (stepCat) {
        html += '<div class="wfa-flow-step-label wfa-flow-label-missing">' + escHtml(catMap[stepCat] || stepCat) + '</div>';
      }

      html += '</div>';

      if (i < steps.length - 1) {
        html += '<div class="wfa-flow-arrow">' + arrowSvg + '</div>';
      }
    }
    html += '</div>';
    return html;
  }

  /* ── Lead form → CTA with query params ── */
  if (ctaSubmit && leadForm) {
    ctaSubmit.addEventListener('click', function(e) {
      var nameInput  = document.getElementById('wfa-lead-name');
      var emailInput = document.getElementById('wfa-lead-email');
      var phoneInput = document.getElementById('wfa-lead-phone');

      var name  = nameInput  ? nameInput.value.trim()  : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var phone = phoneInput ? phoneInput.value.trim() : '';

      /* Basic validation */
      if (!name || !email) {
        e.preventDefault();
        if (!name && nameInput) nameInput.focus();
        else if (!email && emailInput) emailInput.focus();
        return;
      }

      /* Append query params to CTA URL */
      var baseUrl = ctaSubmit.getAttribute('href') || '/contact';
      var sep = baseUrl.indexOf('?') === -1 ? '?' : '&';
      var params = 'wfa_name=' + encodeURIComponent(name) +
        '&wfa_email=' + encodeURIComponent(email);
      if (phone) {
        params += '&wfa_phone=' + encodeURIComponent(phone);
      }

      /* Add selected tools */
      var tools = Object.keys(selectedServices).join(',');
      if (tools) {
        params += '&wfa_tools=' + encodeURIComponent(tools);
      }

      ctaSubmit.setAttribute('href', baseUrl + sep + params);
    });
  }

  /* ── HTML/attr escaping ── */
  function escHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ── Initial state ── */
  updateFooter();
  upgradeServiceCards();
})();
