// prevents GoGuardian tab closing
function beforeUnload(event) {
    const message = 'Are you sure you want to leave? Your changes may not be saved.';
    event.returnValue = message;
    return message;
}

window.addEventListener('beforeunload', beforeUnload);

// prevents unfocusing the window
document.addEventListener("click", function() {
    const focusElement = document.createElement("input");
    focusElement.style.opacity = 0;
    focusElement.style.position = "absolute";
    document.body.appendChild(focusElement);
    focusElement.focus();
    document.body.removeChild(focusElement);
});


// quick-hide shortcut
document.addEventListener('keydown', function(event) {
    if (event.altKey && event.code === 'Backquote') {

        window.removeEventListener('beforeunload', beforeUnload);
        if (window.onbeforeunload) {
            window.onbeforeunload = null;
        }
        
        event.preventDefault();

        setTimeout(function() {
            window.location.href = '/index.html';
        }, 100);
    }
});
