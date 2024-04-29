import api from './API_Client_Mock.js';

// Add event listeners
const loginButton = document.querySelector('#loginButton');
const username = document.querySelector('#username');
const password = document.querySelector('#password');

const errorBox = document.querySelector('#errorBox');

// Modal pop-up function
function alertModal() {
    let modal = new bootstrap.Modal('#offlineModal', {
        keyboard: false
    });
    modal.show();
}

(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            loginButton.addEventListener('click', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                } else {
                    api.login(username.value, password.value)
                        .then(response => {
                            console.log('User logged in successfully:', response);
                            window.location.href = '/';
                        })
                        .catch(error => {
                            console.error('Error logging in:', error);
                            errorBox.classList.remove('hidden');
                            errorBox.innerHTML = "Invalid username or password";
                            if (error.message === "Failed to fetch") {
                                alertModal();
                            }
                        });
                }
                form.classList.add('was-validated')
            }, false)
        })
})()