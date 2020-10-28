'use strict';

const swiperContainer = document.querySelector('.swiper-container');
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');
let password;

function validName(str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/
  return regName.test(str);
}

function validPassword(str) {
  const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/
  return regPassword.test(str);
}

function toggleModal() {
  modal.classList.toggle('is-open');
}
function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginForm.reset();
  document.getElementById('login').placeholder = '';
  document.getElementById('password').placeholder = '';
  if (modalAuth.classList.contains('is-open')) {
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
    userName.classList.remove('loged');
    swiperContainer.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  }
  userName.classList.toggle('loged');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
}
function notAuthorized() {
  function logIn(event) {
    event.preventDefault();
    if (validName(loginInput.value), validPassword(passwordInput.value)) {
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
    else {
      document.getElementById('login').placeholder = 'Введите логин';
      document.getElementById('password').placeholder = 'Введите пароль';
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
  if (login) {
    authorized();
  }
  else {
    notAuthorized();
  }
}
function createCardRestaurant() {
  const card = `
    <a class="card card-restaurant">
     <img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
           <h3 class="card-title">Тануки</h3>
           <span class="card-tag tag">60 мин</span>
          </div>
           <div class="card-info">
            <div class="rating">4.5</div>
            <div class="price">От 1 200 ₽</div>
            <div class="category">Суши, роллы</div>
           </div>
        </div>
    </a>
  `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}
function createCardGoods() {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
      <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title card-title-reg">Пицца Классика</h3>
          </div>
          <div class="card-info">
            <div class="ingredients">
              Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями, грибы.
            </div>
          </div>
          <div class="card-buttons">
            <button class="button button-primary button-add-cart">
              <span class="button-card-text">В корзину</span>
              <span class="button-cart-svg"></span>
            </button>
          <strong class="card-price-bold">510 ₽</strong>
          </div>
        </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}
function openGoods(event) {
  if (userName.classList.contains('loged')) {
    const target = event.target;
    const restaurant = target.closest('.card-restaurant');

    if (restaurant) {
      cardsMenu.textContent = '';
      swiperContainer.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      createCardGoods();
      createCardGoods();
      createCardGoods();
      createCardGoods();
      createCardGoods();
      createCardGoods();
    }
  } else {
    toggleModalAuth();
  }
}

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', function () {
  swiperContainer.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
})

checkAuth();

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

new Swiper('.swiper-container', {
  effect: 'coverflow',
  loop: true,
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 1,
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
    dragSize: 'auto',
  },
});
