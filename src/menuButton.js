MenuButton = function(kwargs) {
  var Surface  = require('famous/core/Surface');
  var Modifier   = require('famous/core/Modifier');
  var Transform  = require('famous/core/Transform');
  var View   = require('famous/core/View');
  var GridLayout = require('famous.views/GridLayout');
  // ---------------------------------------------------------------------------
  function _MenuButton(kwargs) {
    View.apply(this, arguments);

    this.id = kwargs.id;

    this.setDefaults(kwargs);

    this.backingSurface = new Surface({
      size: [undefined, undefined],
      classes: ["side-view-button"],
      properties: {
      backgroundColor: this.backgroundColor
      }
    });

    this.iconSurface = new Surface({
      size: [undefined, 30],
      classes: ["side-view-button"],
      content: "<span class='icon'>" +
        kwargs['icon']       +
         "</span>"         +
         "<span class='text'>"   +
        kwargs["title"]      +
         "</span>",
      properties: {
      backgroundColor: this.backgroundColor,
      color: kwargs['color']
      }
    });

    var iconMod = new Modifier({
      transform: Transform.translate(0, 10, 1),
      size: [this.width, undefined],
      origin: [0, 0]
    });

    this.iconSurface.on("click", this.onClick.bind(this));

    this.add(this.backingSurface);
    this.add(iconMod).add(this.iconSurface);
  }
  // ---------------------------------------------------------------------------
  _MenuButton.prototype = Object.create(View.prototype);
  _MenuButton.prototype.constructor = _MenuButton;
  // ---------------------------------------------------------------------------
  _MenuButton.prototype.setDefaults = function(kwargs) {
    if (_.has(kwargs, "action")) {
      this.action = kwargs.action;
    }
    if (_.has(kwargs, "backgroundColor")) {
      this.backgroundColor = kwargs.backgroundColor;
    }
    if (_.has(kwargs, "selectedBackgroundColor")) {
      this.selectedBackgroundColor = kwargs.selectedBackgroundColor;
    }
  };
  // ---------------------------------------------------------------------------
  _MenuButton.prototype.onClick = function(evt) {
    this.select();
  };
  // ---------------------------------------------------------------------------
  _MenuButton.prototype.select = function() {
    this.backingSurface.setProperties(
      {
        backgroundColor: this.selectedBackgroundColor
      }
    );
    this.iconSurface.setProperties(
      {
        backgroundColor: this.selectedBackgroundColor
      }
    );
    this.action.flipOpen();
    this._eventOutput.emit('select', this.action);
  };
  // ---------------------------------------------------------------------------
  _MenuButton.prototype.unSelect = function() {
    this.backingSurface.setProperties(
      {
        backgroundColor: this.backgroundColor
      }
    );
    this.iconSurface.setProperties(
      {
        backgroundColor: this.backgroundColor
      }
    );
    this.action.flipClose();
    this._eventOutput.emit('unSelect', this.action);
  };

  return new _MenuButton(kwargs);
}
