'use strict';

document.querySelector('.map').classList.add('map--faded');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var imgTemplate = document.querySelector('#card').content.querySelector('.popup__photo');
var pinListElement = document.querySelector('.map__pins');
var cardListElement = document.querySelector('.map');
var filters = document.querySelector('.map__filters-container');
var photosfragment = document.createDocumentFragment();
var fragment = document.createDocumentFragment();

var avatars = [
  'img/avatars/user01.png',
  'img/avatars/user02.png',
  'img/avatars/user03.png',
  'img/avatars/user04.png',
  'img/avatars/user05.png',
  'img/avatars/user06.png',
  'img/avatars/user07.png',
  'img/avatars/user08.png'
];

var names = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var types = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var typesRus = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var times = [
  '12:00',
  '13:00',
  '14:00'
];

var facilities = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var pictures = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var getRandomInteger = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
};

var getMixedArray = function (arr) {
  for(var i = arr.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

var getRandomСonsist = function (arr) {
  getMixedArray(arr);
  var qty = getRandomInteger(1, arr.length);
  var consist = [];
  for (var i = 0; i < qty; i++) {
    consist.push(arr[i]);
    }
  return consist;
}

var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

getMixedArray(avatars);

var getElements = function (arr, arrLength) {
  for (var i = 0; i < arrLength; i++) {
    var obj = {};

    obj.location = {
      x: getRandomInteger(0, document.body.clientWidth),
      y: getRandomInteger(130, 630)
    };

    obj.offer = {
      title: getRandomElement(names),
      address: obj.location.x + ' ,' + obj.location.y,
      price: getRandomInteger(1000, 1000000),
      type: getRandomElement(types),
      rooms: getRandomInteger(1, 5),
      guests: Math.floor(Math.random() * 10) + 1,
      checkin: getRandomElement(times),
      checkout: getRandomElement(times),
      features: getRandomСonsist(facilities),
      description: '',
      photos: getMixedArray(pictures)
    };

    obj.author = {
        avatar: avatars[i]
    };

   arr[i] = obj;
  };
  return arr;
};

var itemListLength = 8;
var items = [];
getElements(items, itemListLength);

for (var i = 0; i < items.length; i++) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + (items[i].location.x - 25) + 'px; top: ' + (items[i].location.y - 70) + 'px;';
  pinElement.querySelector('img').src = items[i].author.avatar;
  pinElement.querySelector('img').alt = items[i].offer.title;

  fragment.appendChild(pinElement);
};

pinListElement.innerHTML = '';
pinListElement.appendChild(fragment);

for (var i = 0; i < items.length; i++) {
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = items[i].offer.title;
  cardElement.querySelector('.popup__text--address').textContent = items[i].offer.address;
  cardElement.querySelector('.popup__text--price').innerHTML = items[i].offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = typesRus[items[i].offer.type];
  cardElement.querySelector('.popup__text--capacity').innerHTML = items[i].offer.rooms + ' комнат(ы) для ' + items[i].offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').innerHTML = 'Заезд после ' + items[i].offer.checkin + ', выезд до ' + items[i].offer.checkout;

  var listFeatures = cardTemplate.querySelector('.popup__features');
  listFeatures.innerHTML = '';
  for (var j = 0; j < items[i].offer.features.length; j++) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('popup__feature');
    featureElement.classList.add('popup__feature--' + items[i].offer.features[j]);
    listFeatures.appendChild(featureElement);
  };

  cardElement.querySelector('.popup__description').textContent = items[i].offer.description;

  for (var j = 0; j < items[i].offer.photos.length; j++) {
    if (j ===0) {
      imgTemplate.src = items[i].offer.photos[j];
    } else {
      var photoElement = imgTemplate.cloneNode(true);
      photoElement.src = items[i].offer.photos[j];
      photosfragment.appendChild(photoElement);
    };
  };

  cardElement.querySelector('.popup__photos').appendChild(photosfragment);
  cardElement.querySelector('.popup__avatar').src = items[i].author.avatar;
  fragment.appendChild(cardElement);
};

cardListElement.insertBefore(fragment, filters);
