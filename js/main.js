jQuery(document).ready(function() {
    $('#content').animate({'opacity': 'show'});
    VK.init(function() { 
        if (getUrlParameter('hash').length > 1) {
            get_id(getUrlParameter('hash'));
        } else {
            main();
        };
    }, function() { 
        $('#content').html('error');
    }, '5.28');
});

function main() {
    VK.api('execute', { https: 1, code: 'var user=API.users.get({"fields":"screen_name,photo_50"});var wall=API.wall.get({filter:"owner",count:1});var group=API.groups.get({"extended":1,"filter":"moder","count":30,"fields":"members_count"});var a=0;var b=group.items.length;var error=false;var limit_list=[];while(a<b){if(group.items[a].members_count>=100){limit_list.push(group.items[a]);}a=a+1;};if(limit_list.length<group.count){error="limit_user";}if(limit_list.length==0){error="no_groups";}return{"user":{"id":user[0].id,"screen_name":user[0].screen_name,"name":user[0].first_name+" "+user[0].last_name,"photo":user[0].photo_50,"posts":wall.count},"groups":{"alert":error,"items":limit_list}};' }, function(data) { 
        window.user_id = data.response.user.id;
        var html = '<div id="im_rows0" class="im_rows">\
                        <div id="objects">\
                            <div class="dev_header">\
                                <div style="margin-top: 4px;"class="fl_r">\
                                    <button id="donate">Поддержать приложение</button>\
                                </div>\
                                <table>\
                                    <tbody>\
                                        <tr>\
                                            <td>\
                                                <table id="settings_addr_table"cellspacing="0"cellpadding="0">\
                                                    <tbody>\
                                                        <tr>\
                                                            <td class="settings_edit_addr_label noselect">\
                                                                http://vk.com/\
                                                            </td>\
                                                            <td class="settings_addr_field">\
                                                                <input id="settings_addr" maxlength="32" type="text" class="text settings_addr" placeholder="durov">\
                                                            </td>\
                                                        </tr>\
                                                    </tbody>\
                                                </table>\
                                            </td>\
                                            <td>\
                                                <button id="scan">Сканировать</button>\
                                            </td>\
                                        </tr>\
                                    </tbody>\
                                </table>\
                                <div class="send_don" style="display: none;">\
                                <input id="votes" type="text" onkeyup="this.value=parseInt(this.value) | 0" class="donate" placeholder="Сумма пожертвования в голосах">\
                                    <button id="donate_ok" class="ok">Отправить пожертвование</button>\
                                </div>\
                            </div>\
                            <div id="' + data.response.user.screen_name + '" class="object">\
                                <div class="im_photo">\
                                    <img src="' + data.response.user.photo + '" class="fl_l" width="43" height="43">\
                                </div>\
                                <div class="fl_l name">\
                                    <nobr>' + data.response.user.name + '</nobr>\
                                </div>\
                            </div>';  
                            if (data.response.groups.alert == 'limit_user') html += '<div id="settings_save_msg" class="msg">Отображаются лишь сообщества в которых есть <b>100</b> участников.</div>';
                            if (data.response.groups.alert == 'no_groups') html += '<div id="settings_save_msg" class="msg">У вас нет сообществ.</div>';

                            data.response.groups.items.map(function(group) {
                                html += '<div id="' + group.screen_name + '" class="object"><div class="im_photo"><img src="' + group.photo_50 + '" class="fl_l" width="43" height="43"></div><div class="fl_l name"><nobr>' + group.name + '</nobr></div><div class="online">' + number_format(group.members_count, 0, '.', ' ') + ' ' + declOfNum(group.members_count, ['участник', 'участника', 'участников']) + '</div></div>';  
                            });

            html +=     '</div>\
                    </div>';

        $('#content').animate({'opacity': 'hide'}, function() {
            $('#content').html(html);
            $('#content').animate({'opacity': 'show'});
            VK.callMethod('resizeWindow', 627, $('#content').height());

            $('#donate').click(function() {
                $('.dev_header').animate({
                    height: '70px'
                }, function() { 
                    $('#donate_ok').click(function() {
                        var params = {
                            type: 'votes',
                            votes: $('#votes').val()
                        };
                        VK.callMethod('showOrderBox', params);
                    });
                    $('.send_don').animate({'opacity': 'show'});
                    VK.callMethod('resizeWindow', 627, $('#content').height());
                });
            });

            $('#scan').click(function() {
                var screen_name = $('#settings_addr').val();
                if (screen_name.length > 1) {
                    get_id(screen_name);
                };
            });

            $('.object').click(function() {
                var screen_name = this.id;

                $('#content').animate({'opacity': 'hide'}, function() {
                    get_id(screen_name);
                });
            });
        });
    });
}

function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}  

function number_format(number, decimals, dec_point, thousands_sep) {
    var i, j, kw, kd, km;

    if (isNaN(decimals = Math.abs(decimals))) {
        decimals = 2;
    }
    if (dec_point == undefined) {
        dec_point = ',';
    }
    if (thousands_sep == undefined) {
        thousands_sep = '.';
    }

    i = parseInt(number = (+number || 0).toFixed(decimals)) + '';

    if ((j = i.length) > 3){
        j = j % 3;
    } else {
        j = 0;
    }

    km = (j ? i.substr(0, j) + thousands_sep : '');
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);

    kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : '');

    return km + kw + kd;
}

function array_count_values(array) {
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
}

function get_id(screen_name) {
    VK.api('execute', { https: 1, code: 'var screen_name="' + screen_name + '";var api=API.utils.resolveScreenName({screen_name:screen_name});var statistics = API.storage.get({"key": "statistics"});var comments = API.storage.get({"key": "comments"});if(api.length>0){if(api.type=="user"){var user=API.users.get({user_ids:api.object_id,fields:"photo_50"});var wall=API.wall.get({filter:"owner",owner_id:api.object_id});return{id:user[0].id,photo:user[0].photo_50,posts:wall.count,statistics:statistics,comments:comments};}else if(api.type=="group"){var group=API.groups.getById({group_id:api.object_id,fields:"photo_50"});var wall=API.wall.get({filter:"owner",owner_id:"-"+api.object_id});return{id:"-"+group[0].id,photo:group[0].photo_50,posts:wall.count,statistics:statistics,comments:comments};}else return{error:"is not user or group"};}else return{error:"incorrect screen_name"};' }, function(info) { 
        if (info.response.posts > 10) {
            html = '<div class="wall_loader">\
                        <div class="user">\
                            <img src="' + info.response.photo + '" class="loader_user">\
                        </div>\
                        <div class="wall_upload_progress_panel">\
                            <div class="wall_upload_progress_back_percent progress_text"></div>\
                            <div class="wall_upload_progress_front progress_line">\
                                <div class="wall_upload_progress_front_indicator">\
                                    <span class="wall_upload_progress_front_percent progress_text"></span>\
                                </div>\
                            </div>\
                            <div class="wall_upload_progress progress_line"></div>\
                        </div>\
                    </div>';

            window.offset = 0;
            window.posts_count = info.response.posts;
            window.posts = [];
            window.get_statistics = info.response.statistics;
            window.get_comments = info.response.comments;

            $('#content').html(html);
            
            $('.progress_line').animate({'width': '0%'}, 'slow');

            window.oid = info.response.id;
            stat(info.response.id);
        } else {
            html = '<div class="wall_loader">\
                        <div class="user">Недостаточно записей. <a id="home">На главную »</a></div>\
                    </div>';
            $('#content').html(html);
            $('#home').click(function() {
                main();
            });
        };

        $('#content').animate({'opacity': 'show'}, function() {
            VK.callMethod('resizeWindow', 627, 300);
        });
    });
}

function stat(id) {
    if (window.offset < window.posts_count) {
        VK.api('execute', { v: 5.29, code: 'var id=' + id + ';var offset=' + window.offset + ';var posts=API.wall.get({count:100,filter:"owner",owner_id:id,offset:offset});var a=0;var b=posts.items.length;var res=[];var post;while(a<b){post=posts.items[a];res.push({id:post.id,date:post.date,likes:post.likes.count,comments:post.comments.count,reposts:post.reposts.count,attachments:post.attachments@.type});a=a+1;}return res;' }, function(posts) { 
            if (posts.error) {
                console.log(posts.error.error_msg);
                setTimeout(function() { 
                    stat(id);
                }, 1000);
            } else {
                var c = Math.round(window.offset/window.posts_count*100) + '%';
                $('.progress_text').html(window.offset + '/' + window.posts_count);
                $('.progress_line').animate({'width': c}, 'fast');

                window.posts = window.posts.concat(posts.response);
                window.offset += 100;

                setTimeout(function() { 
                    stat(id);
                }, 333);
            };
        });
    } else {
        var colors = [{ color: '#597BA8', light: '#AABBD2' },
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
                      { color: '#D75C56', light: '#E3928E' }];

        $('#content').animate({'opacity': 'hide'}, function() {
            html = '<div class="dev_header">\
                        <div id="dev_header_name" class="dev_header_name">\
                            <a>Главная</a>\
                            <span class="dev_raquo_parents"> » </span>Статистика\
                        </div>\
                    </div>';
            posts = window.posts;

            var i = 0, arr = [], dates = [], likes = 0, comments = 0, reposts = 0, attachments = 0, attachments_array = [], attachments_chart = [];
            var days = {
                0: { count: 0, name: 'вс' },
                1: { count: 0, name: 'пн' },
                2: { count: 0, name: 'вт' },
                3: { count: 0, name: 'ср' },
                4: { count: 0, name: 'чт' },
                5: { count: 0, name: 'пт' },
                6: { count: 0, name: 'сб' }
            };

            posts.map(function(post) {
                likes += post.likes;
                comments += post.comments;
                reposts += post.reposts;
                attachments += post.attachments.length;

                post.attachments.map(function(attach) {
                    attachments_array.push(attach);
                });

                dates.push(new Date(post.date*1000).getFullYear());
                days[(new Date(post.date*1000).getDay())].count++;
            });

            days[7] = days[0];
            delete days[0];

            attachments_array = array_count_values(attachments_array);

            for (var key in attachments_array) {
                attachments_chart.push({ type: key, count: attachments_array[key] });
            }
            attachments_chart.sort(function(a, b) {
                if (a.count < b.count) return 1;
                if (a.count > b.count) return -1;
                return 0;
            });

            html += '<div style="padding: 10px;">\
                        <div class="c c_l">«Мне нравится» — ' + number_format(likes, 0, '.', ' ') + '</div>\
                        <div class="c c_c">Комментариев — ' + number_format(comments, 0, '.', ' ') + '</div>\
                        <div class="c c_r">Рассказать друзьям — ' + number_format(reposts, 0, '.', ' ') + '</div>\
                        <div class="c c_a">Вложений в записях — ' + number_format(attachments, 0, '.', ' ') + '</div>\
                    </div>\
                    <div class="clear_fix">\
                        <div class="stats_head">Вложения в записях</div>\
                    </div>\
                    <table>\
                        <tbody>\
                            <tr>\
                                <td valign="top">\
                                    <table class="piechart_table" cellspacing="0" cellpadding="0">\
                                        <tbody>\
                                            <tr class="piechart_col_header">\
                                                <th class="piechart_col_header_first">тип вложения</th>\
                                                <th class="piechart_col_header_second">количество</th>\
                                            </tr>';

                                            i = 0;
                                            arr = []
                                            attachments_chart.map(function(att) {
                                                html += '<tr id="piechart_row_countries_chart_0" style="opacity: 1;">\
                                                            <td class="piechart_stat_name"><div class="piechart_stat_color" style="background-color: ' + colors[i].color + '"></div>' + att.type + '</td>\
                                                            <td class="piechart_stat_info">' + att.count + '</td>\
                                                        </tr>';
                                                arr.push('{value: ' + att.count + ', color: "' + colors[i].color + '", highlight: "' + colors[i].light + '", label: "' + att.type + '"}');
                                                i++;
                                            });

            html +=                     '</tbody>\
                                    </table>\
                                </td>\
                                <td><canvas id="chart-wall" width="270" height="200" style="width: 270px; height: 200px;"></canvas></td>\
                            </tr>\
                        </tbody>\
                    </table>\
                    <script type="text/javascript">window.myPie = new Chart(document.getElementById("chart-wall").getContext("2d")).Pie([' + arr.join(',') + ']);</script>';

            dates = array_count_values(dates);

            var dates_count = 0;
            for (key in dates) dates_count++;

            if (dates_count > 1) {
                html += '<div class="clear_fix"><div class="stats_head">Записи по годам</div></div>';
                html += '<center><div style="width: 500px; height: 270px;"><canvas id="canvas-year" style="width: 500px; height: 316px;"></canvas></div></center>';

                var dates_chart_year = [];
                var dates_chart_count = [];

                for (var key in dates) {
                    dates_chart_year.push(key);
                    dates_chart_count.push(dates[key]);
                }
                html += '<script type="text/javascript">var lineChartData = {labels : [' + dates_chart_year.join(',') + '],datasets : [{fillColor : "#DAE2E9",strokeColor : "#597DA3",pointColor : "rgba(151,187,205,1)",pointStrokeColor : "#fff",pointHighlightFill : "#fff",pointHighlightStroke : "rgba(151,187,205,1)",data : [' + dates_chart_count.join(',') + ']}]}; window.myLine = new Chart(document.getElementById("canvas-year").getContext("2d")).Line(lineChartData, { responsive: true });</script>';
            };

            html += '<div class="clear_fix"><div class="stats_head">Записи по дням</div></div>';

            var label = [], data = [];
            for (key in days) {
                label.push('\'' + days[key].name + '\'');
                data.push(days[key].count);
            }

            function block_likes(posts, end) {
                posts.sort(function(a, b) {
                    if (a.likes < b.likes) return 1;
                    if (a.likes > b.likes) return -1;
                    return 0;
                });
                var html = '';
                var j = 1;
                for (var i = 0; i < posts.length; i++) {
                    html += '<a class="nav" href="//vk.com/wall' + id + '_' + posts[i].id + '" target="_blank">' + j++ + '. vk.com/wall' + id + '_' + posts[i].id + '<div class="fl_r">' + number_format(posts[i].likes, 0, '.', ' ') + '</div></a>';
                    if (i == end) break;
                };
                return html;
            };

            function block_comments(posts, end) {
                posts.sort(function(a, b) {
                    if (a.comments < b.comments) return 1;
                    if (a.comments > b.comments) return -1;
                    return 0;
                });
                var html = '';
                var j = 1;
                for (var i = 0; i < posts.length; i++) {
                    html += '<a class="nav" href="//vk.com/wall' + id + '_' + posts[i].id + '" target="_blank">' + j++ + '. vk.com/wall' + id + '_' + posts[i].id + '<div class="fl_r">' + number_format(posts[i].comments, 0, '.', ' ') + '</div></a>';
                    if (i == end) break;
                };
                return html;
            };

            html += '<center><div style="width: 500px; height: 380px;"><canvas id="graph-days" width="500px" height="370px"></canvas></div></center>\
                    <script type="text/javascript">window.myBar = new Chart(document.getElementById("graph-days").getContext("2d")).Bar({ labels : [' + label.join(',') + '], datasets : [{ fillColor : "#597BA8", highlightFill: "#82A2CD", data : [' + data.join(',') + '] }]});</script>\
                    <div class="clear_fix"><div id="top_10" class="stats_head">ТОП-10 записей</div></div>\
                    <table class="piechart_table" cellspacing="0" cellpadding="0" style="margin: 10px; width: 605px;">\
                        <tbody>\
                            <tr class="piechart_col_header">\
                                <th class="piechart_col_header_first">Количество «Мне нравится»</th>\
                                <th class="piechart_col_header_second">Количество комментариев</th>\
                            </tr>\
                            <tr id="piechart_row_countries_chart_0" style="opacity: 1;">\
                                <td id="top_likes" class="piechart_stat_name">';
            html +=                 block_likes(posts, 9);
            html +=             '</td>\
                                <td id="top_comments" class="piechart_stat_info">';
            html +=                 block_comments(posts, 9);
            html +=             '</td>\
                            </tr>\
                        </tbody>\
                    </table>\
                    <div id="block_top">\
                        <a class="apps_edit_add_panel">\
                            <span class="apps_edit_add_icon">Показать ТОП-200 записей</span>\
                        </a>\
                    </div>\
                    <div id="top_pay">\
                        <img src="/VK-scan/img/pay.png" class="pay_icon">\
                        Для того, чтобы у вас появилась возможность смотреть ТОП-200, нужно сделать единоразовый взнос в размере 3 голоса. После чего, вы сможете без ограничений пользоваться данной функцией. \
                        <br><button id="top_pay_button" class="ok">Купить</button>\
                    </div>';

                    if (comments > 0) {
                        window.comments_end = comments;
                        html += '<div id="block_commentator">\
                                    <a class="apps_edit_add_panel">\
                                        <span class="apps_edit_add_icon">Определить лучшего комментатора</span>\
                                    </a>\
                                </div>\
                                <div id="comments_pay">\
                                    <img src="/VK-scan/img/pay.png" class="pay_icon">\
                                    Для того, чтобы у вас появилась возможность анализировать комментарии страницы, нужно сделать единоразовый взнос в размере <b>3 голоса</b>. После чего, вы сможете без ограничений пользоваться данной функцией. \
                                    <br><button id="comments_pay_button" class="ok">Купить</button>\
                                </div>';
                    };

            html += '<div id="block_donate">\
                        <a class="apps_edit_add_panel block_donate">\
                            <span class="apps_edit_add_icon">Поддержать приложение</span>\
                        </a>\
                    </div>';
            
            $('#content').html(html);

            $('#dev_header_name').click(function() {
                $('#content').animate({'opacity': 'hide'}, function() {
                    main();
                });
            });

            $('#block_top').click(function() {
                if (window.get_statistics) {
                    $('#top_likes').html(block_likes(posts, 200));
                    $('#top_comments').html(block_comments(posts, 200));
                    $('#top_10').html('ТОП-200 записей');
                    $('#block_top').hide();
                    VK.callMethod('resizeWindow', 627, $('#content').height());
                } else {
                    $('#block_top').animate({'opacity': 'hide'}, function() {
                        $('#top_pay').animate({'opacity': 'show'}, function() {
                            VK.callMethod('resizeWindow', 627, $('#content').height());

                            $('#top_pay_button').click(function() {
                                var params = { 
                                    type: 'item', 
                                    item: 'statistics' 
                                }; 
                                VK.callMethod('showOrderBox', params);
                                window.order = 'statistics';
                            });
                        });
                    });
                };
            });
            
            $('#block_commentator').click(function() {
                if (window.get_comments) {
                    comments_func();
                } else {
                    $('#block_commentator').animate({'opacity': 'hide'}, function() {
                        $('#comments_pay').animate({'opacity': 'show'}, function() {
                            VK.callMethod('resizeWindow', 627, $('#content').height());

                            $('#comments_pay_button').click(function() {
                                var params = { 
                                    type: 'item', 
                                    item: 'comments' 
                                }; 
                                VK.callMethod('showOrderBox', params);
                                window.order = 'comments';
                            });
                        });
                    });
                };
            });

            $('.block_donate').click(function() {
                $('#block_donate').animate({'opacity': 'hide'}, function() {
                    $('#block_donate').html('<div class="clear_fix">\
                                                <div class="stats_head">Поддержать приложение</div>\
                                            </div>\
                                            <div class="send_don" style="padding-left: 5px;">\
                                                <input id="votes" type="text" onkeyup="this.value=parseInt(this.value) | 0" class="donate" placeholder="Сумма пожертвования">\
                                                <button id="donate_ok" class="ok">Отправить пожертвование</button>\
                                            </div>');
                    $('#block_donate').animate({'opacity': 'show'}, function() {
                        VK.callMethod('resizeWindow', 627, $('#content').height());

                        $('#donate_ok').click(function() {
                            var params = {
                                type: 'votes',
                                votes: $('#votes').val()
                            };
                            VK.callMethod('showOrderBox', params);
                            window.order = 'donate';
                        });
                    });
                });
            });
            VK.callMethod('resizeWindow', 627, $('#content').height());
            VK.addCallback('onOrderSuccess', function(order_id) {
                if (window.order == 'comments') comments_func();
                if (window.order == 'statistics') {
                    $('#top_likes').html(block_likes(posts, 200));
                    $('#top_comments').html(block_comments(posts, 200));
                    $('#top_10').html('ТОП-200 записей');
                    $('#top_pay').hide();
                    VK.callMethod('resizeWindow', 627, $('#content').height());
                };
            });
            $('#content').animate({'opacity': 'show'});
        });
    };
}

function comments_func() {
    window.i = 0;
    window.i_end = window.posts.length;
    window.offset = 0;

    window.comments = [];

    window.comments_i = 0;

    $('#content').animate({'opacity': 'hide'}, function() {
        html = '<div class="wall_loader">\
                    <div class="wall_upload_progress_panel">\
                        <div class="wall_upload_progress_back_percent progress_text"></div>\
                        <div class="wall_upload_progress_front progress_line">\
                            <div class="wall_upload_progress_front_indicator">\
                                <span class="wall_upload_progress_front_percent progress_text"></span>\
                            </div>\
                        </div>\
                        <div class="wall_upload_progress progress_line"></div>\
                    </div>\
                </div>';

        $('#content').html(html);
                
        $('#content').animate({'opacity': 'show'}, function() {
            VK.callMethod('resizeWindow', 627, 300);
        });

        $('.progress_line').animate({'width': '0%'}, 'slow');

        comments_get();
    });
}

function comments_get() {
    if (window.i < window.i_end) {
        if(window.posts[window.i].comments > 0) {
            if (window.offset < window.posts[window.i].comments) {
                VK.api('execute', { v: 5.29, code: 'var id="' + window.oid + '";var post_id=' + window.posts[window.i].id + ';var offset=' + window.offset + ';var comments=API.wall.getComments({owner_id:id,count:100,post_id:post_id,need_likes:1,offset:offset});var a=0;var b=comments.items.length;var res=[];var comment;while(a<b){comment=comments.items[a];res.push({id:comment.id,post_id:post_id,from_id:comment.from_id,likes:comment.likes.count,date:comment.date});a=a+1;} return res;' }, function(comments) { 
                    if (comments.error) {
                        console.log(comments.error.error_msg);

                        setTimeout(function() { 
                            comments_get();
                        }, 1000);
                    } else {
                        window.comments = window.comments.concat(comments.response);
                        window.comments_i += comments.response.length;
                        window.offset += 100;

                        var c = Math.round(window.comments_i/window.comments_end*100) + '%';
                        $('.progress_text').html(window.comments_i + '/' + window.comments_end);
                        $('.progress_line').animate({'width': c}, 'fast');

                        setTimeout(function() { 
                            comments_get();
                        }, 333);
                    };
                });
            } else {
                window.offset = 0;
                window.i++;
                comments_get();
            };
        } else {
            window.i++;
            comments_get();
        };
    } else {
        var comments = window.comments, dates = [], users = [], users_obj = {}, users_ids = [];
        
        html = '<div class="dev_header">\
                    <div id="dev_header_name" class="dev_header_name">\
                        <a>Главная</a><span class="dev_raquo_parents"> » </span>Статистика\
                    </div>\
                </div>';

        comments.map(function(comment) {
            dates.push(new Date(comment.date*1000).getFullYear());
            users_ids.push(comment.from_id);
        });

        dates = array_count_values(dates);

        var year_count = 0;
        for (key in dates) year_count++;

        if (year_count > 1) {
            html += '<div class="clear_fix">\
                        <div class="stats_head">Комментарии по годам</div>\
                    </div>\
                    <center>\
                        <div style="width: 500px; height: 270px;">\
                            <canvas id="canvas-year" style="width: 500px; height: 316px;"></canvas>\
                        </div>\
                    </center>';

            var dates_chart_year = [];
            var dates_chart_count = [];

            for (var key in dates) {
                dates_chart_year.push(key);
                dates_chart_count.push(dates[key]);
            }
            html += '<script type="text/javascript">var lineChartData = {labels : [' + dates_chart_year.join(',') + '],datasets : [{fillColor : "#DAE2E9",strokeColor : "#597DA3",pointColor : "rgba(151,187,205,1)",pointStrokeColor : "#fff",pointHighlightFill : "#fff",pointHighlightStroke : "rgba(151,187,205,1)",data : [' + dates_chart_count.join(',') + ']}]}; window.myLine = new Chart(document.getElementById("canvas-year").getContext("2d")).Line(lineChartData, { responsive: true });</script>';
        };

        users_ids = array_count_values(users_ids);
        for (var id in users_ids) {
            u_id = (id < 0) ? 101 : parseInt(id, 10);
            users_obj[u_id] = { id: u_id, count: users_ids[id], likes: 0 };
        }

        comments.map(function(comment) {
            u_id = (comment.from_id < 0) ? 101 : parseInt(comment.from_id, 10);
            users_obj[u_id].likes += comment.likes;
        });

        for (var id in users_obj) {
            users.push({ id: users_obj[id].id, count: users_obj[id].count, likes: users_obj[id].likes });
        }
        users.sort(function(a, b) {
            if (a.count < b.count) return 1;
            if (a.count > b.count) return -1;
            return 0;
        });

        users_ids = [];

        var top_comments = [];
        for (var i = 0; i < users.length; i++) {
            top_comments.push(users[i]);
            users_ids.push(users[i].id);
            if (i == 9) break;
        };

        users.sort(function(a, b) {
            if (a.likes < b.likes) return 1;
            if (a.likes > b.likes) return -1;
            return 0;
        });

        var top_likes = [];
        for (var i = 0; i < users.length; i++) {
            top_likes.push(users[i]);
            u_id = (users[i].id < 0) ? 101 : parseInt(users[i].id, 10);
            users_ids.push(u_id);
            if (i == 9) break;
        };

        comments.sort(function(a, b) {
            if (a.likes < b.likes) return 1;
            if (a.likes > b.likes) return -1;
            return 0;
        });

        for (var i = 0; i < comments.length; i++) {
            u_id = (comments[i].from_id < 0) ? 101 : parseInt(comments[i].from_id, 10);
            users_ids.push(u_id);
            if (i == 9) break;
        };

        VK.api('users.get', { v: 5.29, user_ids: users_ids.join(','), fields: 'screen_name,sex' }, function(api) { 
            var screen_name, info = {};
            var wall_top_comments = null, wall_top_likes = null;

            for (var key in api.response) {
                screen_name = (api.response[key].screen_name) ? api.response[key].screen_name : 'id' + api.response[key].id;
                info[api.response[key].id] = { screen_name: screen_name, sex: api.response[key].sex, name: api.response[key].first_name + ' ' + api.response[key].last_name };
            }

            html += '<div class="clear_fix">\
                        <div class="stats_head">ТОП-10 комментаторов</div>\
                    </div>\
                    <table class="piechart_table" cellspacing="0" cellpadding="0" style="margin: 10px; width: 605px;">\
                        <tbody>\
                            <tr class="piechart_col_header">\
                                <th class="piechart_col_header_first">Количество комментариев</th>\
                                <th class="piechart_col_header_second">Количество «Мне нравится»</th>\
                            </tr>\
                            <tr id="piechart_row_countries_chart_0" style="opacity: 1;">\
                                <td class="piechart_stat_name">';
                                top_comments.map(function(user) {
                                    if (wall_top_comments == null) {
                                        if (window.oid != user.id) wall_top_comments = user;
                                    } 
                                    html += '<a class="nav" href="//vk.com/' + info[user.id].screen_name + '" target="_blank">' + info[user.id].name + '<div class="fl_r">' + number_format(user.count, 0, '.', ' ') + '</div>';
                                });
            html +=             '</td>\
                                <td class="piechart_stat_info">';
                                top_likes.map(function(user) {
                                    if (wall_top_likes == null) {
                                        if (window.oid != user.id) wall_top_likes = user;
                                    } 
                                    html += '<a class="nav" href="//vk.com/' + info[user.id].screen_name + '" target="_blank">' + info[user.id].name + '<div class="fl_r">' + number_format(user.likes, 0, '.', ' ') + '</div>';
                                });
            html +=             '</td>\
                            </tr>\
                        </tbody>\
                    </table>\
                    <div class="clear_fix">\
                        <div class="stats_head">ТОП-10 комментариев по количеству «Мне нравится»</div>\
                    </div>\
                    <div style="padding: 10px;">';

                    var count = (comments.length > 10) ? 10 : comments.length ;
                    for (var i = 0; i < count; i++) {
                        u_id = (comments[i].from_id < 0) ? 101 : parseInt(comments[i].from_id, 10);
                        html += '<a class="nav" href="//vk.com/wall' + window.oid  + '_' + comments[i].post_id + '?reply=' + comments[i].id + '" target="_blank">' + info[u_id].name + ' — vk.com/wall' + window.oid  + '_' + comments[i].post_id + '?reply=' + comments[i].id + '<div class="fl_r">' + number_format(comments[i].likes, 0, '.', ' ') + '</div></a>';
                    };

            html += '</div>\
                    <div id="block_donate">\
                        <a class="apps_edit_add_panel block_donate">\
                            <span class="apps_edit_add_icon">Поддержать приложение</span>\
                        </a>\
                    </div>';

            $('#content').animate({'opacity': 'hide'}, function() {
                $('#content').html(html);

                $('#dev_header_name').click(function() {
                    $('#content').animate({'opacity': 'hide'}, function() {
                        main();
                    });
                });

                $('.block_donate').click(function() {
                    $('#block_donate').animate({'opacity': 'hide'}, function() {
                        $('#block_donate').html('<div class="clear_fix">\
                                                    <div class="stats_head">Поддержать приложение</div>\
                                                </div>\
                                                <div class="send_don" style="padding-left: 5px;">\
                                                    <input id="votes" type="text" onkeyup="this.value=parseInt(this.value) | 0" class="donate" placeholder="Сумма пожертвования">\
                                                    <button id="donate_ok" class="ok">Отправить пожертвование</button>\
                                                </div>');
                        $('#block_donate').animate({'opacity': 'show'}, function() {
                            VK.callMethod('resizeWindow', 627, $('#content').height());

                            $('#donate_ok').click(function() {
                                var params = {
                                    type: 'votes',
                                    votes: $('#votes').val()
                                };
                                VK.callMethod('showOrderBox', params);
                                window.order = 'donate';
                            });
                        });
                    });
                });
                
                $('#content').animate({'opacity': 'show'}, function() {
                    if (window.oid > 0) {
                        var wall_top_comments_user = (wall_top_comments == null) ? top_comments[0] : wall_top_comments ;
                        var wall_top_likes_user = (wall_top_likes == null) ? top_likes[0] : wall_top_likes ;

                        var wall = (window.user_id == window.oid) ? 'моей' : 'твоей';
                        VK.api('wall.post', { owner_id: window.oid, attachments: 'photo877281_360313025', message: 'Статистика комментариев на ' + wall + ' странице.\n\nНаибольшее количество комментариев оставил' + ((info[wall_top_comments_user.id].sex == 1) ? 'a' : '') + ' @id' +wall_top_comments_user.id + ' (' + info[wall_top_comments_user.id].name + ') — ' + number_format(wall_top_comments_user.count, 0, '.', ' ') + '.\nНаибольшее количество лайков в комментариях собрал' + ((info[wall_top_likes_user.id].sex == 1) ? 'a' : '') + ' @id' + wall_top_likes_user.id + ' (' + info[wall_top_likes_user.id].name + ') — ' + number_format(wall_top_likes_user.likes, 0, '.', ' ') + '.\nСамый популярный комментарий оставил' + ((info[comments[0].from_id].sex == 1) ? 'a' : '') + ' @id' + comments[0].from_id + ' (' + info[comments[0].from_id].name + ') (vk.com/wall' + window.oid + '_' + comments[0].post_id + '?reply=' + comments[0].id + ') — ' + number_format(comments[0].likes, 0, '.', ' ') + '.' });
                    };

                    VK.callMethod('resizeWindow', 627, $('#content').height());
                });
            });
        });
    };
}