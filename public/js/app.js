
// ----- flexMOTE setup --------------------------------------------------------
/**
 * @public socket.io connection
 */
flexMOTE.connection = io('http://localhost:3000');

/**
 * onConnect event handler
 */
flexMOTE.connection.on('connect', function() {

    // register a channel, using a reserved room id
    flexMOTE.register({
        app: 'admin',
        room: '00000',
        secret: 'myadminsecret',
        version: '0.1.0',
        maxUsers: -1,
        timeout: -1,
        stickySessions: false
    }, function(status, room) {
        clearInterval(app.updateInterval);
        app.updateInterval = setInterval(app.updateStatistics, 5000);
        app.updateStatistics();
    });
});

/**
 * onDisconnect event handler
 */
flexMOTE.connection.on('disconnect', function() {
    clearInterval(app.updateInterval);
});

/**
 * @singleton
 */
var app = {};

/**
 * interval id to stop running updateStatistics interval
 */
app.updateInterval = -1;

/**
 * this field is updated periodically
 */
app.statistics = {
    memmory: {},
    latency: 0,
    appCount: 0,
    userCount: 0,
    rooms: []
};

/**
 * load data from server
 */
app.updateStatistics = function() {
    console.log('updateStatistics');
    var start = (new Date()).getTime();
    flexMOTE.connection.emit('statistics', function(status, data) {
        console.log(' >', status, data);
        app.statistics = data;
        app.statistics.latency = (new Date()).getTime() - start;
        app.updateGui();
    });
};

/**
 * update gui w/ latest statistics
 */
app.updateGui = function() {

    // top navi
    $('#server-name').text(flexMOTE.connection.io.uri);
    $('#total-apps').text(app.statistics.appCount || 0);
    $('#total-users').text(app.statistics.userCount || 0);
    $('#latency').text((app.statistics.latency || 0) + " ms");

    // left sidebar (applications)
    $('.ui.sidebar.menu .item').off('click', app.onApplicationClick);
    $('#rooms').empty();
    for (var i = 0; i < app.statistics.rooms.length; i++) {
        var room = app.statistics.rooms[i];
        var html = '<div class="item"><span>#' + room.id + ' | ' + room.app + '</span>';
        html += '<br /><em>' + room.host + '</em></div>';
        $('#rooms').append(html);
    }
    $('.ui.sidebar.menu .item').on('click', app.onApplicationClick);
};

/**
 * @param {Object} event
 */
app.onApplicationClick = function(event) {
    if ($(this).hasClass('dividing')) {
        return false;
    }
    $('.ui.button.applications span').html($(this).find('span').html());
    $('.item.server span').html($(this).find('em').html());
};


// ----- setup semantic ui behaviour -------------------------------------------
// tooltips for top nav
$('.top.menu i.icon').parent().popup();

/**
 * toggle application sidebar on the left
 * @param {Object} event
 */
$('.ui.button.applications').on('click', function(event) {
    $('.ui.sidebar.left').sidebar({
        dimPage: false
    }).sidebar('toggle');
});

/**
 * toggle application settings on the right
 * @param {Object} event
 */
$('.ui.button.settings').on('click', function(event) {
    $('.ui.sidebar.right').sidebar({
        dimPage: false
    }).sidebar('toggle');
});

// ----- charting --------------------------------------------------------------
/**
 * first chart
 */
var ctx = document.getElementById("chart-1").getContext("2d");
var data = {
    labels: ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
    datasets: [{
        label: "Concurrent Users",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 81, 56, 55, 40]
    }, {
        label: "Connections",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: [28, 48, 40, 19, 86, 27, 90]
    }]
};
var myLineChart = new Chart(ctx).Line(data, {
    responsive: true
});

// chart 2
ctx = document.getElementById("chart-2").getContext("2d");
data = {
    labels: ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
    datasets: [{
        label: "Load",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: [28, 48, 40, 58, 86, 78, 90]
    }]
};
myLineChart = new Chart(ctx).Line(data, {
    responsive: true
});

// chart 3
ctx = document.getElementById("chart-3").getContext("2d");
data = {
    labels: ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
    datasets: [{
        label: "Memory",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: [38, 48, 52, 58, 86, 90, 90]
    }]
};
myLineChart = new Chart(ctx).Line(data, {
    responsive: true
});

