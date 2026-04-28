/* Do.Qix Build Request — preview page bootstrap.
   Wires the "Open Popup" button and auto-opens on load for fast iteration.
   Only used by build-request.html (not loaded from production pages). */

(function () {
    'use strict';

    function openIfReady(trigger) {
        if (window.DoqixBuildPopup && typeof window.DoqixBuildPopup.open === 'function') {
            window.DoqixBuildPopup.open({ trigger: trigger });
        } else {
            console.log('[build-popup preview] DoqixBuildPopup.open not yet implemented (added in Task 4).');
        }
    }

    var btn = document.getElementById('open-popup');
    if (btn) btn.addEventListener('click', function () { openIfReady('preview_button'); });

    window.addEventListener('load', function () { openIfReady('preview_auto'); });
})();
