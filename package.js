Package.describe({
    summary: "Famo.us side menu for Meteor"
});

Package.on_use(function (api, where) {
    api.use(['famono'], 'client');
    api.use(['baseView'], 'client');

    api.add_files('src/sideView.css', 'client');
    api.add_files('src/headerView.js', 'client');
    api.add_files('src/menuButton.js', 'client');
    api.add_files('src/sideView.js', 'client');
    api.add_files('src/sideMenu.js', 'client');

    api.export('SideMenu', 'client');
});

Package.on_test(function (api) {
    // api.use('sideView', 'client');

    // api.add_files('sideView_tests.js', 'client');
});
