var VKFriendsListsApp = angular.module('VKScanApp', []);

VKFriendsListsApp.controller('VKScanCtrl', function($scope, $document, $window, $timeout) {
    $scope.block = 'loader';

    $scope.declension = function(number, titles) {
        cases = [2, 0, 1, 1, 1, 2];
        return titles[(number%100>4 && number%100<20) ? 2 : cases[(number%10<5)?number%10:5]];
    };

    $scope.main = function() {
        VK.api('execute', { 
            https: 1,
            code: 'var user = API.users.get({ fields: "screen_name,photo_50" }), wall = API.wall.get({ filter: "owner", count: 1 }), group = API.groups.get({ extended: 1, filter: "moder", count: 30, fields: "members_count" }), a = 0, b = group.items.length, error = false, limit_list = []; while (a < b) { if (group.items[a].members_count >= 100) { limit_list.push(group.items[a]); } a = a + 1; }; if (limit_list.length < group.count) { error = "limit_user"; } if (limit_list.length == 0) { error = "no_groups"; } return { user: { id: user[0].id, screen_name: user[0].screen_name, name: user[0].first_name + " " + user[0].last_name, photo: user[0].photo_50, posts: wall.count }, groups: { alert: error, items: limit_list } };' 
        }, function(data) {
            $scope.user   = data.response.user;
            $scope.groups = data.response.groups;
            $scope.update('main');
        });
    };

    $scope.resize = function() {
        VK.callMethod('resizeWindow', 627, $document[0].body.clientHeight);
    };

    $scope.array_count_values = function(array) {
        var tmp_ar = new Object(), key;

        var countValue = function(value) {
            switch (typeof(value)) {
            case "number":
                if (Math.floor(value) != value) {
                    return;
                }
            case "string":
                if (value in this) {
                    ++this[value];
                } else {
                    this[value] = 1;
                }
            }
        }

        if (array instanceof Array) {
            array.forEach(countValue, tmp_ar);
        } else if (array instanceof Object) {
            for (var key in array) {
                countValue.call(tmp_ar, array[key]);
            }
        }

        return tmp_ar;
    };

    $scope.ge = function(id) {
        return document.getElementById(id);
    };

    $scope.object = function(screen_name) {
        VK.api('execute', {
            https: 1,
            code: 'var screen_name = "' + screen_name + '", api = API.utils.resolveScreenName({ screen_name: screen_name }), statistics = API.storage.get({ key: "statistics" }), comments = API.storage.get({ key: "comments" }); if (api.length > 0) { if (api.type == "user") { var user = API.users.get({ user_ids: api.object_id, fields: "photo_50" }), wall = API.wall.get({ filter: "owner", owner_id: api.object_id }); return { id: user[0].id, photo: user[0].photo_50, posts: wall.count, statistics: statistics, comments: comments }; } else if (api.type == "group") { var group = API.groups.getById({ group_id: api.object_id, fields: "photo_50" }), wall = API.wall.get({ filter: "owner", owner_id: "-" + api.object_id }); return { id: "-" + group[0].id, photo: group[0].photo_50, posts: wall.count, statistics: statistics, comments: comments }; } else return { error: "is not user or group" }; } else return { error: "incorrect screen_name" };' 
        }, function(info) {
            if (info.response.posts > 10) {
                $scope.info = info.response;
                $scope.load = {
                    offset:   0,
                    progress: 0,
                    count: info.response.posts
                };
                $scope.posts = [];
                $scope.extra = {
                    statistics: info.response.statistics,
                    comments: info.response.comments
                };
                $scope.update('progress');

                $scope.stat(info.response.id);
            } else {
                $scope.error = 'Недостаточно записей.';
                $scope.update('error');
            }
        });
    };

    $scope.custom_scan = function() {
        $scope.object($scope.custom_screen_name);
    };

    $scope.stat = function(id) {
        VK.api('execute', {
            code: 'var id=' + id + ';var offset=' + $scope.load.offset + ';var posts=API.wall.get({count:100,filter:"owner",owner_id:id,offset:offset});var a=0;var b=posts.items.length;var res=[];var post;while(a<b){post=posts.items[a];res.push({id:post.id,date:post.date,likes:post.likes.count,comments:post.comments.count,reposts:post.reposts.count,attachments:post.attachments@.type});a=a+1;}return res;'
        }, function(data) {
            $scope.posts = $scope.posts.concat(data.response);

            $scope.load.offset  += 100;
            $scope.load.progress = $scope.load.offset*100/$scope.load.count;

            if ($scope.load.offset > $scope.load.count) {
                $scope.post_result();
            } else {
                $timeout(function() {
                    $scope.stat(id);
                }, 333);
            };
        });
    };

    $scope.stat_back = function() {
        $scope.update('stat_result');
    };

    $scope.post_result = function() {
        $scope.limit_posts = 10;
        $scope.counts = {
            likes:       0,
            comments:    0,
            reposts:     0,
            attachments: 0
        };

        var i     = 0, 
            dates = [], 
            attachments_array = [], 
            attachments_chart = [],
            days = {
                0: { count: 0, name: 'вс' },
                1: { count: 0, name: 'пн' },
                2: { count: 0, name: 'вт' },
                3: { count: 0, name: 'ср' },
                4: { count: 0, name: 'чт' },
                5: { count: 0, name: 'пт' },
                6: { count: 0, name: 'сб' }
            },
            colors = [
                { color: '#597BA8', light: '#AABBD2' },
                { color: '#82A2CD', light: '#C0D0E5' },
                { color: '#BF68A6', light: '#DEB3D2' },
                { color: '#78B27C', light: '#BBD8BD' },
                { color: '#E7E271', light: '#F2F0B7' },
                { color: '#F3B200', light: '#F8D87F' },
                { color: '#D75C56', light: '#E3928E' },
                { color: '#B5D05E', light: '#D1E29C' },
                { color: '#78B27C', light: '#BBD8BD' },
                { color: '#E7E271', light: '#F2F0B7' },
                { color: '#F3B200', light: '#F8D87F' },
                { color: '#D75C56', light: '#E3928E' }
            ];

        $scope.posts.map(function(post) {
            $scope.counts.likes       += post.likes;
            $scope.counts.comments    += post.comments;
            $scope.counts.reposts     += post.reposts;
            $scope.counts.attachments += post.attachments.length;

            post.attachments.map(function(attach) {
                attachments_array.push(attach);
            });

            dates.push(new Date(post.date*1000).getFullYear());
            days[(new Date(post.date*1000).getDay())].count++;
        });

        days[7] = days[0];
        delete days[0];

        attachments_array = $scope.array_count_values(attachments_array);

        for (var key in attachments_array) {
            attachments_chart.push({ type: key, count: attachments_array[key] });
        }
        attachments_chart.sort(function(a, b) {
            if (a.count < b.count) return 1;
            if (a.count > b.count) return -1;
            return 0;
        });

        i = 0;
        $scope.attachments_chart = [];

        attachments_chart.map(function(att) {
            $scope.attachments_chart.push({
                value: att.count,
                color: colors[i].color,
                highlight: colors[i].light,
                label: att.type
            });
            i++;
        });

        $scope.ge('canvas_wall_div').innerHTML = '<canvas id="chart_wall" width="270" height="200"></canvas>';
        new Chart($scope.ge('chart_wall').getContext('2d')).Pie($scope.attachments_chart);

        dates = $scope.array_count_values(dates);
        $scope.dates_count = Object.keys(dates).length;

        if ($scope.dates_count > 1) {
            var dates_chart_year  = [],
                dates_chart_count = [];

            for (var key in dates) {
                dates_chart_year.push(key);
                dates_chart_count.push(dates[key]);
            }
            
            var lineChartData = {
                labels: dates_chart_year,
                datasets: [{
                    fillColor: '#DAE2E9',
                    strokeColor: '#597DA3',
                    pointColor: 'rgba(151,187,205,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151,187,205,1)',
                    data: dates_chart_count
                }]
            }; 

            $scope.ge('canvas_years_div').innerHTML = '<canvas id="canvas_years" width="500" height="250"></canvas>';
            new Chart($scope.ge('canvas_years').getContext("2d")).Line(lineChartData);
        };

        var label = [],
            data  = [];
        for (key in days) {
            label.push(days[key].name);
            data.push(days[key].count);
        }

        $scope.ge('canvas_days_div').innerHTML = '<canvas id="canvas_days" width="500" height="370"></canvas>';

        new Chart($scope.ge('canvas_days').getContext('2d')).Bar({ 
            labels: label,
            datasets: [{
                fillColor: '#597BA8',
                highlightFill: '#82A2CD',
                data: data
            }]
        });

        $scope.stat_step     = 1;
        $scope.comments_step = 1;

        $scope.get_top = function() {
            if ($scope.extra.statistics == 'true') {
                $scope.limit_posts = 200;
                $scope.stat_step   = 3;
            } else {
                $scope.stat_step = 2;
            };

            $scope.update('stat_result');
        };

        $scope.buy_stat = function() {
            VK.callMethod('showOrderBox', {
                type: 'item',
                item: 'statistics'
            });
            $scope.order = 'statistics';
        };

        $scope.get_commentators = function() {
            if ($scope.extra.comments == 'true') {
                $scope.load = {
                    offset:          0,
                    progress:        0,
                    comments_offset: 0,
                    posts_offset:    0,
                    posts_count:     $scope.posts.length,
                    count:           $scope.counts.comments
                };
                $scope.comments = [];
                var post;

                $scope.posts.sort(function(a, b) {
                    if (a.comments < b.comments) return 1;
                    if (a.comments > b.comments) return -1;
                    return 0;
                });

                $scope.update('progress');
                $scope.stat_comments();
                VK.callMethod('scrollWindow', 0, 500);
            } else {
                $scope.comments_step = 2;
                $scope.update('stat_result');
            };
        };

        $scope.buy_comments = function() {
            VK.callMethod('showOrderBox', {
                type: 'item',
                item: 'comments'
            });
            $scope.order = 'comments';
        };

        $scope.update('stat_result');
    };

    $scope.stat_comments = function() {
        if ($scope.load.posts_offset < $scope.load.posts_count) {
            if ($scope.posts[$scope.load.posts_offset].comments > 0) {
                if ($scope.load.comments_offset < $scope.posts[$scope.load.posts_offset].comments) {
                    VK.api('execute', {
                        code: 'var id=' + $scope.info.id + ';var post_id=' + $scope.posts[$scope.load.posts_offset].id + ';var offset=' + $scope.load.comments_offset + ';var comments=API.wall.getComments({owner_id:id,count:100,post_id:post_id,need_likes:1,offset:offset});var a=0;var b=comments.items.length;var res=[];var comment;while(a<b){comment=comments.items[a];res.push({id:comment.id,post_id:post_id,from_id:comment.from_id,likes:comment.likes.count,date:comment.date});a=a+1;} return res;'
                    }, function(comments) {
                        $scope.comments = $scope.comments.concat(comments.response);

                        $scope.load.comments_offset += 100;
                        $scope.load.offset          += comments.response.length;
                        $scope.load.progress         = $scope.load.offset*100/$scope.load.count;

                        $timeout(function() {
                            $scope.stat_comments();
                        }, 333);
                    });
                } else {
                    $scope.load.comments_offset = 0;
                    $scope.load.posts_offset++;
                    $scope.stat_comments();
                };
            } else {
                $scope.load.posts_offset++;
                $scope.stat_comments();
            };
        } else {
            $scope.comments_result();
        };
        
    };

    $scope.comments_result = function() {
        var dates     = [],
            users     = [],
            users_obj = {},
            users_ids = [];

        $scope.comments.map(function(comment) {
            dates.push(new Date(comment.date*1000).getFullYear());
            users_ids.push(comment.from_id);
        });

        dates = $scope.array_count_values(dates);



        $scope.year_count = 0;
        for (key in dates) $scope.year_count++;

        if ($scope.year_count > 1) {
            var dates_chart_year  = [],
                dates_chart_count = [];

            for (var key in dates) {
                dates_chart_year.push(key);
                dates_chart_count.push(dates[key]);
            }

            var lineChartData = {
                labels: dates_chart_year,
                datasets: [{
                    fillColor: '#DAE2E9',
                    strokeColor: '#597DA3',
                    pointColor: 'rgba(151,187,205,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151,187,205,1)',
                    data: dates_chart_count
                }]
            };

            $scope.ge('canvas_years_comments_div').innerHTML = '<canvas id="canvas_years_comments" width="500" height="250"></canvas>';
            new Chart($scope.ge('canvas_years_comments').getContext('2d')).Line(lineChartData);
        };

        users_ids = $scope.array_count_values(users_ids);
        for (var id in users_ids) {
            u_id = (id < 0) ? 101 : parseInt(id, 10);
            users_obj[u_id] = { id: u_id, count: users_ids[id], likes: 0 };
        }

        $scope.comments.map(function(comment) {
            u_id = (comment.from_id < 0) ? 101 : parseInt(comment.from_id, 10);
            users_obj[u_id].likes += comment.likes;
        });

        for (var id in users_obj) {
            users.push({
                id: users_obj[id].id,
                count: users_obj[id].count,
                likes: users_obj[id].likes
            });
        }
        users.sort(function(a, b) {
            if (a.count < b.count) return 1;
            if (a.count > b.count) return -1;
            return 0;
        });

        users_ids = [];

        $scope.top_comments = [];
        for (var i = 0; i < users.length; i++) {
            $scope.top_comments.push(users[i]);
            users_ids.push(users[i].id);
            if (i == 9) break;
        };

        users.sort(function(a, b) {
            if (a.likes < b.likes) return 1;
            if (a.likes > b.likes) return -1;
            return 0;
        });

        $scope.top_likes = [];
        for (var i = 0; i < users.length; i++) {
            $scope.top_likes.push(users[i]);
            u_id = (users[i].id < 0) ? 101 : parseInt(users[i].id, 10);
            users_ids.push(u_id);
            if (i == 9) break;
        };

        $scope.comments.sort(function(a, b) {
            if (a.likes < b.likes) return 1;
            if (a.likes > b.likes) return -1;
            return 0;
        });

        for (var i = 0; i < $scope.comments.length; i++) {
            u_id = ($scope.comments[i].from_id < 0) ? 101 : parseInt($scope.comments[i].from_id, 10);
            users_ids.push(u_id);
            if (i == 9) break;
        };

        VK.api('users.get', {
            user_ids: users_ids.join(','),
            fields: 'screen_name'
        }, function(api) {
            $scope.info_users = {};

            var screen_name,
                wall_top_comments = null,
                wall_top_likes    = null;

            for (var key in api.response) {
                screen_name = (api.response[key].screen_name) ? api.response[key].screen_name : 'id' + api.response[key].id;
                $scope.info_users[api.response[key].id] = {
                    screen_name: screen_name,
                    name: api.response[key].first_name + ' ' + api.response[key].last_name
                };
            }

            $scope.update('commentators');
        });
    };

    $scope.update = function(name) {
        $scope.block = name;
        $scope.$apply();
        $scope.resize();
    };

    $scope.write = function() {
        $window.open('//vk.com/write877281');
    };

    VK.addCallback('onOrderSuccess', function() {
        if ($scope.order == 'comments')  {
            $scope.extra.comments = 'true';
            $scope.get_commentators();
        }
        if ($scope.order == 'statistics') {
            $scope.extra.statistics = 'true';
            $scope.get_top();
        }
    });

    VK.init(function() { 
        $scope.main();
    }, function() { 
        $scope.error = 'error init';
        $scope.block = 'error';
    }, '5.28');
});