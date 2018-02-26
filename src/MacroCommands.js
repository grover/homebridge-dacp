'use strict';

const MacroCommands = {
  'topmenu': [
    'topmenu'
  ],
  'menu': [
    'menu'
  ],
  'select': [
    'select'
  ],
  'up': [
    'touchDown&time=0&point=20,275',
    'touchMove&time=1&point=20,260',
    'touchMove&time=2&point=20,245',
    'touchMove&time=3&point=20,230',
    'touchMove&time=4&point=20,215',
    'touchMove&time=5&point=20,200',
    'touchUp&time=6&point=20,185'
  ],
  'down': [
    'touchDown&time=0&point=20,250',
    'touchMove&time=1&point=20,255',
    'touchMove&time=2&point=20,260',
    'touchMove&time=3&point=20,265',
    'touchMove&time=4&point=20,270',
    'touchMove&time=5&point=20,275',
    'touchUp&time=6&point=20,275'
  ],
  'left': [
    'touchDown&time=0&point=75,100',
    'touchMove&time=1&point=70,100',
    'touchMove&time=3&point=65,100',
    'touchMove&time=4&point=60,100',
    'touchMove&time=5&point=55,100',
    'touchMove&time=6&point=50,100',
    'touchUp&time=7&point=50,100'
  ],
  'right': [
    'touchDown&time=0&point=50,100',
    'touchMove&time=1&point=55,100',
    'touchMove&time=3&point=60,100',
    'touchMove&time=4&point=65,100',
    'touchMove&time=5&point=70,100',
    'touchMove&time=6&point=75,100',
    'touchUp&time=7&point=75,100'
  ]
};

module.exports = MacroCommands;