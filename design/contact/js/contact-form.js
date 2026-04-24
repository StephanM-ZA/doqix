/* Do.Qix Contact Form — validation + submission */

(function () {
    var form = document.getElementById('doqix-contact-form');
    if (!form) return;

    var REQUIRED = ['contact-name', 'contact-email', 'contact-size', 'contact-message'];

    /* Pre-fill message from URL parameters */
    function getParam(name) {
        if (typeof URLSearchParams !== 'undefined') {
            return new URLSearchParams(window.location.search).get(name);
        }
        var match = window.location.search.match(new RegExp('[?&]' + name + '=([^&]*)'));
        return match ? decodeURIComponent(match[1]) : null;
    }
    var roiData = getParam('roi');
    var productParam = getParam('product');

    if (roiData) {
        var msgField = document.getElementById('contact-message');
        if (msgField) {
            msgField.value = roiData;
            msgField.style.height = 'auto';
            msgField.style.height = msgField.scrollHeight + 'px';
        }
        document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
    }

    var planParam = getParam('plan');

    if (planParam) {
        var planNames = {
            solo: 'Solo (R999/mo)',
            team: 'Team (R2,500/mo)',
            business: 'Business (R5,500/mo)',
            enterprise: 'Enterprise (Custom)'
        };
        var planName = planNames[planParam.toLowerCase()] || planParam;
        var msgField = document.getElementById('contact-message');
        if (msgField && !msgField.value) {
            msgField.value = "I'm interested in the " + planName + ' plan. Please get in touch to discuss next steps.';
            msgField.style.height = 'auto';
            msgField.style.height = msgField.scrollHeight + 'px';
        }
        document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
    }

    if (productParam) {
        var productNames = {
            nomadiq: 'NomadIQ',
            vendiq: 'VendIQ',
            voltiq: 'VoltIQ',
            learniq: 'LearnIQ'
        };
        var name = productNames[productParam.toLowerCase()] || productParam;
        var msgField = document.getElementById('contact-message');
        if (msgField && !msgField.value) {
            msgField.value = 'I was looking at your ' + name + ' product and am interested to find out more.';
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
            window.location.href = 'thank-you.html';
        })
        .catch(function () {
            /* Still redirect (email may have sent, don't confuse them) */
            window.location.href = 'thank-you.html';
        });
    });
})();
