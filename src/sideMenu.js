SideMenu = function(options){
  // Famous Modules
  require("famous/core/famous");
  var View          = require('famous/core/View');
  var RenderNode    = require('famous/core/RenderNode');
  var Transform     = require('famous/core/Transform');
  var Modifier      = require('famous/core/Modifier');
  var Transitionable   = require('famous/transitions/Transitionable');
  var HeaderFooterLayout = require('famous.views/HeaderFooterLayout');
  var Lightbox      = require('famous.views/Lightbox');
  var Easing        = require('famous/transitions/Easing');
  var Utility       = require('famous/utilities/Utility');

  require('famous/inputs/FastClick');

  // ---------------------------------------------------------------------------
  function _SideMenu(options) {
    View.apply(this);

    options = setDefaults(options);

    // Create the mainTransforms for shifting the entire view over on menu open
    this.mainTransform = new Modifier({
      transform: Transform.identity
    });

    this.mainTransitionable = new Transitionable(0);
    this.mainTransform.transformFrom(function() {
      return Transform.translate(this.mainTransitionable.get(), 0, 0);
    }.bind(this));


    this.mainNode = new RenderNode();

    this.lightbox = new Lightbox({
      inOpacity: 1,
      outOpacity: 0,
      inTransform: Transform.translate(320,0, 0),
      outTransform: Transform.translate(-320, 0, 1),
      inTransition: { duration: 400, curve: Easing.outBack },
      outTransition: { duration: 400, curve: Easing.easeOut }
    });

    // Create the SideView with category buttons for filtering tasks
    this.sideView = new SideView(options.menu);

    this.sideView.on('select', this.selectItem.bind(this));

    // Tie the sideView and the taskList together

    this.mainNode.add(this.sideView);
    this.mainNode.add(this.lightbox);

    // Layout for specifically sized header and variable content
    this.layout = new HeaderFooterLayout({
      size: [undefined, undefined],
      headerSize: 50,
      footerSize: 1
    });

    // Create the HeaderView
    this.headerView = new HeaderView(options.header);
    this.headerView.pipe(this._eventInput);
    this._eventInput.on('menuToggle', this.toggle.bind(this));

    // Place the HeaderView and mainNode (containing the tasks and sidebar
    // inside of the header-footer-layout
    this.layout.header.add(this.headerView);
    this.layout.content.add(Utility.transformBehind).add(this.mainNode);

    this.comboNode = new RenderNode();
    this.comboNode.add(this.layout);

    // Attach the main transform and the comboNode to the renderTree
    this._add(this.mainTransform).add(this.comboNode);

  }
  // ---------------------------------------------------------------------------
  _SideMenu.prototype = Object.create(View.prototype);
  _SideMenu.prototype.constructor = _SideMenu;
  // ---------------------------------------------------------------------------
  _SideMenu.prototype.toggle = function() {
    if (!this.sideView.open) {
      this.open();
    }
    else {
      this.close();
    }
  };
  // ---------------------------------------------------------------------------
  _SideMenu.prototype.open = function() {
    this.mainTransitionable.set(
      options.menu.width,
      {
      duration: 500,
      curve: 'easeOut'
      }
    );
    this.sideView.flipOut();
    this.sideView.open = true;
  };
  // ---------------------------------------------------------------------------
  _SideMenu.prototype.close = function(cb) {
    this.mainTransitionable.set(0, { duration: 500, curve: 'easeOut' });
    this.sideView.flipIn(cb);
    this.sideView.open = false;
  };
  // ---------------------------------------------------------------------------
  _SideMenu.prototype.selectItem = function(action) {
    this.close(function(){
        this.lightbox.show(action);
        if (action.addItem) {
          this.headerView.showAddButton(action.addItem.bind(action));
        }
        else {
          this.headerView.hideAddButton();
        }

    }.bind(this));

    this._eventOutput.emit('select', action);
  };
  // ---------------------------------------------------------------------------
  var setDefaults = function(options) {

    if(!_.has(options, "header")) {
      options.header = {};
    }

    var header = options.header;
    if(!_.has(header, "title")) {
      header.title = "Please set the header title";
    }
    if(!_.has(header, "color")) {
      header.color = "#ffffff";
    }
    if(!_.has(header, "backgroundColor")) {
      header.backgroundColor = "#000";
    }

    if(!_.has(options, "menu")) {
      options.header = {};
    }

    var menu = options.menu;
    if(!_.has(menu, "buttons")) {
      menu.buttons = [];
    }
    if(!_.has(menu, "width")) {
      menu.width = 100;
    }
    return options;
  };

  return new _SideMenu(options);
};
