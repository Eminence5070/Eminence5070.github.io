self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Default message',
        icon: '/favicon.png',
        image: '/favicon.png',
    };
    event.waitUntil(
        self.registration.showNotification('Notification Title', options)
    );
});
