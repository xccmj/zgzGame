var HeaderLayer = cc.Layer.extend({
    ctor: function (args) {
        this._super();

        this.initSubscribeEvent();

        this.args = args;
        var size = cc.director.getWinSize();

        //左侧
        var leftTopBg = new cc.Node();
        leftTopBg.setPosition(0, size.height);
        leftTopBg.setAnchorPoint(0, 1);
        leftTopBg.setContentSize(250, 80);
        this.addChild(leftTopBg);

        var avatarBg = new cc.Node();
        avatarBg.setScale(0.65);
        avatarBg.setAnchorPoint(0, 1);
        avatarBg.setPosition(15, 70);
        leftTopBg.addChild(avatarBg);

        var avatar = new cc.MenuItemSprite(
            new cc.Sprite(utils.getAvatar(gPlayer.avatar)),
            new cc.Sprite(utils.getAvatar(gPlayer.avatar)),
            this.profile,
            this
        );

        var avatarSetting = new cc.MenuItemImage("#head_set.png", "#head_set.png",
            this.profile,
            this
        );

        avatarSetting.setPosition(0, -5);

        var avatarMenu = new cc.Menu(avatar, avatarSetting);
        avatarMenu.setPosition(-18, -70);
        avatarMenu.setScale(0.85);
        avatarBg.addChild(avatarMenu);

        var nickBg = new cc.Scale9Sprite("index_bg_gold.png", cc.rect(6, 5, 11, 7));
        nickBg.setAnchorPoint(0, 1);
        nickBg.setContentSize(130, 25);
        nickBg.setPosition(86, 70);
        leftTopBg.addChild(nickBg);

        var nickName = new cc.LabelTTF(gPlayer.nickName || '扎股子用户', "Arial", 14);
        nickName.setPosition(110, 10);
        nickName.setAnchorPoint(1, 0.5);
        nickBg.addChild(nickName);

        var goldBg = new cc.Scale9Sprite("index_bg_gold.png", cc.rect(6, 5, 11, 7));
        goldBg.setAnchorPoint(0, 1);
        goldBg.setContentSize(130, 25);
        goldBg.setPosition(86, 40);
        leftTopBg.addChild(goldBg);

        this.gold = new cc.LabelTTF(zgzNumeral(gPlayer.gold).format('0,0'), "Arial", 14);
        this.gold.setColor(cc.color.YELLOW);
        this.gold.setAnchorPoint(1, 0.5);
        this.gold.setPosition(110, 10);
        goldBg.addChild(this.gold);

        var goldIcon = new cc.Sprite("#common_icon_coins_1.png");
        goldIcon.setScale(0.5);
        goldIcon.setAnchorPoint(0, 1);
        goldIcon.setPosition(0 - 5, 28);
        goldBg.addChild(goldIcon);


        //右上侧
        var rightTopBg = new cc.Node();
        rightTopBg.setPosition(size.width, size.height);
        rightTopBg.setAnchorPoint(1, 1);
        rightTopBg.setContentSize(250, 80);
        this.addChild(rightTopBg);


        //每日必做
        // create help button sprite
        var doNormal = new cc.Sprite("#index_huodong.png");
        doNormal.attr({scale: 0.9});
        var doSelected = new cc.Sprite("#index_huodong.png");
        doSelected.attr({scale: 1});
        var doDisabled = new cc.Sprite("#index_huodong.png");

        // create help button and added it to header
        var doButton = new cc.MenuItemSprite(doNormal, doSelected, doDisabled, this.onDoButton, this);
        var menu = new cc.Menu(doButton);
        menu.setPosition(55, rightTopBg.height / 2 + 3);
        rightTopBg.addChild(menu);

        //red tip
        var doTip = new cc.Sprite("#red_tip.png");
        doTip.setPosition(70, rightTopBg.height / 2 - 15);
        doTip.scale = 0.4
        rightTopBg.addChild(doTip);

        //邮件
        var messageNormal = new cc.Sprite("#index_youjian_icon.png");
        messageNormal.attr({scale: 0.6});
        var messageSelected = new cc.Sprite("#index_youjian_icon.png");
        messageSelected.attr({scale: 0.65});
        var messageDisabled = new cc.Sprite("#index_youjian_icon.png");

        var messageMenu = new cc.MenuItemSprite(messageNormal, messageSelected, messageDisabled, this.onMessageBtnClick, this);
        messageMenu.setAnchorPoint(0, 0.5);
        var menu = new cc.Menu(messageMenu);
        menu.setPosition(95, rightTopBg.height / 2 + 15);
        rightTopBg.addChild(menu);

        var uiHighlightSystemMessage = Storage.get(CommonConf.LOCAL_STORAGE.UI_HIGHLIGHT_SYSTEM_MESSAGE);
        if (typeof uiHighlightSystemMessage === 'string') {
            if (uiHighlightSystemMessage == 'true') {
                uiHighlightSystemMessage = true;
            }
            else {
                uiHighlightSystemMessage = false;
            }
        }
        if (uiHighlightSystemMessage == null || uiHighlightSystemMessage == true) {
            //red tip
            var messageTip = new cc.Sprite("#red_tip.png");
            messageTip.setPosition(140, rightTopBg.height / 2 - 15);
            messageTip.scale = 0.4
            rightTopBg.addChild(messageTip);
        }

        //setting
        var settingNormal = new cc.Sprite("#index_shezhi_icon.png");
        settingNormal.attr({scale: 0.6});
        var settingSelected = new cc.Sprite("#index_shezhi_icon.png");
        settingSelected.attr({scale: 0.65});
        var settingDisabled = new cc.Sprite("#index_shezhi_icon.png");

        // create help button and added it to header
        var setButton = new cc.MenuItemSprite(settingNormal, settingSelected, settingDisabled, this.onSetButton, this);
        setButton.setAnchorPoint(0, 0.5);
        var menu = new cc.Menu(setButton);
        menu.setPosition(170, rightTopBg.height / 2 + 15);
        rightTopBg.addChild(menu);


        //中间
        var middleBg = new cc.Sprite("#index_mianban_04.png");
        middleBg.setScaleX(1);
        middleBg.setScaleY(0.8);
        middleBg.setAnchorPoint(0.5, 1);
        middleBg.setPosition(size.width / 2, size.height);
        this.addChild(middleBg);

        var titleImage = "#index_title.png";
        //if (args.lobbyId == 0) {
        //    titleImage = "#index_five.png";
        //} else if (args.lobbyId == 1) {
        //    titleImage = "#index_six.png";
        //} else if (args.lobbyId == 2) {
        //    titleImage = "#index_seven.png";
        //}

        try {
            if (args.lobbyId !== undefined) {
                titleImage = '#lobby'+args.lobbyId+'.png';
            }
        } catch (e) {
            titleImage = "#index_title.png";
        }

        var title = new cc.Sprite(titleImage);
        title.setAnchorPoint(0.5, 0);
        title.scale = 0.9
        title.setPosition(middleBg.width / 2, 16);
        middleBg.addChild(title);

        var leftIcon = new cc.Sprite("#index_mianban_04_2.png");
        leftIcon.setAnchorPoint(0, 1);
        leftIcon.setPosition(-12, 100);
        middleBg.addChild(leftIcon);
        var rightIcon = new cc.Sprite("#index_mianban_04_3.png");
        rightIcon.setAnchorPoint(1, 1);
        rightIcon.setPosition(middleBg.getContentSize().width + 14, 100);
        middleBg.addChild(rightIcon);

    },

    profile: function () {
        playEffect(audio_common.Button_Click);

        var self = this;

        UniversalController.getProfile(gPlayer.uid, function (data) {
            self.args.player = data;
            var scene = new ProfileScene(self.args);
            cc.director.runScene(scene);
        });
    },

    /**
     * do btn clicked.
     */
    onDoButton: function () {
        playEffect(audio_common.Button_Click);
        var self = this;
        UniversalController.getDailyTodoInfo(function (data) {
            var box = new DailyTodoLayer(data);

            self.addChild(box);
        })

    },
    onSetButton: function () {
        playEffect(audio_common.Button_Click);
        var self = this;
        var box = new SettingLayer();
        self.addChild(box);
    },



    onMessageBtnClick: function () {
        playEffect(audio_common.Button_Click);
        //this.addChild(new AlertBox('哎呀,您的网络太差...', function () {
        //
        //}, this));


        //this.addChild(new LoadingLayer({}));

        var self = this;
        //
        UniversalController.getSystemMessage(function (data) {
            self.addChild(new SystemMessageLayer(data));

            Storage.set(CommonConf.LOCAL_STORAGE.UI_HIGHLIGHT_SYSTEM_MESSAGE, false);
        })

    },

    initSubscribeEvent: function () {
        var self = this;

    },

    onEnter: function () {
        this._super();

        var self = this;
        this.goldChangeListener = EventBus.subscribe(gameEvents.GOLD_CHANGE, function (data) {
            if (self && cc.sys.isObjectValid(self)) {
                self.gold.setString(zgzNumeral(data.gold).format('0,0'))
            }
        });

    },

    onExit: function () {
        this._super();
        if(this.goldChangeListener){
            EventBus.removeSubscribe(this.goldChangeListener);
            this.goldChangeListener = null;
        }
        //cc.eventManager.removeCustomListeners(gameEvents.GOLD_CHANGE);
    }

})