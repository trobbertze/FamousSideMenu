SideView = function(kwargs) {
  var Surface    = require('famous/core/Surface');
  var Modifier   = require('famous/core/Modifier');
  var Transform  = require('famous/core/Transform');
  var View       = require('famous/core/View');
  var GridLayout = require('famous.views/GridLayout');

  // ---------------------------------------------------------------------------
  function _SideView(kwargs) {
    View.apply(this, arguments);

    this.width = kwargs.width;

    this.open = false;

    this.hinge = new Modifier({
      transform: Transform.thenMove(
        Transform.rotateY(-Math.PI/2.5),
        [-this.width, 0, 0]
      )
    });

    this.layout = new GridLayout({
      dimensions: [1, 6]
    });

    this.buttons = [];
    this.layout.sequenceFrom(this.buttons);

    this._createButtons(kwargs);

    this._add(
      new Modifier(
        {size : [this.width, undefined]}
      )
    ).add(
      new Modifier({origin : [1,0]})
    ).add(
      this.hinge
    ).add(
      this.layout
    );
  }

  // ---------------------------------------------------------------------------
  _SideView.prototype = Object.create(View.prototype);
  _SideView.prototype.constructor = _SideView;

  // ---------------------------------------------------------------------------
  _SideView.prototype.flipOut = function() {
    this.hinge.setTransform(
      Transform.translate(-this.width, 0, 0),
      { duration: 500, curve: 'easeOut' }
    );
  };
  // ---------------------------------------------------------------------------
  _SideView.prototype.flipIn = function(cb) {
    this.hinge.setTransform(
      Transform.thenMove(Transform.rotateY(-Math.PI/2.2),
      [-this.width, 0, 0]),
      { duration: 500, curve: 'easeOut' },
      cb
    );
  };

  // ---------------------------------------------------------------------------
  _SideView.prototype.selectButton = function(button, action) {
    this._eventOutput.emit('select', action);

    _.each(this.buttons, function(_button){
      if(_button.id !== button.id) {
        _button.unSelect();
      }
    }, this);
  };
  // ---------------------------------------------------------------------------
  _SideView.prototype._createButtons = function(kwargs) {
    for(var i = 0; i < kwargs.buttons.length; i++) {
      var button = new MenuButton(_.extend({id: i}, kwargs.buttons[i]));
      button.on("select", this.selectButton.bind(this, button));
      this.buttons.push(button);
    }
  };

  return new _SideView(kwargs);
};
