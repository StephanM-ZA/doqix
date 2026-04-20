/* Do.Qix Contact Form — validation + submission */

(function () {
    var form = document.getElementById('doqix-contact-form');
    if (!form) return;

    var REQUIRED = ['contact-name', 'contact-email', 'contact-size', 'contact-message'];

    /* Pre-fill message from ROI calculator */
    var params = new URLSearchParams(window.location.search);
    var roiData = params.get('roi');
    if (roiData) {
        var msgField = document.getElementById('contact-message');
        if (msgField) {
            msgField.value = roiData;
            msgField.style.height = 'auto';
            msgField.style.height = msgField.scrollHeight + 'px';
        }
        document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
    }

    function validate() {
        var valid = true;
        REQUIRED.forEach(function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            var wrapper = el.closest('.form-field');
            var empty = !el.value || (el.tagName === 'SELECT' && el.value === '');
            var badEmail = id === 'contact-email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
            if (empty || badEmail) {
                wrapper.classList.add('has-error');
                valid = false;
            } else {
                wrapper.classList.remove('has-error');
            }
        });
        return valid;
    }

    /* Clear error on input */
    REQUIRED.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function () {
            el.closest('.form-field').classList.remove('has-error');
        });
        el.addEventListener('change', function () {
            el.closest('.form-field').classList.remove('has-error');
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* Honeypot check */
        var hp = document.getElementById('contact-website');
        if (hp && hp.value) return;

        if (!validate()) return;

        var data = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            company: document.getElementById('contact-company').value,
            company_size: document.getElementById('contact-size').value,
            message: document.getElementById('contact-message').value,
            source: document.getElementById('contact-source').value
        };

        var WEBHOOK_URL = 'https://hooks.digitaloperations.co.za/webhook/doqix-contact';

        var submitBtn = form.querySelector('button[type="submit"]');
        var btnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(function () {
            form.style.display = 'none';
            document.getElementById('form-success').classList.add('show');
            document.getElementById('form-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function () {
            /* Still show success to user (email may have sent, don't confuse them) */
            form.style.display = 'none';
            document.getElementById('form-success').classList.add('show');
            document.getElementById('form-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
})();
