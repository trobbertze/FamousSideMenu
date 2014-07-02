SideMenu = function(kwargs){
    // Famous Modules
    require("famous/core/famous");
    var View               = require('famous/core/View');
    var RenderNode         = require('famous/core/RenderNode')
    var Transform          = require('famous/core/Transform');
    var Modifier           = require('famous/core/Modifier');
    var EventHandler       = require('famous/core/EventHandler');
    var ViewSequence       = require('famous/core/ViewSequence');
    var Transitionable     = require('famous/transitions/Transitionable');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var Utility            = require('famous/utilities/Utility');

    require('famous/inputs/FastClick');

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

        // Create the SideView with category buttons for filtering tasks
        this.sideView = new SideView();

        // Tie the sideView and the taskList together
        this.mainNode = new RenderNode();
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
        this._eventInput.on('menuToggle', this.menuToggle.bind(this))

        // Place the HeaderView and mainNode (containing the tasks and sidebar
        // inside of the header-footer-layout
        this.layout.header.add(this.headerView);
        this.layout.content.add(Utility.transformBehind).add(this.mainNode);

        // // Attach the EditTaskView and the HeaderFooterLayout to the same RenderNode
         this.comboNode = new RenderNode();
        // this.comboNode.add(new Modifier({transform: Transform.translate(0,0,5)})).add(this.editTaskView);
            this.comboNode.add(this.layout);
        
        // Attach the main transform and the comboNode to the renderTree
        this._add(this.mainTransform).add(this.comboNode);

    };

    _SideMenu.prototype = Object.create(View.prototype);
    _SideMenu.prototype.constructor = _SideMenu;

    _SideMenu.prototype.menuToggle = function() {
        if (!this.sideView.open) {
            this.mainTransitionable.set(100, { duration: 500, curve: 'easeOut' });
            this.sideView.flipOut();
        }
        else {
            this.mainTransitionable.set(0, { duration: 500, curve: 'easeOut' });
            this.sideView.flipIn();
        }
        this.sideView.open = !this.sideView.open;
    };

    var setDefaults = function(kwargs) {

        if(!_.has(kwargs, "header")) {
            kwargs.header = {};
        }

        var header = kwargs.header;
        if(!_.has(header, "title")) {
            header.title = "Please set the header title";
        }

        return kwargs;
    }

    return new _SideMenu(kwargs);

};