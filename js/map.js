'use strict';

function getRandomInteger(min, max) {
  var randomNumber = min + Math.random() * (max + 1 - min);
  return Math.floor(randomNumber);
};

function getRandomArrayElement(arr) {
  var min = 0;
  var max = arr.length - 1;
  var randomElement = getRandomInteger(min, max);

  return arr[randomElement];
};

function getMixArray(arr) {
  var j;
  var temp;
  for (var i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

function getArrRandomLength(arr) {
  var min = 0;
  var max = arr.length;
  var randomIndex = getRandomInteger(min, max);

  return arr.slice(0, randomIndex);
};

var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

function getPhotos(array) {
  var photos = array.slice();
  return getMixArray(photos);
};

var amountCards = 8;
var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var types = ['palace', 'flat', 'house', 'bungalo'];
var times = ['12:00', '13:00', '14:00'];
var features = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

function getCards() {

  var arrCards = [];
  var titlesMix = getMixArray(titles);
  for (var i = 0; i < amountCards; i++) {
    var locationX = getRandomInteger(1, 1050);
    var locationY = getRandomInteger(130, 630);
    var card = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: titlesMix[i],
        address: locationX + ', ' + locationY,
        price: getRandomInteger(1000, 1000000),
        type: getRandomArrayElement(types),
        rooms: getRandomInteger(1, 5),
        guests: getRandomInteger(1, 10),
        checkin: getRandomArrayElement(times),
        checkout: getRandomArrayElement(times),
        features: getArrRandomLength(features),
        description: '',
        photos: getPhotos(photos)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
    arrCards.push(card);
  }
  return arrCards;
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');
/*
СОЗДАНИЕ ПИНА
*/
var cards = getCards();

function createPinElements (array) {
  var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragmentPins = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    var pinElement = templatePin.cloneNode(true);
    pinElement.style.top = array[i].location.y + 'px';
    pinElement.style.left = array[i].location.x + 'px';
    pinElement.querySelector('img').src = array[i].author.avatar;
    pinElement.querySelector('img').alt = array[i].offer.title;
    fragmentPins.appendChild(pinElement);
  }
  return fragmentPins;
};

function addPins () {
  var mapPins = document.querySelector('.map__pins');
  return mapPins.appendChild(createPinElements(cards));
};

addPins();
/*
*СОЗДАНИЕ ОБЪЯВЛЕНИЯ
**/

var templateCard = document.querySelector('#card').content.querySelector('.map__card');

function getFragmentFeatures (array) {
  var fragmentFeatures = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    var newElement = document.createElement('li');
    var className = '.popup__feature--' + array[i];
    newElement.classList.add('.popup__feature');
    newElement.classList.add(className);
    fragmentFeatures.appendChild(newElement);
  }
  return fragmentFeatures;
};

function getFragmentPhotos (array) {
  var fragmentPhotos = document.createDocumentFragment();
  var popupPhoto = document.querySelector('#card').content.querySelector('.popup__photo');
  for (var i = 0; i < array.length; i++) {
    var newElement = popupPhoto.cloneNode(true);
    newElement.src = array[i];
    fragmentPhotos.appendChild(newElement);
  }
  return fragmentPhotos;
};

function createNoticeElement (array) {
  var fragmentCards = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    var cardElement = templateCard.cloneNode(true);
    cardElement.querySelector('.popup__title').textContent = array[i].offer.title;
    cardElement.querySelector('.popup__text--address').textContent = array[i].offer.address;
    cardElement.querySelector('.popup__text--price').innerHTML = array[i].offer.price + '&#x20bd<span>/ночь</span>';
    switch (array[i].offer.type) {
      case 'flat': cardElement.querySelector('.popup__type').textContent = 'Квартира';
        break;
      case 'palace': cardElement.querySelector('.popup__type').textContent = 'Дворец';
        break;
      case 'bungalo': cardElement.querySelector('.popup__type').textContent = 'Бунгало';
        break;
      case 'house': cardElement.querySelector('.popup__type').textContent = 'Дом';
        break;
      default: cardElement.querySelector('.popup__type').textContent = 'Ночлежка';
        break;
    }
    var rooms = array[i].offer.rooms;
    var guests = array[i].offer.guests;
    if (rooms === 1 && guests === 1) {
      cardElement.querySelector('.popup__text--capacity').textContent = rooms + ' комната для ' + guests + ' гостя';
    } else if (rooms >= 2 && guests === 1) {
      cardElement.querySelector('.popup__text--capacity').textContent = rooms + ' комнаты для ' + guests + ' гостя';
    } else if (rooms === 1 && guests >= 2) {
      cardElement.querySelector('.popup__text--capacity').textContent = rooms + ' комнатa для ' + guests + ' гостей';
    } else {
      cardElement.querySelector('.popup__text--capacity').textContent = rooms + ' комнаты для ' + guests + ' гостей';
    }
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + array[i].offer.checkin + ' выезд после ' + array[i].offer.checkout;

    var cardFeatures = cardElement.querySelector('.popup__features');
    cardFeatures.innerHTML = '';
    cardFeatures.appendChild(getFragmentFeatures(array[i].offer.features));
    cardElement.querySelector('.popup__description').textContent = array[i].offer.description;

    var cardPhotos = cardElement.querySelector('.popup__photos');
    cardPhotos.innerHTML = '';
    cardPhotos.appendChild(getFragmentPhotos(array[i].offer.photos));
    cardElement.querySelector('.popup__avatar').src = array[i].author.avatar;

    fragmentCards.appendChild(cardElement);
  }
  return fragmentCards;
};
/*
ДВА ВАРИАНТА ФУНКЦИИ
function addNotice () {
  var fragment = createNoticeElement(cards);
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var newNotices = fragment.querySelector('.map__card');
  return map.insertBefore(newNotices, mapFiltersContainer);
};

addNotice ();
*/
function addNotice () {
  var fragment = createNoticeElement(cards);
  var newNotices = fragment.querySelector('.map__card');
  return map.appendChild(newNotices);
};

addNotice ();


