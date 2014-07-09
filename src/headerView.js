HeaderView = function(kwargs) {
    // Famous Modules
    var Surface   = require('famous/core/Surface');
    var Modifier  = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing    = require('famous/transitions/Easing');
    var Transform = require('famous/core/Transform');
    var View      = require('famous/core/View');
    var Utility   = require('famous/utilities/Utility');

    function _HeaderView(kwargs) {
        View.apply(this, arguments);

        this.hamburger = new Surface({
            size: [true, 50],
            content: "&#xf0c9;",
            classes: ["headerIcon"],
            properties: {
                lineHeight: "50px",
                color: kwargs.color,
                zIndex: 51,
            }
        });

        this.hamburger.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));

        this.title = new Surface({
            size: [undefined, 50],
            content: kwargs.title,
            properties: {
                color: kwargs.color,
                textAlign: 'center',
                fontSize: '20px',
                lineHeight: '50px',
                zIndex: 50,
                backgroundColor: kwargs.backgroundColor
            }
        });

        var addButton = new Surface({
    			size: [true, 50],
    			content: "&#xf055;",
    			classes: ["headerIcon"],
    			properties: {
    				lineHeight: "50px",
            color: kwargs.color,
            zIndex: 51,
    			}
    		});

        this.addButtonAction = function() {};

        this.test = new View();
        this.test._add(new Modifier({
            transform: Transform.translate(15, 0, 0),
            origin: [0, 0]
        })).add(this.hamburger);

        this.test._add(new Modifier({
            origin: [0.5, 0]
        })).add(this.title);

        this.addButtonModifier = new StateModifier({
          transform: Transform.translate(-20, 0, 0),
          origin: [1, 0],
          opacity: 0
        });

        addButton.on("click", this.onAddButtonClicked.bind(this));

        this.test.add(this.addButtonModifier).add(addButton);

        this._add(Utility.transformInFront).add(this.test);
    }
    // ---------------------------------------------------------------------------
    _HeaderView.prototype = Object.create(View.prototype);
    _HeaderView.prototype.constructor = _HeaderView;
    // ---------------------------------------------------------------------------
    _HeaderView.prototype.showAddButton = function(action){
      this.addButtonAction = action;
      this.addButtonModifier.setOpacity(
        1,
        {
          period: 400,
          curve:Easing.inOutQuad
        }
      );
    };
    // ---------------------------------------------------------------------------
    _HeaderView.prototype.hideAddButton = function(){
      this.addButtonAction = function() {};
      this.addButtonModifier.setOpacity(
        0,
        {
          period: 400,
          curve:Easing.inOutQuad
        }
      );
    };
    // ---------------------------------------------------------------------------
    _HeaderView.prototype.onAddButtonClicked = function() {
      this.addButtonAction();
    };

    return new _HeaderView(kwargs);
};
