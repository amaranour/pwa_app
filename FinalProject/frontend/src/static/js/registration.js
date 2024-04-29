import api from './API_Client_Mock.js';

// Add event listeners
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const rePassword = document.querySelector('#rePassword');


const registerBtn = document.querySelector('.registerBtn');

function check() {
    if (password.value != rePassword.value) {
        return false;
    }
    return true;
}

// Modal pop-up function
function alertModal() {
    let modal = new bootstrap.Modal('#offlineModal', {
        keyboard: false
    });
    modal.show();
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            registerBtn.addEventListener('click', function (event) {
                if (!form.checkValidity() && !check()) {
                    event.preventDefault()
                    event.stopPropagation()
                } else {
                    api.createUser(firstName.value, lastName.value, username.value, password.value)
                        .then(response => {
                            console.log('User created successfully:', response);
                            window.location.href = '/login';
                        })
                        .catch(err => {
                            console.log("something went wrong" + err);
                            if (error.message === "Failed to fetch") {
                                alertModal();
                            }
                        })
                }
                form.classList.add('was-validated')
            }, false)
        })
})()