'use strict';

var amountCards = 8;
var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
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
var map = document.querySelector('.map');
var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
var templateCard = document.querySelector('#card').content.querySelector('.map__card');
var offers = getOffers();

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

function getPhotos(array) {
  var arrPhotos = array.slice();
  return getMixArray(arrPhotos);
}

function getOffers() {
  var arrOffers = [];
  var titlesMix = getMixArray(titles);
  for (var i = 0; i < amountCards; i++) {
    var locationX = getRandomInteger(1, 1050);
    var locationY = getRandomInteger(130, 630);
    var card = {
      id: i,
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

/*
СОЗДАНИЕ ПИНА
*/
function renderPin(obj) {
  var pinElement = templatePin.cloneNode(true);
  pinElement.dataset.id = obj.id;
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
  var cardElement = templateCard.cloneNode(true);
  var cardFeatures = cardElement.querySelector('.popup__features');
  var featuresFragment = getFragmentFeatures(obj.offer.features);
  var cardPhotos = cardElement.querySelector('.popup__photos');
  var photosFragment = getFragmentPhotos(obj.offer.photos);
  cardElement.querySelector('.popup__title').textContent = obj.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = obj.offer.address;
  cardElement.querySelector('.popup__text--price').innerHTML = obj.offer.price + '&#x20bd<span>/ночь</span>';
  cardElement.querySelector('.popup__type').textContent = getOfferType(obj);
  cardElement.querySelector('.popup__text--capacity').textContent = getTextCapacity(obj);
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ' выезд после ' + obj.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = obj.offer.description;
  cardElement.querySelector('.popup__avatar').src = obj.author.avatar;
  cardFeatures.innerHTML = '';
  cardFeatures.appendChild(featuresFragment);
  cardPhotos.innerHTML = '';
  cardPhotos.appendChild(photosFragment);
  return cardElement;
}

function openCard(obj) {
  var newNotice = createNoticeElement(obj);
  map.appendChild(newNotice);
  var popupClose = map.querySelector('.popup__close');
  popupClose.addEventListener('click', onClickCloseOffer);
  document.addEventListener('keydown', onOfferEscPress);
}

/*
MODULE4 - TASK1
*/
var HIEGHT_PIN = 20;
var ESC_KEYCODE = 27;
var mapPinMain = map.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var adFormFieldSets = adForm.querySelectorAll('fieldset');
var mapFilters = document.querySelector('.map__filters');
var filterFormItems = mapFilters.querySelectorAll('.map__filters > *');
var address = adForm.querySelector('#address');
var firstCoords = getAddress(mapPinMain);

changeAvailabilityFields(filterFormItems);
changeAvailabilityFields(adFormFieldSets);
setAddress(firstCoords);

map.addEventListener('click', onClickPin);
mapPinMain.addEventListener('mouseup', onClickMainPin);

function onClickPin(evt) {
  var pin = evt.target.closest('.map__pin:not(.map__pin--main)');
  if (pin) {
    var id = pin.dataset.id;
    var data = offers[id];
    closeCard();
    openCard(data);
  }
}

function closeCard() {
  var card = map.querySelector('.map__card');
  if (card) {
    card.remove();
  }
  document.removeEventListener('keydown', onOfferEscPress);
}

function onClickCloseOffer() {
  closeCard();
}

function onOfferEscPress(evt) {
  if (evt.which === ESC_KEYCODE) {
    closeCard();
  }
}

function changeAvailabilityFields(formFields) {
  var isFormDisabled = isMapDisabled();
  for (var i = 0; i < formFields.length; i++) {
    formFields[i].disabled = isFormDisabled;
  }
}

function isMapDisabled() {
  return map.classList.contains('map--faded');
}

function activatePage() {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
}

function onClickMainPin() {
  activatePage();
  addPins(offers);
  changeAvailabilityFields(adFormFieldSets);
  changeAvailabilityFields(filterFormItems);
  var addressCoords = getAddress(mapPinMain);
  setAddress(addressCoords);
}

function setAddress(coords) {
  address.value = coords.x + ', ' + coords.y;
}

function getAddress(elem) {
  var pinLeft = elem.style.left;
  var pinTop = elem.style.top;
  var x = parseInt(pinLeft, 10) + Math.round(elem.clientWidth / 2);
  var y = parseInt(pinTop, 10) + Math.round(elem.clientHeight + HIEGHT_PIN);
  if (map.classList.contains('map--faded')) {
    y = parseInt(pinTop, 10) + Math.round(elem.clientHeight / 2);
  }
  return {x: x, y: y};
}


