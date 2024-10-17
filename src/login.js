import { Utils } from './utils.js';

let correctPassword = await Utils.fetchPassword();
let SSO = await Utils.fetchKey();

const inputField = document.getElementById('password-input');
const loginButton = document.getElementById('login-button');

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

inputField.addEventListener('input', checkPassword);

inputField.addEventListener('keydown', function(event) {
    if (event.code === 'Enter') {
        event.preventDefault();
        login();
    }
});

loginButton.addEventListener('click', login);

function login() {
    if (document.getElementById('auth-text').textContent.includes("auth")) {
        if (inputField.value === correctPassword) {
            localStorage.setItem("auth", correctPassword);
            if (localStorage.getItem('vertex_sso') === 'true') {
                window.location.href = 'main.html';
            } else {
                inputField.value = '';
                inputField.classList = '';
                document.getElementById('auth-text').textContent = 'Now, enter your sso key.';
                inputField.setAttribute('placeholder', 'Enter SSO key...');
            }
        } else {
            alert('Incorrect password!');
        }
    } else {
        if (inputField.value === SSO) {
            localStorage.setItem('vertex_sso', 'true');
            window.location.href = 'main.html';
        } else {
            alert('Your SSO key is incorrect. You are now locked out of Vertex.');
            localStorage.setItem('vertex_isBanned', 'true');
            window.location.href = 'index.html';
        }
    }
}
