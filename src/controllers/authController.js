var AuthController = function()
{

}

AuthController.login = function(username, password)
{

    Network.post({
        action : 'login',
        args : {username: username, password: password},
        onSuccess : function(result) {

            if (result.code == 1001)
            {
                //console.log('用户名不存在');
                prompt.fade('您输入的用户名不存在, 请重新输入');
                return;
            }
            if (result.code == 1002)
            {
                //console.log('密码错误');
                prompt.fade('您输入的密码错误, 请重新输入');
                return;
            }
            if (result.code == 1003)
            {
                //console.log('用户名密码不能为空');
                prompt.fade('用户名密码不能为空');
                return;
            }

            var uid = result.uid;
            var token = result.token;

            Storage.set(CommonConf.LOCAL_STORAGE.TOKEN, token);

            Network.enter(uid, token, function (data) {
                if (data.code !== RETURN_CODE.OK)
                {
                    //console.log('err.');
                    prompt.fade(data.message);
                    return;
                }

                //初始化全局变量gPlayer;
                gPlayer = data.player;
                console.log("gPlayer => ", gPlayer);

                //如果是断线重回游戏, 则不需要自动进入大厅;
                if (data.isBackGame) return;

                //进入Index
                UniversalController.enterIndex();

            });

        },

        onError : function() {
            //console.log("error");
        }
    });

}


AuthController.loginWithToken = function(token)
{

    Network.post({
        action : 'loginByToken',
        args : {token: token},
        onSuccess : function(result) {

            if (result.code == 1001)
            {
                //console.log('用户名不存在');
                prompt.fade('您输入的用户名不存在, 请重新输入');
                return;
            }
            if (result.code == 1002)
            {
                //console.log('密码错误');
                prompt.fade('您输入的密码错误, 请重新输入');
                return;
            }
            if (result.code == 1003)
            {
                //console.log('用户名密码不能为空');
                prompt.fade('用户名密码不能为空');
                return;
            }

            var uid = result.uid;
            var token = result.token;

            Storage.set(CommonConf.LOCAL_STORAGE.TOKEN, token);

            Network.enter(uid, token, function (data) {
                if (data.code !== RETURN_CODE.OK)
                {
                    //console.log('err.');
                    prompt.fade(data.message);
                    return;
                }

                //初始化全局变量gPlayer;
                gPlayer = data.player;
                console.log("gPlayer => ", gPlayer);

                //如果是断线重回游戏, 则不需要自动进入大厅;
                if (data.isBackGame) return;

                //进入Index
                UniversalController.enterIndex();

            });

        },

        onError : function() {
            //console.log("error");
        }
    });

}


AuthController.autoLogin = function()
{

    Network.post({
        action : 'autoLogin',
        args : {},
        onSuccess : function(result) {

            if (result.code == 1001)
            {
                //console.log('用户名不存在');
                prompt.fade('您输入的用户名不存在, 请重新输入');
                return;
            }
            if (result.code == 1002)
            {
                //console.log('密码错误');
                prompt.fade('您输入的密码错误, 请重新输入');
                return;
            }
            if (result.code == 1003)
            {
                //console.log('用户名密码不能为空');
                prompt.fade('用户名密码不能为空');
                return;
            }

            console.log('result -- ', result);

            var uid = result.uid;
            var token = result.token;

            Storage.set(CommonConf.LOCAL_STORAGE.TOKEN, token);

            Network.enter(uid, token, function (data) {
                if (data.code !== RETURN_CODE.OK)
                {
                    //console.log('err.');
                    prompt.fade(data.message);
                    return;
                }

                //初始化全局变量gPlayer;
                gPlayer = data.player;
                console.log("gPlayer => ", gPlayer);

                //如果是断线重回游戏, 则不需要自动进入大厅;
                if (data.isBackGame) return;

                //进入Index
                UniversalController.enterIndex();

            });

        },

        onError : function() {
            //console.log("error");
        }
    });

}


