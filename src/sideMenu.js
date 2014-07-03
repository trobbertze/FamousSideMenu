SideMenu = function(kwargs){
  // Famous Modules
  require("famous/core/famous");
  var View       = require('famous/core/View');
  var RenderNode   = require('famous/core/RenderNode')
  var Transform    = require('famous/core/Transform');
  var Modifier     = require('famous/core/Modifier');
  var Transitionable   = require('famous/transitions/Transitionable');
  var HeaderFooterLayout = require('famous.views/HeaderFooterLayout');
  var Utility    = require('famous/utilities/Utility');

  require('famous/inputs/FastClick');

  // ---------------------------------------------------------------------------
  function _SideMenu(kwargs) {
    View.apply(this);

    kwargs = setDefaults(kwargs);

    // Create the mainTransforms for shifting the entire view over on menu open
    this.mainTransform = new Modifier({
      transform: Transform.identity
    });

    this.mainTransitionable = new Transitionable(0);
    this.mainTransform.transformFrom(function() {
      return Transform.translate(this.mainTransitionable.get(), 0, 0);
    }.bind(this));


    this.mainNode = new RenderNode();

    // Create the SideView with category buttons for filtering tasks
    this.sideView = new SideView(
      _.extend(
      {
        mainNode: this.mainNode
      },
      kwargs.menu
      )
    );

    this.sideView.on('select', this.selectItem.bind(this));

    // Tie the sideView and the taskList together

    this.mainNode.add(this.sideView);

    // Layout for specifically sized header and variable content
    this.layout = new HeaderFooterLayout({
      size: [undefined, undefined],
      headerSize: 50,
      footerSize: 1
    });

    // Create the HeaderView
    this.headerView = new HeaderView(kwargs.header);
    this.headerView.pipe(this._eventInput);
    this._eventInput.on('menuToggle', this.toggle.bind(this))

    // Place the HeaderView and mainNode (containing the tasks and sidebar
    // inside of the header-footer-layout
    this.layout.header.add(this.headerView);
    this.layout.content.add(Utility.transformBehind).add(this.mainNode);

    this.comboNode = new RenderNode();
    this.comboNode.add(this.layout);

    // Attach the main transform and the comboNode to the renderTree
    this._add(this.mainTransform).add(this.comboNode);

  };
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
      kwargs.menu.width,
      {
      duration: 500,
      curve: 'easeOut'
      }
    );
    this.sideView.flipOut();
    this.sideView.open = true;
  };
  // ---------------------------------------------------------------------------
  _SideMenu.prototype.close = function() {
    this.mainTransitionable.set(0, { duration: 500, curve: 'easeOut' });
    this.sideView.flipIn();
    this.sideView.open = false;
  };
  // ---------------------------------------------------------------------------
  _SideMenu.prototype.selectItem = function(action) {
    this.close();
    this._eventOutput.emit('select', action);
  };
  // ---------------------------------------------------------------------------
  var setDefaults = function(kwargs) {

  if(!_.has(kwargs, "header")) {
    kwargs.header = {};
  }

  var header = kwargs.header;
  if(!_.has(header, "title")) {
    header.title = "Please set the header title";
  }
  if(!_.has(header, "color")) {
    header.color = "#ffffff";
  }
  if(!_.has(header, "backgroundColor")) {
    header.backgroundColor = "#000";
  }

  if(!_.has(kwargs, "menu")) {
    kwargs.header = {};
  }

  var menu = kwargs.menu;
  if(!_.has(menu, "buttons")) {
    menu.buttons = [];
  }
  if(!_.has(menu, "width")) {
    menu.width = 100;
  }
  return kwargs;
  }

  return new _SideMenu(kwargs);
};
