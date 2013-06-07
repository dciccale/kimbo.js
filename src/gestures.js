var CURRENT_TOUCH, FIRST_TOUCH, GESTURE, GESTURES, HOLD_DELAY, TAPS, TOUCH_TIMEOUT, _angle, _capturePinch, /*_captureRotation,*/ _cleanGesture, _distance, _fingersPosition, _getTouches, _hold, _isSwipe, _onTouchEnd, _onTouchMove, _onTouchStart, _parentIfText, _swipeDirection, _trigger;

TAPS = null;
GESTURE = {};
FIRST_TOUCH = [];
CURRENT_TOUCH = [];
HOLD_DELAY = 650;
GESTURES = ['tap', 'singleTap', 'doubleTap', 'hold', 'swipe', 'swiping', 'swipeLeft', 'swipeRight', 'swipeUp',
  'swipeDown', 'rotate', 'rotating', 'rotateLeft', 'rotateRight', 'pinch', 'pinching', 'pinchIn', 'pinchOut', 'drag',
  'dragLeft', 'dragRight', 'dragUp', 'dragDown'];

Kimbo.forEach(GESTURES, function (event) {
  Kimbo.fn[event] = function (callback) {
    return Kimbo(document.body).on(event, callback);
  };
});

// if (Kimbo.isMobile()) {
Kimbo(function () {
  Kimbo(document.body)
    .on('touchstart', _onTouchStart)
    .on('touchmove', _onTouchMove)
    .on('touchend', _onTouchEnd)
    .on('touchcancel', _cleanGesture);
});
// }

_onTouchStart = function (event) {
  var delta, fingers, now, touches;
  now = Date.now();
  delta = now - (GESTURE.last || now);
  TOUCH_TIMEOUT && clearTimeout(TOUCH_TIMEOUT);
  touches = _getTouches(event);
  fingers = touches.length;
  FIRST_TOUCH = _fingersPosition(touches, fingers);
  GESTURE.el = Kimbo(_parentIfText(touches[0].target));
  GESTURE.fingers = fingers;
  GESTURE.last = now;

  if (!GESTURE.taps) {
    GESTURE.taps = 0;
  }

  GESTURE.taps++;

  if (fingers === 1) {
    if (fingers >= 1) {
      GESTURE.gap = delta > 0 && delta <= 250;
    }
    return setTimeout(_hold, HOLD_DELAY);

  } else if (fingers === 2) {
    GESTURE.initial_angle = parseInt(_angle(FIRST_TOUCH), 10);
    GESTURE.initial_distance = parseInt(_distance(FIRST_TOUCH), 10);
    GESTURE.angle_difference = 0;
    return GESTURE.distance_difference = 0;
  }
};

_onTouchMove = function(event) {
  var fingers, is_swipe, touches;

  if (GESTURE.el) {
    touches = _getTouches(event);
    fingers = touches.length;

    if (fingers === GESTURE.fingers) {
      CURRENT_TOUCH = _fingersPosition(touches, fingers);
      is_swipe = _isSwipe(event);

      if (is_swipe) {
        GESTURE.prevSwipe = true;
      }

      if (is_swipe || GESTURE.prevSwipe === true) {
        _trigger('swiping');
      }

      if (fingers === 2) {
        //_captureRotation();
        _capturePinch();
        event.preventDefault();
      }

    } else {
      _cleanGesture();
    }
  }

  return true;
};

_isSwipe = function() {
  var it_is = false,
    move_horizontal,
    move_vertical;

  if (CURRENT_TOUCH[0]) {
    move_horizontal = Math.abs(FIRST_TOUCH[0].x - CURRENT_TOUCH[0].x) > 30;
    move_vertical = Math.abs(FIRST_TOUCH[0].y - CURRENT_TOUCH[0].y) > 30;
    it_is = GESTURE.el && (move_horizontal || move_vertical);
  }

  return it_is;
};

_onTouchEnd = function() {
  var anyevent, drag_direction, pinch_direction, rotation_direction, swipe_direction;

  if (GESTURE.fingers === 1) {

    if (GESTURE.taps === 2 && GESTURE.gap) {
      _trigger('doubleTap');
      return _cleanGesture();

    } else if (_isSwipe() || GESTURE.prevSwipe) {
      _trigger('swipe');
      swipe_direction = _swipeDirection(FIRST_TOUCH[0].x, CURRENT_TOUCH[0].x, FIRST_TOUCH[0].y, CURRENT_TOUCH[0].y);
      _trigger('swipe' + swipe_direction);
      return _cleanGesture();

    } else {
      _trigger('tap');
      if (GESTURE.taps === 1) {
        TOUCH_TIMEOUT = setTimeout(function() {
          _trigger('singleTap');
          return _cleanGesture();
        }, 100);
      }
    }

  } else {
    anyevent = false;

    if (GESTURE.angle_difference !== 0) {
      _trigger('rotate', {
        angle: GESTURE.angle_difference
      });
      rotation_direction = GESTURE.angle_difference > 0 ? 'rotateRight' : 'rotateLeft';
      _trigger(rotation_direction, {
        angle: GESTURE.angle_difference
      });
      anyevent = true;
    }

    if (GESTURE.distance_difference !== 0) {
      _trigger('pinch', {
        angle: GESTURE.distance_difference
      });
      pinch_direction = GESTURE.distance_difference > 0 ? 'pinchOut' : 'pinchIn';
      _trigger(pinch_direction, {
        distance: GESTURE.distance_difference
      });
      anyevent = true;
    }

    if (!anyevent && CURRENT_TOUCH[0]) {
      if (Math.abs(FIRST_TOUCH[0].x - CURRENT_TOUCH[0].x) > 10 || Math.abs(FIRST_TOUCH[0].y - CURRENT_TOUCH[0].y) > 10) {
        _trigger('drag');
        drag_direction = _swipeDirection(FIRST_TOUCH[0].x, CURRENT_TOUCH[0].x, FIRST_TOUCH[0].y, CURRENT_TOUCH[0].y);
        _trigger('drag' + drag_direction);
      }
    }

    return _cleanGesture();
  }
};

_fingersPosition = function(touches, fingers) {
  var i = 0, result = [];

  touches = touches[0].targetTouches ? touches[0].targetTouches : touches;

  while (i < fingers) {
    result.push({
      x: touches[i].pageX,
      y: touches[i].pageY
    });
    i++;
  }

  return result;
};

/*_captureRotation = function() {
  var angle = parseInt(_angle(CURRENT_TOUCH), 10),
    diff = parseInt(GESTURE.initial_angle - angle, 10),
    i, symbol;

  if (Math.abs(diff) > 20 || GESTURE.angle_difference !== 0) {
    i = 0;
    symbol = GESTURE.angle_difference < 0 ? '-' : '+';

    while (Math.abs(diff - GESTURE.angle_difference) > 90 && i++ < 10) {
      eval('diff ' + symbol + '= 180;');
    }

    GESTURE.angle_difference = parseInt(diff, 10);

    return _trigger('rotating', {
      angle: GESTURE.angle_difference
    });
  }
};*/

_capturePinch = function() {
  var diff = GESTURE.initial_distance - distance,
    distance = parseInt(_distance(CURRENT_TOUCH), 10);

  if (Math.abs(diff) > 10) {
    GESTURE.distance_difference = diff;
    return _trigger('pinching', {
      distance: diff
    });
  }
};

_trigger = function(type, params) {
  if (GESTURE.el) {
    params = params || {};
    if (CURRENT_TOUCH[0]) {
      params.iniTouch = (GESTURE.fingers > 1 ? FIRST_TOUCH : FIRST_TOUCH[0]);
      params.currentTouch = (GESTURE.fingers > 1 ? CURRENT_TOUCH : CURRENT_TOUCH[0]);
    }
    return GESTURE.el.trigger(type, params);
  }
};

_cleanGesture = function() {
  FIRST_TOUCH = [];
  CURRENT_TOUCH = [];
  GESTURE = {};
  return clearTimeout(TOUCH_TIMEOUT);
};

_angle = function(touches_data) {
  var A, B, angle;
  A = touches_data[0];
  B = touches_data[1];
  angle = Math.atan((B.y - A.y) * -1 / (B.x - A.x)) * (180 / Math.PI);
  if (angle < 0) {
    return angle + 180;
  } else {
    return angle;
  }
};

_distance = function(touches_data) {
  var A, B;
  A = touches_data[0];
  B = touches_data[1];
  return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y)) * -1;
};

_getTouches = function(event) {
  if (Kimbo.isMobile()) {
    return event.touches;
  } else {
    return [event];
  }
};

_parentIfText = function (node) {
  return ('tagName' in node) ? node : node.parentNode;
};

_swipeDirection = function(x1, x2, y1, y2) {
  var xDelta = Math.abs(x1 - x2);
  var yDelta = Math.abs(y1 - y2);

  if (xDelta >= yDelta) {
    if (x1 - x2 > 0) {
      return 'Left';
    } else {
      return 'Right';
    }
  } else {
    if (y1 - y2 > 0) {
      return 'Up';
    } else {
      return 'Down';
    }
  }
};

_hold = function() {
  if (GESTURE.last && (Date.now() - GESTURE.last >= HOLD_DELAY)) {
    _trigger('hold');
    return GESTURE.taps = 0;
  }
};
