HeaderView = function(kwargs) {
    // Famous Modules
    var Surface   = require('famous/core/Surface');
    var Modifier  = require('famous/core/Modifier');
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
                color: kwargs.color
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
                backgroundColor: kwargs.backgroundColor
            }
        });

        this.test = new View();
        this.test._add(new Modifier({
            transform: Transform.translate(15, 0, 0),
            origin: [0, 0]
        })).add(this.hamburger);

        this.test._add(new Modifier({
            origin: [0.5, 0]
        })).add(this.title);

        this._add(Utility.transformInFront).add(this.test);
    };

    _HeaderView.prototype = Object.create(View.prototype);
    _HeaderView.prototype.constructor = _HeaderView;

    return new _HeaderView(kwargs);
};