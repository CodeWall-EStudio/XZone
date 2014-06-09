;
(function() {

    requirejs.config({
        baseUrl: 'js',
        paths: {
            jquery: '../lib/jquery'
        }
    });

    require(['school/config'], function(config) {

        var cgi = config.cgi;

        $(function() {

            function doLogin(){

                var name = $.trim($("#userName").val());
                var pwd = $.trim($('#passWord').val());

                if (name !== '' && pwd !== '') {
                    var param = {
                        name: name,
                        pwd: pwd,
                        json: true
                    };

                    $.post(cgi.login, param, function(d) {
                        console.log(typeof d.err);
                        if (d.err === 0) {
                            window.location = 'index.html';
                        } else {
                            alert('出错拉!err:' + d.err + '\nmsg:' + d.msg);
                        }
                    });
                } else {
                    alert('请输入用户名和密码');
                }

            }

            $('#loginBtn').bind('click', doLogin);
            $('#passWord').bind('keydown', function(e){
                if(e.keyCode === 13){
                    doLogin();
                }
            });
        });
    });
})();