/* Do.Qix Thank You — 5-second countdown redirect to homepage */

(function () {
    var el = document.getElementById('countdown');
    if (!el) return;

    var seconds = 10;

    var timer = setInterval(function () {
        seconds--;
        el.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(timer);
            window.location.href = 'index.html';
        }
    }, 1000);
})();
