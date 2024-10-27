async function fetchNotifications() {
    const response = await fetch('notifications.json');
    return response.json();
}

function showRandomNotification(notifications) {
    const randomIndex = Math.floor(Math.random() * notifications.length);
    const { title, message, image } = notifications[randomIndex];

    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: image,
            image: image
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, {
                    body: message,
                    icon: image,
                    image: image
                });
            }
        });
    }
}

async function startNotifications() {
    const notifications = await fetchNotifications();
    setInterval(() => showRandomNotification(notifications), 2500);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => console.log('Service Worker registered!', registration))
        .catch(err => console.log('Service Worker registration failed!', err));
}

document.addEventListener('DOMContentLoaded', startNotifications);
