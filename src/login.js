import { fetchKey } from './firebase.js';

let correctPassword = 'hotdog';
let SSO = await fetchKey();

const inputField = document.getElementById('password-input');
const loginButton = document.getElementById('login-button');

// check password
function checkPassword() {
    const typedValue = inputField.value;
    if (document.getElementById('auth-text').textContent.includes("auth")) {
        if (typedValue === correctPassword) {
            inputField.classList = 'green';
        } else if (typedValue === '') {
            inputField.classList = '';
        } else {
            inputField.classList = 'red';
        }
    } else {
        if (typedValue === SSO) {
            inputField.classList = 'green';
        } else if (typedValue === '') {
            inputField.classList = '';
        } else {
            inputField.classList = 'red';
        }
    }
}

// Event listener for checking password as the user types
inputField.addEventListener('input', checkPassword); // Correctly listen for input events

// Event listener for handling Enter key
inputField.addEventListener('keydown', function(event) {
    if (event.code === 'Enter') {
        event.preventDefault(); // Prevent the default action (like form submission)
        login(); // Call the login function
    }
});

// Event listener for the login button
loginButton.addEventListener('click', login); // Call login on button click

// Login function
function login() {
    if (document.getElementById('auth-text').textContent.includes("auth")) {
        if (inputField.value === correctPassword) {
            localStorage.setItem("auth", correctPassword);
            if (localStorage.getItem('vertex_sso') === 'true') {
                window.location.href = 'main.html'; // Redirect on successful login
            } else {
                inputField.value = ''; // Clear input
                inputField.classList = ''; // Reset input style
                document.getElementById('auth-text').textContent = 'Now, enter your sso key.'; // Update prompt
                inputField.setAttribute('placeholder', 'Enter SSO key...');
            }
        } else {
            alert('Incorrect password!'); // Alert on wrong password
        }
    } else {
        if (inputField.value === SSO) {
            localStorage.setItem('vertex_sso', 'true'); // Store SSO key
            window.location.href = 'main.html'; // Redirect on successful SSO
        } else {
            alert('Your SSO key is incorrect. You are now locked out of Vertex.'); // Alert for incorrect SSO
            localStorage.setItem('vertex_isBanned', 'true'); // Store ban status
            window.location.href = 'index.html'; // Redirect to index on ban
        }
    }
}
