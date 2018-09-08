'use strict';

function getRandomInteger(min, max) {
  var randomNumber = min + Math.random() * (max + 1 - min);
  return Math.floor(randomNumber);
}

function getRandomArrayElement(arr) {
  var min = 0;
  var max = arr.length - 1;
  var randomElement = getRandomInteger(min, max);

  return arr[randomElement];
}

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
}

function getArrRandomLength(arr) {
  var min = 0;
  var max = arr.length;
  var randomIndex = getRandomInteger(min, max);

  return arr.slice(0, randomIndex);
}

var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

function getPhotos(array) {
  var arrPhotos = array.slice();
  return getMixArray(arrPhotos);
}

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

function getOffers() {

  var arrOffers = [];
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
    arrOffers.push(card);
  }
  return arrOffers;
}

var map = document.querySelector('.map');
map.classList.remove('map--faded');
/*
СОЗДАНИЕ ПИНА
*/
var offers = getOffers();

function renderPin(obj) {
  var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinElement = templatePin.cloneNode(true);
  pinElement.style.top = obj.location.y + 'px';
  pinElement.style.left = obj.location.x + 'px';
  pinElement.querySelector('img').src = obj.author.avatar;
  pinElement.querySelector('img').alt = obj.offer.title;

  return pinElement;
}

function createPinElements(array) {
  var fragmentPins = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    var pin = renderPin(array[i]);
    fragmentPins.appendChild(pin);
  }
  return fragmentPins;
}

function addPins(array) {
  var mapPins = document.querySelector('.map__pins');
  var newPin = createPinElements(array);
  return mapPins.appendChild(newPin);
}

addPins(offers);
/*
*СОЗДАНИЕ ОБЪЯВЛЕНИЯ
*/
function getFragmentFeatures(array) {
  var fragmentFeatures = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    var newElement = document.createElement('li');
    var className = 'popup__feature--' + array[i];
    newElement.classList.add('popup__feature');
    newElement.classList.add(className);
    fragmentFeatures.appendChild(newElement);
  }
  return fragmentFeatures;
}

function getFragmentPhotos(array) {
  var fragmentPhotos = document.createDocumentFragment();
  var popupPhoto = document.querySelector('#card').content.querySelector('.popup__photo');
  for (var i = 0; i < array.length; i++) {
    var newElement = popupPhoto.cloneNode(true);
    newElement.src = array[i];
    fragmentPhotos.appendChild(newElement);
  }
  return fragmentPhotos;
}

function getOfferType(obj) {
  var offerType;
  switch (obj.offer.type) {
    case 'flat': offerType = 'Квартира';
      break;
    case 'palace': offerType = 'Дворец';
      break;
    case 'bungalo': offerType = 'Бунгало';
      break;
    case 'house': offerType = 'Дом';
      break;
    default: offerType = 'Ночлежка';
      break;
  }
  return offerType;
}

function getTextCapacity(obj) {
  var rooms = obj.offer.rooms;
  var guests = obj.offer.guests;
  var textCapacity;
  if (rooms === 1 && guests === 1) {
    textCapacity = rooms + ' комната для ' + guests + ' гостя';
  } else if (rooms >= 2 && guests === 1) {
    textCapacity = rooms + ' комнаты для ' + guests + ' гостя';
  } else if (rooms === 1 && guests >= 2) {
    textCapacity = rooms + ' комнатa для ' + guests + ' гостей';
  } else if (rooms === 5 && guests === 1) {
    textCapacity = rooms + ' комнат для ' + guests + ' гостя';
  } else if (rooms === 5 && guests >= 2) {
    textCapacity = rooms + ' комнат для ' + guests + ' гостей';
  } else {
    textCapacity = rooms + ' комнаты для ' + guests + ' гостей';
  }
  return textCapacity;
}

function createNoticeElement(obj) {
  var templateCard = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = templateCard.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = obj.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = obj.offer.address;
  cardElement.querySelector('.popup__text--price').innerHTML = obj.offer.price + '&#x20bd<span>/ночь</span>';
  cardElement.querySelector('.popup__type').textContent = getOfferType(obj);
  cardElement.querySelector('.popup__text--capacity').textContent = getTextCapacity(obj);
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ' выезд после ' + obj.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = obj.offer.description;
  cardElement.querySelector('.popup__avatar').src = obj.author.avatar;
  var cardFeatures = cardElement.querySelector('.popup__features');
  var featuresFragment = getFragmentFeatures(obj.offer.features);
  cardFeatures.innerHTML = '';
  cardFeatures.appendChild(featuresFragment);
  var cardPhotos = cardElement.querySelector('.popup__photos');
  var photosFragment = getFragmentPhotos(obj.offer.photos);
  cardPhotos.innerHTML = '';
  cardPhotos.appendChild(photosFragment);

  return cardElement;
}

function addNotice(obj) {
  var newNotice = createNoticeElement(obj);
  map.appendChild(newNotice);
}

addNotice(offers[0]);


