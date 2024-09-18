// prevents GoGuardian tab closing
window.addEventListener('beforeunload', function (event) {
    const message = 'Are you sure you want to leave? Your changes may not be saved.';

    event.returnValue = message;
    return message;
});

// prevents unfocusing the window
function focusOnDocument() {
    if (document.hasFocus()) {
        document.body.focus();
    }
}

document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        focusOnDocument();
    }
});

window.addEventListener('focus', function () {
    focusOnDocument();
});
