const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle('is-open');
}

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut =document.querySelector('.button-out');

let login = localStorage.getItem('login');


function toggleModalAuth() {
   modalAuth.classList.toggle('is-open');
   loginInput.style.borderColor = ''; 
   passwordInput.style.borderColor = ''; 
   if (modalAuth.classList.contains('is-open')){
     disabledScroll();
     }
     else {
      enabledScroll();
     }
}

function authorized() {
  
  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }
    userName.textContent = login; 
    buttonAuth.style.display = 'none';
    userName.style.display = 'inline';
    buttonOut.style.display = 'block';
    buttonOut.addEventListener('click', logOut);
    console.log('login'); 
}
function notAuthorized() {
  function logIn(event) {
    event.preventDefault();
    if (loginInput.value.trim(), passwordInput.value.trim()) {
    
    login = loginInput.value;
    password = passwordInput.value;
    localStorage.setItem('gloDelivery', login);
    toggleModalAuth();
   
    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    loginForm.removeEventListener('submit', logIn);
    loginForm.reset();
    checkAuth();
    }
    else{
      loginInput.style.borderColor = 'red';
      loginInput.value = '';
      passwordInput.style.borderColor = 'red';
      passwordInput.value = '';
      swal('Проверте логин и пароль', '', 'warning');
    }
  }  
    buttonAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    loginForm.addEventListener('submit', logIn);
    modalAuth.addEventListener('click', function (event) {
      if (event.target.classList.contains('is-open')) {
        toggleModalAuth();
      }
    })
}
function checkAuth() {
  if (login){
      authorized();
    } 
    else {
      notAuthorized();
    }
} 
checkAuth();