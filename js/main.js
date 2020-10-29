'use strict';

const RED_COLOR = '#ff0000';
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

const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');


let login = localStorage.getItem('gloDelivery');
let password;

const getData = async function (url) {

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error by adress ${url},
     status of error ${response.status}!`);
  }
  return await response.json();
};
console.dir(getData);

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
      alert('Проверте логин и пароль', '', 'warning');
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
function createCardRestaurant(restaurant) {
  const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant;

  const cardRestaurant = document.createElement('a');
  cardRestaurant.className = 'card card-restaurant';
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, name, price, stars };

  const card = `
    
     <img src=${image} alt=${name} class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
           <h3 class="card-title">${name}</h3>
           <span class="card-tag tag">${timeOfDelivery}</span>
          </div>
           <div class="card-info">
            <div class="rating">${stars}</div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
           </div>
        </div>
    </a>
  `;
  cardRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
}


function createCardGoods(goods) {
  const { description, name, price, image } = goods;
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="${name}" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title card-title-reg">${name}</h3>
          </div>
          <div class="card-info">
            <p class="ingredients">
              ${description}
            </p>
          </div>
          <div class="card-buttons">
            <button class="button button-primary button-add-cart">
              <span class="button-card-text">В корзину</span>
              <span class="button-cart-svg"></span>
            </button>
          <strong class="card-price-bold">${price} ₽</strong>
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

      const { kitchen, name, price, stars } = restaurant.info;
      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;
      location.hash = `#${name}`;

      getData(`./db/${restaurant.products}`).then(function (data) {
        data.forEach(createCardGoods)
      });
    }
  } else {
    toggleModalAuth();
  }
}

function init() {

  inputSearch.addEventListener('keypress', function (event) {
    if (event.charCode === 13) {

      const value = event.target.value.trim();

      if (!value) {
        event.target.style.backgroundColor = RED_COLOR;
        event.target.value = '';
        setTimeout(function () {
          event.target.style.backgroundColor = '';
        }, 1500)
        return;
      }
      getData('./db/partners.json')
        .then(function (data) {
          return data.map(function (partner) {
            return partner.products;
          });
        })
        .then(function (linksProduct) {
          cardsMenu.textContent = '';
          linksProduct.forEach(function (link) {
            getData(`./db/${link}`)
              .then(function (data) {
                const resultSearch = data.filter(function (item) {
                  const name = item.name.toLowerCase();
                  return name.includes(value.toLowerCase());
                })

                swiperContainer.classList.add('hide');
                restaurants.classList.add('hide');
                menu.classList.remove('hide');

                restaurantTitle.textContent = 'Результат';
                restaurantRating.textContent = '';
                restaurantPrice.textContent = '';
                restaurantCategory.textContent = 'Все кухни';
                resultSearch.forEach(createCardGoods);
              })
          })
        })
    }
  });



  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant)
  });
  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', function () {
    swiperContainer.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  })

  checkAuth();

  new Swiper('.swiper-container', {
    effect: 'coverflow',
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    autoplay: true,
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

}

init();