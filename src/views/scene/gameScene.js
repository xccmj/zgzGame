var GameScene = cc.Scene.extend({
    ctor: function (args, isBackGame) {
        this._super();
        if (!cc.eventManager.isEnabled()) {
            cc.eventManager.setEnabled(true);
        }
        //console.log("---->GameScene ctor");
        //cc.spriteFrameCache.addSpriteFrames(res.game_plist);
        //cc.spriteFrameCache.addSpriteFrames(res.poker_plist);
        //cc.spriteFrameCache.addSpriteFrames(res.avatar_plist);
        //cc.spriteFrameCache.addSpriteFrames(res.exp_plist);
        FrameCache.addSpriteFrames(res.game_plist);
        FrameCache.addSpriteFrames(res.poker_plist);
        FrameCache.addSpriteFrames(res.avatar_plist);
        FrameCache.addSpriteFrames(res.exp_plist);
        FrameCache.addSpriteFrames(res.common_plist);

        var layer = new GameLayer(args, isBackGame);
        this.addChild(layer);
    },

    onEnter: function () {

        this._super();

    },

    onEnterTransitionDidFinish: function () {

    },

    onExit: function () {
        this._super();
        //console.log("---->GameScene onExit");
        FrameCache.removeSpriteFrames(res.game_plist);
        FrameCache.removeSpriteFrames(res.poker_plist);
        FrameCache.removeSpriteFrames(res.avatar_plist);
        FrameCache.removeSpriteFrames(res.exp_plist);
        FrameCache.removeSpriteFrames(res.common_plist);
    }
});

var GameLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (args, isBackGame) {
        this._super();
        this.init();
        this.joinListener = null;
        this.leaveListener = null;
        this.readyListener = null;
        this.startListener = null;
        this.talkCountdwnListener = null;
        this.fanListener = null;
        this.fanCountdwnListener = null;
        this.talkListener = null;
        this.talkCountdownTimeoutListener = null;
        this.afterListener = null;
        this.overListener = null;
        this.fanFinishedListener = null;
        this.fanWhenIsRedListener = null;
        this.trusteeshipListener = null;
        this.cancelTrusteeshipListener = null;
        this.chatListener = null;
        this.goldChangeListener = null;
        this.ingotChangeListener = null;
        this.updateRemainingCardListener = null;

        //
        gGameSceneCompleted = false;


        this.m_pData = args;
        this.m_pTableLayer = null;  //zOrder: 2x
        this.m_pPokerLayer = null;  //zOrder: 1x
        this.m_pGameNemu = null;
        this.m_pReadyMenu = null;
        this.m_pClock = null;
        this.m_pFanOutMenuLayer = null;
        this.m_pBidMenuLayer = null;
        this.trusteeshipMask = null;
        this.m_pEffectLayer = null;
        //
        this.optionLayer = null;

        if (isBackGame) {
            var game = args.game;
            var actors = args.actors;
            var gameLogic = args.gameLogic;

            this.m_type = game.gameType;
            this.base = game.base;
            // 如果是重回游戏, 一定要为gGameType赋值, 决定游戏的牌型关键!!!
            gGameType = game.gameType;
            gLobbyId = game.lobbyId;
            gGameId = game.gameId;
            gRoomId = game.roomId;

            this.initActorList(args.actors);
            this.backGameInit(args);

        } else {
            this.m_type = args.gameType;
            this.base = args.base;
            gLobbyId = args.lobbyId;
            gGameId = args.gameId;
            this.initActorList(args.actors);
            this.initGame();
        }

        this.addExpressionBtn();

        //私人场
        if (gLobbyId == 3) {
            //显示房间号, 在左上角空白处
            this.addPrivateGameBar();
        }


    },

    onEnter: function () {
        this._super();
        this.init();
        //cc.log("GameLayer#onEnter");
        this.initSubscribeEvent();

        EventQueue.dispatchEventFromQueue();


        gGameSceneCompleted = true;
       // this.effectCard(0, 1);
    },

    onEnterTransitionDidFinish:function () {
        //cc.log("GameLayer#onEnterTransitionDidFinish");
        this._super();
    },


    onExit: function () {
        //cc.log("GameLayer#onExit");

        this._super();
        gGameSceneCompleted = false;
        //event
        //cc.eventManager.removeCustomListeners(gameEvents.JOIN);
        //cc.eventManager.removeCustomListeners(gameEvents.LEAVE);
        //cc.eventManager.removeCustomListeners(gameEvents.READY);
        //cc.eventManager.removeCustomListeners(gameEvents.START);
        //cc.eventManager.removeCustomListeners(gameEvents.TALK_COUNTDOWN);
        //cc.eventManager.removeCustomListeners(gameEvents.FAN);
        //cc.eventManager.removeCustomListeners(gameEvents.FAN_COUNTDOWN);
        //cc.eventManager.removeCustomListeners(gameEvents.TALK);
        //cc.eventManager.removeCustomListeners(gameEvents.OVER);
        //cc.eventManager.removeCustomListeners(gameEvents.FAN_FINISHED);
        //cc.eventManager.removeCustomListeners(gameEvents.FAN_WHEN_IS_RED);
        //cc.eventManager.removeCustomListeners(gameEvents.TRUSTEESHIP);
        //cc.eventManager.removeCustomListeners(gameEvents.CANCEL_TRUSTEESHIP);
        //cc.eventManager.removeCustomListeners(gameEvents.CHAT);
        //cc.eventManager.removeCustomListeners(gameEvents.INGOT_CHANGE);

        if(this.joinListener){
            EventBus.removeSubscribe(this.joinListener);
            this.joinListener = null;
        }
        if(this.leaveListener){
            EventBus.removeSubscribe(this.leaveListener);
            this.leaveListener = null;
        }
        if(this.readyListener){
            EventBus.removeSubscribe(this.readyListener);
            this.readyListener = null;
        }
        if(this.talkCountdwnListener){
            EventBus.removeSubscribe(this.talkCountdwnListener);
            this.talkCountdwnListener = null;
        }
        if(this.startListener){
            EventBus.removeSubscribe(this.startListener);
            this.startListener = null;
        }
        if(this.fanListener){
            EventBus.removeSubscribe(this.fanListener);
            this.fanListener = null;
        }
        if(this.fanListener){
            EventBus.removeSubscribe(this.fanListener);
            this.fanListener = null;
        }
        if(this.fanCountdwnListener){
            EventBus.removeSubscribe(this.fanCountdwnListener);
            this.fanCountdwnListener = null;
        }
        if(this.talkListener){
            EventBus.removeSubscribe(this.talkListener);
            this.talkListener = null;
        }
        if(this.talkCountdownTimeoutListener){
            EventBus.removeSubscribe(this.talkCountdownTimeoutListener);
            this.talkCountdownTimeoutListener = null;
        }
        if(this.afterListener){
            EventBus.removeSubscribe(this.afterListener);
            this.afterListener = null;
        }
        if(this.overListener){
            EventBus.removeSubscribe(this.overListener);
            this.overListener = null;
        }
        if(this.fanFinishedListener){
            EventBus.removeSubscribe(this.fanFinishedListener);
            this.fanFinishedListener = null;
        }
        if(this.fanWhenIsRedListener){
            EventBus.removeSubscribe(this.fanWhenIsRedListener);
            this.fanWhenIsRedListener = null;
        }
        if(this.trusteeshipListener){
            EventBus.removeSubscribe(this.trusteeshipListener);
            this.trusteeshipListener = null;
        }
        if(this.cancelTrusteeshipListener){
            EventBus.removeSubscribe(this.cancelTrusteeshipListener);
            this.cancelTrusteeshipListener = null;
        }
        if(this.chatListener){
            EventBus.removeSubscribe(this.chatListener);
            this.chatListener = null;
        }
        if(this.goldChangeListener){
            EventBus.removeSubscribe(this.goldChangeListener);
            this.goldChangeListener = null;
        }
        if(this.ingotChangeListener){
            EventBus.removeSubscribe(this.ingotChangeListener);
            this.ingotChangeListener = null;
        }
        if(this.updateRemainingCardListener){
            EventBus.removeSubscribe(this.updateRemainingCardListener);
            this.updateRemainingCardListener = null;
        }
       //
        cc.eventManager.removeListener(this.keyboardListener);
    },



    initSubscribeEvent: function () {
        //console.log('###initSubscribeEvent -> ');
        var selfPointer = this;
        this.joinListener = EventBus.subscribe(gameEvents.JOIN, function (data) {
            //cc.log("---->game  joinEvent: ", data);
            selfPointer.joinEvent(data);
        })

        this.leaveListener = EventBus.subscribe(gameEvents.LEAVE, function (data) {
            //cc.log("---->game  leaveEvent: ", event._userData);
            selfPointer.leaveEvent(data);
        });

        this.readyListener = EventBus.subscribe(gameEvents.READY, function (data) {
            //cc.log("---->game  readyEvent: ", event._userData);
            selfPointer.readyEvent(data);
        });

        this.startListener = EventBus.subscribe(gameEvents.START, function (data) {
            //cc.log("---->game  gameStartEvent: ", data);
            selfPointer.gameStartEvent(data);
        });

        this.talkCountdwnListener = EventBus.subscribe(gameEvents.TALK_COUNTDOWN, function (data) {
            //cc.log("---->game  talkCountdownEvent: ", data);
            selfPointer.talkCountdownEvent(data);
        });

        this.fanListener = EventBus.subscribe(gameEvents.FAN, function (data) {
            //cc.log("---->game  fanOutEvent: ", data);
            selfPointer.fanOutEvent(data);
        });

        this.fanCountdwnListener = EventBus.subscribe(gameEvents.FAN_COUNTDOWN, function (data) {
            //cc.log("---->game  fanCountdownEvent: ", data);
            selfPointer.fanCountdownEvent(data);
        });

        this.talkListener = EventBus.subscribe(gameEvents.TALK, function (data) {
            //cc.log("---->game  talkEvent: ", data);
            selfPointer.talkEvent(data);
        });

        this.talkCountdownTimeoutListener = EventBus.subscribe(gameEvents.TALK_COUNTDOWN_TIMEOUT, function (data) {
            //cc.log("---->game  talkTimeoutEvent: ", data);
            selfPointer.talkTimeoutEvent(data);
        });

        this.afterListener = EventBus.subscribe(gameEvents.AFTER_TALK, function (data) {
            //cc.log("---->game  afterTalk: ", data);
            selfPointer.afterTalk(data);
        });

        this.overListener = EventBus.subscribe(gameEvents.OVER, function (data) {
            //cc.log("---->game  gameOverEvent: ", data);
            selfPointer.overEvent(data);
        });

        this.fanFinishedListener = EventBus.subscribe(gameEvents.FAN_FINISHED, function (data) {
            //cc.log("---->game  fanFinishedEvent: ", data);
            selfPointer.fanFinishedEvent(data);
        });

        this.fanWhenIsRedListener = EventBus.subscribe(gameEvents.FAN_WHEN_IS_RED, function (data) {
            //cc.log("---->game  fanWhenIsRedEvent: ", data);
            selfPointer.fanWhenIsRedEvent(data);
        });

        this.trusteeshipListener = EventBus.subscribe(gameEvents.TRUSTEESHIP, function (data) {
            //cc.log("---->game  trusteeshipEvent: ", data);
            selfPointer.trusteeshipEvent(data);
        });

        this.cancelTrusteeshipListener = EventBus.subscribe(gameEvents.CANCEL_TRUSTEESHIP, function (data) {
            //cc.log("---->game  cancelTrusteeshipEvent: ", data);
            selfPointer.cancelTrusteeshipEvent(data);
        });

        this.chatListener = EventBus.subscribe(gameEvents.CHAT, function (data) {
            //cc.log("---->game  cancelTrusteeshipEvent: ", data);
            selfPointer.chatEvent(data);
        });

        this.goldChangeListener = EventBus.subscribe(gameEvents.GOLD_CHANGE, function (data) {
            if (selfPointer && cc.sys.isObjectValid(selfPointer)) {
                selfPointer.goldValue.setString(zgzNumeral(data.gold).format('0,0'))
            }
        });

        this.ingotChangeListener = EventBus.subscribe(gameEvents.INGOT_CHANGE, function (data) {
            if (selfPointer && cc.sys.isObjectValid(selfPointer)) {
                selfPointer.ingotValue.setString(zgzNumeral(data.ingot).format('0,0'))
            }

        });

        this.updateRemainingCardListener = EventBus.subscribe(gameEvents.UPDATE_REMAINING_CARD, function (data) {
            selfPointer.updateRemainingCards(data);
        });

        //
        //add a keyboard event listener to statusLabel
        this.keyboardListener = cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
            },
            onKeyReleased: function (keyCode, event) {
                if (keyCode == cc.KEY.back) {
                    GameController.leave(gRoomId);
                }

            }
        }, this);
    },

    backGameInit: function (args) {
        //背景
        this.addBg();

        //底部
        this.addBottom();
        //
        this.addOptionMenu();
        //
        //创建牌桌
        this.createTable();
        //刷新玩家信息
        this.updateActorHD();
        //game menu
        this.addMenu();


        //添加记牌器
        if (gRemainingCards) {
            this.addRemainingCards();
        }


//更新纸牌
//        for (var i = 0; i < len; i++) {
//            var cards = actors[i].currentHoldingCards;
//            if (cards.length > 0) {
//                break;
//            }
//        }
        var selfIndex = _.findIndex(args.actors, {uid: gPlayer.uid});
        var self = args.actors[selfIndex];
        gActor.actorNr = self.actorNr;
        gActor.uid = self.uid;
        gActor.cards = self.currentHoldingCards;

        var state = args.gameLogic.currentPhase == 1 ? ZGZ.GAME_STATE.TALK : ZGZ.GAME_STATE.PLAY;
        var data = {
            actor: {gameStatus: {currentHoldingCards: self.currentHoldingCards, append: self.append}},
            state: state
        };
        this.gameStartEvent(data);
//////判断阶段
        var gameLogic = args.gameLogic;
        var currentFanActor = gameLogic.currentFanActor;
        var currentTalker = gameLogic.currentTalker;
        var currentPhase = gameLogic.currentPhase;
        var lastFanActor = gameLogic.lastFanActor;
        var lastFanCardRecongnization = gameLogic.lastFanCardRecognization;
        var share = gameLogic.share;

        //append.. 用于牌型识别
        gActor.append = self.append;

        //
        if (state == ZGZ.GAME_STATE.TALK) {
            var actors = args.actors;
            var len = actors.length;
            //console.log("-----------------回到游戏，说话阶段-----------------");
            for (var i = 0; i < len; i++) {
                //说话情况
                this.talkEvent({
                    actorNr: actors[i].actorNr,
                    uid: actors[i].uid,
                    append: actors[i].append,
                    share: share,
                    goal: actors[i].identity
                });
            }
            this.talkCountdownEvent({actor: {actorNr: currentTalker.actorNr, uid: currentTalker.uid}, second: 15});
        } else {
            //console.log("-----------------回到游戏，打牌阶段-----------------");
            //如果上手牌型不为空,则显示上手牌; 否则可能是第一轮出牌, 则不需要显示.
            if (lastFanCardRecongnization != null) {
                this.fanOutEvent({
                    actorNr: lastFanActor.actorNr,
                    uid: lastFanActor.uid,
                    cards: lastFanCardRecongnization.originalCard
                });
            }

            var actor = {actorNr: currentFanActor.actorNr, uid: currentFanActor.uid};
            var isBoss = gameLogic.isBoss;
            var second = 15;
            gActor.isBoss = isBoss;
            gLastFanCardRecognization = lastFanCardRecongnization;
            this.fanCountdownEvent({actor: actor, isBoss: isBoss, second: second});
        }
        //处理说话显示和牌局名次
        var actors = args.actors;
        var len = actors.length;
        if (state == ZGZ.GAME_STATE.PLAY) {
            for (var i = 0; i < len; i++) {
                //说话情况
                this.talkEvent({
                    actorNr: actors[i].actorNr,
                    uid: actors[i].uid,
                    append: actors[i].append,
                    share: share,
                    goal: actors[i].identity
                });
                //牌局名次
                if (!!actors[i].rank) {
                    this.fanFinishedEvent({
                        actor: {
                            actorNr: actors[i].actorNr,
                            rank: actors[i].rank,
                            identity: actors[i].identity
                        }
                    })
                }

            }
        }

        //处理托管玩家--头像, 放到最后, 否则如果玩家托管, 托管层会遮挡其他元素
        var actors = args.actors;
        var len = actors.length;
        for (var i = 0; i < len; i++) {
            if (actors[i].isTrusteeship) {
                this.trusteeshipEvent({actor: {actorNr: actors[i].actorNr, uid: actors[i].uid}});
            }
        }

    },

    initGame: function () {
        //背景
        this.addBg();

        //底部
        this.addBottom();

        //
        this.addOptionMenu();

        //创建牌桌
        this.createTable();
        //刷新玩家信息
        this.updateActorHD();

        //game menu
        this.addMenu();
        this.addReadyMenu();

    },


    addBg: function () {
        var winSize = cc.director.getWinSize();
        //牌桌
        var bg = new cc.Sprite("#common_bg_beijing.png");
        bg.setPosition(winSize.width / 2, winSize.height / 2);
        bg.scale = ZGZ.SCALE * 10;
        this.addChild(bg);

        var centerIcon = new cc.Sprite('#game_icon_center.png');
        centerIcon.setPosition(winSize.width / 2, winSize.height / 2);
        centerIcon.scale = ZGZ.SCALE * 0.8;
        this.addChild(centerIcon);
    },

    addBottom: function () {
        var winSize = cc.director.getWinSize();
        var bottomBg = new cc.Sprite('#common_bg_wenzidiban.png');
        bottomBg.setAnchorPoint(0.5, 0);
        bottomBg.setPosition(winSize.width / 2, 0);
        bottomBg.scaleX = 1.5;
        this.addChild(bottomBg, 23);

        //
        var goldIcon = new cc.Sprite("#common_icon_coins_1.png");
        goldIcon.setScale(0.35);
        goldIcon.setAnchorPoint(0, 0);
        goldIcon.setPosition(winSize.width / 2 - 320, 0);
        bottomBg.addChild(goldIcon);

        this.goldValue = new cc.LabelTTF(zgzNumeral(gPlayer.gold).format('0,0'), "Arial", 14);
        this.goldValue.setColor(cc.color.YELLOW);
        this.goldValue.setAnchorPoint(0, 0);
        this.goldValue.setPosition(winSize.width / 2 - 290, 5);
        bottomBg.addChild(this.goldValue);

        //
        var ingotIcon = new cc.Sprite("#common_icon_yuanbao.png");
        ingotIcon.setAnchorPoint(0, 0);
        ingotIcon.setScale(0.7);
        ingotIcon.setPosition(winSize.width / 2 - 210, 5);
        bottomBg.addChild(ingotIcon);

        this.ingotValue = new cc.LabelTTF(zgzNumeral(gPlayer.fragment).format('0,0'), "Arial", 14);
        this.ingotValue.setColor(cc.color.YELLOW);
        this.ingotValue.setAnchorPoint(0, 0);
        this.ingotValue.setPosition(winSize.width / 2 - 185, 5);
        bottomBg.addChild(this.ingotValue);


        var now = new Date();
        var nowVal = (now.getHours() < 10 ? '0' + now.getHours() : now.getHours()) + ':' + (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes());
        this.timeLabel = new cc.LabelTTF(nowVal, "Arial", 14);
        this.timeLabel.color = {r: 135, g: 206, b: 250};
        this.timeLabel.setPosition(winSize.width/2 + 140, 15);
        bottomBg.addChild(this.timeLabel);

        var self = this;
        this.schedule(function () {
            var now = new Date();
            nowVal = (now.getHours() < 10 ? '0' + now.getHours() : now.getHours()) + ':' + (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes());
            self.timeLabel.setString(nowVal);
        }, 5);
    },

    addOptionMenu: function () {

        var winSize = cc.director.getWinSize();

        this.toolBarHeight = 50;
        this.toolBarState = 0;


        this.toolBar = new cc.Sprite("#toolsBg.png");
        this.toolBar.setPosition(winSize.width - 20, winSize.height-30);
        this.toolBar.scale = 0.55;

        this.addChild(this.toolBar, 21);


        //drop menu
        this.sToolDrop = new cc.MenuItemSprite(
            new cc.Sprite("#toolDropBtn.png"),
            new cc.Sprite("#toolDropBtn.png"),
            this.onOptionClicked,
            this
        );
        //this.toolDrop = new cc.Sprite("#game_icon_gu.png");
        //this.toolDrop.scale = 0.25
        //this.sToolDrop.addChild(this.toolDrop);
        //this.toolDrop.setPosition(32, 34);
        //
        //this.toolDropMenu = new cc.Menu(this.sToolDrop);
        //this.toolDropMenu.setPosition(winSize.width / 2 + 80, winSize.height - 80);
        //this.toolDropMenu.scale = 0.7
        //this.addChild(this.toolDropMenu, 1);

        //per width of component
        var cellWidth = 40;


        //托管
        this.trusteeshipBtn = new ccui.Button();
        this.trusteeshipBtn.setTouchEnabled(true);
        this.trusteeshipBtn.setAnchorPoint(0, 0.5)
        this.trusteeshipBtn.loadTextures("tool_ai.png", "tool_ai.png", "", ccui.Widget.PLIST_TEXTURE);
        this.trusteeshipBtn.x = cellWidth/2;
        this.trusteeshipBtn.y = 55;
        this.trusteeshipBtn.addTouchEventListener(this.trusteeship, this);
        this.toolBar.addChild(this.trusteeshipBtn);


        //底注
        this.baseBtn = new ccui.Button();
        this.baseBtn.setAnchorPoint(0, 0.5)
        //this.trusteeshipBtn.setTouchEnabled(true);
        this.baseBtn.loadTextures("basechip_tag.png", "basechip_tag.png", "", ccui.Widget.PLIST_TEXTURE);
        this.baseBtn.scale = 1.25;
        this.baseBtn.x = cellWidth/2 + 100;
        this.baseBtn.y = 55;
        this.toolBar.addChild(this.baseBtn);

        var baseLabel = new cc.LabelTTF(this.base, "Arial", 28);
        baseLabel.enableStroke(cc.color.YELLOW, 1);
        baseLabel.setAnchorPoint(0, 0.5)
        //baseLabel.color = cc.color.WHITE;
        baseLabel.setPosition(cellWidth/2 + 170, 55);
        this.toolBar.addChild(baseLabel);

        //leave
        this.leaveBtn = new ccui.Button();
        this.leaveBtn.setTouchEnabled(true);
        this.leaveBtn.setAnchorPoint(0, 0.5)
        this.leaveBtn.loadTextures("tool_exit.png", "tool_exit.png", "", ccui.Widget.PLIST_TEXTURE);
        this.leaveBtn.x = cellWidth/2 + 230;
        this.leaveBtn.y = 55;
        this.leaveBtn.addTouchEventListener(this.onLeaveButton, this);
        this.toolBar.addChild(this.leaveBtn);


    },

    onLeaveButton: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:

                break;

            case ccui.Widget.TOUCH_MOVED:

                break;

            case ccui.Widget.TOUCH_ENDED:
                playEffect(audio_common.Button_Click);
                //console.log("GameMenuLayer onBackButton:" + gRoomId);
                GameController.leave(gRoomId);
                break;

            case ccui.Widget.TOUCH_CANCELED:

                break;

            default:
                break;
        }
    },

    addPrivateGameBar: function () {
        var winSize = cc.director.getWinSize();
        var gameIdLabel = new cc.LabelTTF('房间ID:'+gGameId, "Arial", 20);
        gameIdLabel.color = {r: 0, g: 255, b: 127};
        gameIdLabel.setAnchorPoint(0, 0);
        gameIdLabel.setPosition(15, winSize.height - 35);
        this.addChild(gameIdLabel);
    },

    addExpressionBtn: function () {
        var winSize = cc.director.getWinSize();

        this.expressBtn = new ccui.Button();
        this.expressBtn.setPressedActionEnabled(true);
        this.expressBtn.setTouchEnabled(true);
        this.expressBtn.loadTextures("tool_chat.png", "tool_chat.png", "", ccui.Widget.PLIST_TEXTURE);
        this.expressBtn.setAnchorPoint(1, 0);
        this.expressBtn.scale = 0.8;
        this.expressBtn.x = winSize.width - 10;
        this.expressBtn.y = 30;
        this.expressBtn.addTouchEventListener(this.onExpressBtnClicked, this);
        this.addChild(this.expressBtn, 24);
    },

    onActorAvatarClicked: function (sender, type) {
        var self = this;
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;

            case ccui.Widget.TOUCH_MOVED:

                break;

            case ccui.Widget.TOUCH_ENDED:
                playEffect(audio_common.Button_Click);

                UniversalController.getProfileByUid(this.m_uid, function (data) {
                    var node = cc.director.getRunningScene().getChildByTag( GAME_ZODER.PlayerProfile);
                    if(node == null){
                        cc.director.getRunningScene().addChild(new PlayerProfileLayer(data), GAME_ZODER.PlayerProfile, GAME_ZODER.PlayerProfile);
                    }
                });

                break;

            case ccui.Widget.TOUCH_CANCELED:

                break;

            default:
                break;
        }
    },

    onExpressBtnClicked: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:

                break;

            case ccui.Widget.TOUCH_MOVED:

                break;

            case ccui.Widget.TOUCH_ENDED:
                playEffect(audio_common.Button_Click);

                if (this.getChildByName('chatLayer')) {
                    this.chatLayer.removeFromParent(true);
                    return;
                }

                this.chatLayer = new ChatInGameLayer();
                this.chatLayer.setName('chatLayer');
                this.addChild(this.chatLayer, 22);


                break;

            case ccui.Widget.TOUCH_CANCELED:

                break;

            default:
                break;
        }
    },


    createTable: function () {
        var winSize = cc.director.getWinSize();
        switch (this.m_type) {
            case ZGZ.GAME_TYPE.T1:
                this.m_pTableLayer = new FivePeopleTableLayer({onActorAvatarClickedCallback: this.onActorAvatarClicked});
                this.addChild(this.m_pTableLayer, 1);
                this.m_pTableLayer.setClockCallback(this, this.clockCallback);

                break;
            case ZGZ.GAME_TYPE.T2:
                this.m_pTableLayer = new SixPeopleTableLayer({onActorAvatarClickedCallback: this.onActorAvatarClicked});
                this.addChild(this.m_pTableLayer, 1);
                this.m_pTableLayer.setClockCallback(this, this.clockCallback);

                break;
            case ZGZ.GAME_TYPE.T3:
                this.m_pTableLayer = new SevenPeopleTableLayer({onActorAvatarClickedCallback: this.onActorAvatarClicked});
                this.addChild(this.m_pTableLayer, 1);
                this.m_pTableLayer.setClockCallback(this, this.clockCallback);

                break;
        }
        var visSize = cc.director.getVisibleSize();
        this.addChild(new notificationLayer({x:winSize.width/2, y:winSize.height - 100, w:visSize.width*0.6 , visible:false, opacity:150}), 15);
        this.addPokerLayer(this.m_pTableLayer);
    },
    addMenu: function () {
        this.m_pGameNemu = new GameMenuLayer();
        this.addChild(this.m_pGameNemu);

    },
    addReadyMenu: function () {
        this.m_pReadyMenu = new ReadyMenuLayer();
        this.addChild(this.m_pReadyMenu);
    },

    addPokerLayer: function (tableLayer) {
        this.m_pPokerLayer = new PokerLayer();
        this.addChild(this.m_pPokerLayer, 0);
        this.m_pPokerLayer.m_pTable = tableLayer;
    },

    updateActorHD: function () {
        //刷新头像
        this.m_pTableLayer.updateActorHD(this.m_actorList);
    },

    /**
     * 局部更新头像,
     * @param actor
     * @param type 1: join, 2: leave
     */
    updateOneActorHD: function (actor, type) {
        this.m_pTableLayer.updateOneActorHD(actor, type);
    },

    sortActor: function () {
        //重新排列actor，从而改变他们现实的位置。
        if (this.m_actorList == null) {
            return;
        }
    },

    addActorToList: function (actor) {
        //console.log("addActorToList  : ", actor);
        if (this.m_actorList) {
            var actor = new Actor(actor);
            this.m_actorList.push(actor);
        }
    },
    removeActorFromList: function (actor) {
        if (this.m_actorList) {
            //var actor = new Actor(actor);
            //离开别人
            for (var i = 0; this.m_actorList.length; i++) {
                var one = this.m_actorList[i];
                if (actor.uid == one.m_uid) {
                    //this.m_actorList.delete(one);
                    this.m_actorList.splice(i, 1);
                    return;
                }
            }
        }
    },
//把join得到的actor数组重新整理，生成actor结构，push到
    initActorList: function (actorArray) {
        this.m_actorList = [];
        //console.log("--->initActorList:", actorArray);
        var len = actorArray.length;

        for (var i = 0; i < len; i++) {
            //console.log(actorArray[i]);
            //console.log(actorArray[i].properties);
            var actor = new Actor(actorArray[i]);
            this.m_actorList.push(actor);

        }
    },

    selfLeave: function (actor) {
        // var actor = new Actor(actor);
        if (actor.uid == gPlayer.uid) {
            return true;
        }
        return false;
    },

    clockCallback: function () {
        //删除bid，fanout menu
        this.removeBidMenu();
        this.removeFanOutMenu();
    },

    removeBidMenu: function () {
        //删除bid
        if (this.m_pBidMenuLayer && cc.sys.isObjectValid(this.m_pBidMenuLayer)) {
            this.m_pBidMenuLayer.removeFromParent(true);
            this.m_pBidMenuLayer = null;
        }
    },
    removeFanOutMenu: function () {
        //删除fanout menu
        //console.log("--->removeFanOutMenu  1");
        if (this.m_pFanOutMenuLayer && cc.sys.isObjectValid(this.m_pFanOutMenuLayer)) {
            this.m_pFanOutMenuLayer.removeFromParent(true);
            this.m_pFanOutMenuLayer = null;
            //console.log("--->removeFanOutMenu");
            if (this.m_pPokerLayer) {
                this.m_pPokerLayer.m_pFanOutMenuLayer = this.m_pFanOutMenuLayer;
            }
        }
    },
    addBidMenu: function (tag) {
        if (this.m_pBidMenuLayer == null) {
            this.m_pBidMenuLayer = new BidMenuLayer();
            this.addChild(this.m_pBidMenuLayer, 10);
            this.m_pBidMenuLayer.setCallback(this, this.bidMenuCallback);
        }
        this.m_pBidMenuLayer.setBtnVisible(tag, true);
    },
    addFanOutMenu: function () {
        //console.log("--->addFanOutMenu   1");
        if (this.m_pFanOutMenuLayer == null) {
            this.m_pFanOutMenuLayer = new FanOutMenuLayer();
            this.addChild(this.m_pFanOutMenuLayer, 10);
            this.m_pFanOutMenuLayer.setCallback(this, this.fanOutCallback);
            //console.log("--->addFanOutMenu");
            if (this.m_pPokerLayer) {
                this.m_pPokerLayer.m_pFanOutMenuLayer = this.m_pFanOutMenuLayer;
            }
        }
    },

    bidMenuCallback: function (tag) {
        switch (tag) {
            case BidMenuBtn.kCCBidMenu_Liang:
                if (this.m_pPokerLayer.m_pSelectedWillOutCards && this.m_pPokerLayer.m_pSelectedWillOutCards.length == 0) {
                   // console.log("---->33333333333333333");
                    prompt.fadeMiddle('请先选出手牌里的3,再点亮3');
                    return;
                }
                if (this.m_pPokerLayer.m_pSelectedWillOutCards == null || this.m_pPokerLayer.m_pSelectedWillOutCards == undefined) {
                    //console.log("---->44444444444444444");
                    prompt.fadeMiddle('请先选出手牌里的3,再点亮3');
                    return;
                }
                GameController.talk(gRoomId, gGameId, GAME.IDENTITY.HONG3, this.m_pPokerLayer.m_pSelectedWillOutCards);
                break;
            case BidMenuBtn.kCCBidMenu_Guzi:
                GameController.talk(gRoomId, gGameId, GAME.IDENTITY.GUZI, this.m_pPokerLayer.m_pSelectedWillOutCards);
                break;
            case BidMenuBtn.kCCBidMenu_Bujiao:
                GameController.talk(gRoomId, gGameId, GAME.IDENTITY.UNKNOW, []);
                break;
            case BidMenuBtn.kCCBidMenu_GiveUp:
                this.removeBidMenu();
                GameController.giveUp();
                break;
        }

    },

    fanOutCallback: function (tag) {
        //GameController.fan = function (roomId, gameId, cards)
        switch (tag) {
            case FanOutMenuBtn.kCCFanOutMenu_Pass:
                GameController.fan(gRoomId, gGameId, []);
                break;
            case FanOutMenuBtn.kCCFanOutMenu_FanOut:
                if (!this.m_pPokerLayer.checkForFanOut(this.m_pPokerLayer.isCanFanOut)) {
                    return;
                }
                GameController.fan(gRoomId, gGameId, this.m_pPokerLayer.m_pSelectedWillOutCards);
                break;
            case FanOutMenuBtn.kCCFanOutMenu_Hint:
                GameController.fan(gRoomId, gGameId, this.m_pPokerLayer.m_pSelectedWillOutCards);
                break;
        }
    },


    recognitionIdentityWithNr: function (goal, append, actorNr) {
        if (this.m_actorList == null) {
            return;
        }
        var isIdentity = false;
        var identity = cardUtil.recognitionIdentity(append, gGameType);
        //if (identity == GAME.IDENTITY.HONG3) {
        //    isIdentity = true;
        //}

        //var len = this.m_actorList.length;
        //for(var i=0; i<len; i++){
        //    var　actor = this.m_actorList[i];
        //    if(gActor.actorNr == actorNr){
        //        gActor.identity = isIdentity;
        //    }
        //    if(actor.m_actorNr == actorNr){
        //        actor.m_identity = isIdentity;
        //        break;
        //    }
        //}

        var actorHD = this.m_pTableLayer.getActorHDWithNr(actorNr)
        if (actorHD) {
            actorHD.m_identity = identity;
            actorHD.showIdentity(goal, append);
        }
    },

    sayForTalk: function (args) {
        if (this.m_actorList == null) {
            return;
        }

        var append = args.append;
        var text = args.text ? args.text : "";
        var actorNr = args.actorNr;
        var haveAppend = false;

        if (append) {
            haveAppend = true;
            //分析牌型
            //var identity = cardUtil.recognitionIdentity(append, gGameType);
            if (args.goal == GAME.IDENTITY.HONG3) {
                text = "亮3";
            }
            else if (args.goal == GAME.IDENTITY.GUZI) {
                text = "股子"
            }
            else {
                text = "没话";
            }
        }

        this.m_pTableLayer.showSay(text, actorNr);

    },

    cancelReadyWhenOver: function () {
        _.map(this.m_actorList, function (actor) {
            actor.m_isReady = false;
        });
    },

//event
    joinEvent: function (data) {
        this.addActorToList(data.actor);
        this.updateOneActorHD(data.actor, 1);
        playEffect(audio_common.Player_Come_In);
    },

    leaveEvent: function (data) {
        //cc.log("---->game  leaveEvent: ", data);
        if (this.selfLeave(data.actor) == false) {
            this.removeActorFromList(data.actor);
            this.updateOneActorHD(data.actor, 2);
            playEffect(audio_common.Player_Logout);
        } else {
            //cc.director.popScene();
            GameController.enterLobby(gLobbyId);//回大厅
        }
    },


    readyEvent: function (data) {
        //var actor = new Actor(actor);
        // this.m_pTableLayer.readyEvent(actor);
        if (gPlayer.uid == data.uid) {
            if (this.m_pReadyMenu && cc.sys.isObjectValid(this.m_pReadyMenu)) {
                this.m_pReadyMenu.removeFromParent(true);
                this.m_pReadyMenu = null;
            }
        }
        for (var i = 0; this.m_actorList.length; i++) {
            var actor = this.m_actorList[i];
            if (data.actorNr == actor.m_actorNr) {
                actor.m_isReady = true;
                this.m_pTableLayer.readyEvent(actor);
                return;
            }
        }
    },

    gameStartEvent: function (data) {
        //console.log("gameStartEvent :");
        //console.log(data);
        gGameState = data.state || ZGZ.GAME_STATE.TALK;

        if (this.m_pPokerLayer) {
            //console.log("m_pSelectedWillOutCards  == null  1");
            this.m_pPokerLayer.clearSelectedWillOutCards();
            this.m_pPokerLayer.gameStart(data.actor);
        }
        if (this.m_pTableLayer) {
            this.m_pTableLayer.removeAllActorReady();
        }
        //console.log("gameStartEvent end");

        if (gRemainingCards) {
            this.addRemainingCards();
        }
    },

    addRemainingCards: function () {
        if (!gRemainingCards || gRemainingCards.length == 0);

        var winSize = cc.director.getWinSize();
        var remainingCardsSprite = new cc.Sprite('#game_jipaiqi_01.png');
        remainingCardsSprite.setAnchorPoint(0, 0);
        remainingCardsSprite.setPosition(winSize.width / 2 - 80, -20);
        this.addChild(remainingCardsSprite, 24);

        var perWidth = remainingCardsSprite.getContentSize().width / 15;
        var y = 20;
        var labelXList = _.map([19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5], function (modValue, index) {
            return {modValue: modValue, x: index * perWidth + perWidth / 2};
        });

        this.remainingCardsLabelList = [];

        var self = this;

        if (gRemainingCards && gRemainingCards.length > 0) {
            gRemainingCards.forEach(function (remainingCard) {
                var x = _.findWhere(labelXList, {modValue: remainingCard.modValue}).x;
                var label = new cc.LabelTTF(remainingCard.count, 'Arial', 14);
                label.setAnchorPoint(0.5, 0);
                label.x = x;
                label.y = y;
                label.setTag(remainingCard.modValue);
                remainingCardsSprite.addChild(label);
                self.remainingCardsLabelList.push({modValue: remainingCard.modValue, label: label});
            })
        }


    },

    updateRemainingCards: function (data) {
        var self = this;
        if (gRemainingCards && gRemainingCards.length > 0) {
            gRemainingCards.forEach(function (remainingCard) {
                var label = _.findWhere(self.remainingCardsLabelList, {modValue: remainingCard.modValue}).label;
                label.setString(remainingCard.count);
            });
        }

    },

    talkCountdownEvent: function (data) {
        //console.log("onTalkCountdown :");
        //如果说话倒计时是当前玩家
        if (this.m_pPokerLayer) {
            this.m_pPokerLayer.onTalkCountdown(data);
        }

        if (this.m_pTableLayer) {
            this.m_pTableLayer.stopClock();
        }

        if (data.actor.uid == gPlayer.uid) {

            //识别当前玩家身份
            var identity = cardUtil.recognitionIdentity(gActor.cards, gGameType);
            //如果是红3，显示亮3说话按钮
            if (identity == GAME.IDENTITY.HONG3) {
                //cc.log('说话阶段-当前玩家是红3，显示“亮3”按钮')
                this.addBidMenu(BidMenuBtn.kCCBidMenu_Liang);
                //gActor.identity = true;
            }
            else {
                //cc.log('说话阶段-当前玩家是股子，显示“股子”按钮')
                this.addBidMenu(BidMenuBtn.kCCBidMenu_Guzi);
                //gActor.identity = false;
            }

            var isShuangSan = cardUtil.isShuangSan(gActor.cards, gGameType);
            if (isShuangSan) {
                this.addBidMenu(BidMenuBtn.kCCBidMenu_GiveUp);
            }


        } else {

        }
        if (this.m_pTableLayer) {
            this.m_pTableLayer.showClock(data.actor.actorNr, data.second);
        }

    },

    startEvent: function (data) {

    },

    talkEvent: function (data) {
        //cc.log("----------------->talkEvent:", data);
        var uid = data.uid;
        var actorNr = data.actorNr;
        var goal = data.goal;
        var append = data.append;
        var share = data.share;

        this.recognitionIdentityWithNr(goal, append, actorNr);
        this.removeBidMenu();

        //如果是亮3操作，说话结束后把亮的牌收回
        if (this.m_pPokerLayer) {
            if(uid == gPlayer.uid){
                if(goal == GAME.IDENTITY.HONG3 || goal == GAME.IDENTITY.GUZI){
                   // console.log("m_pSelectedWillOutCards  == null  0");
                    this.m_pPokerLayer.resetSelectedCards();
                    this.m_pPokerLayer.clearSelectedWillOutCards();
                }
            }
        }

        if (this.m_pTableLayer) {
            this.m_pTableLayer.stopClock();
        }
        this.updateShare(share);
        //如果是说话环节, 显示说话气泡; 因重回游戏也调用此函数
        if (gGameState == ZGZ.GAME_STATE.TALK) {
            this.sayForTalk({goal: goal, append: append, actorNr: actorNr});
        }

        this.audioTalk(goal, actorNr);
    },

    afterTalk: function (data) {
        //cc.log("----------------->afterTalk:", data);
        //if (this.m_pTableLayer) {
        //    this.m_pTableLayer.stopClock();
        //    this.m_pTableLayer.removeAllActorReady();
        //}
        this.removeBidMenu();

    },

    talkTimeoutEvent: function (data) {
        //cc.log("---->talkTimeoutEvent:", data);
        //var uid = data.uid;
        //var actorNr = data.actorNr;
        //var cards = data.cards;
        //var cardRecognization = data.cardRecognization;
        //this.m_pPokerLayer.setFanOutCards(cards, actorNr);
    },

    fanOutEvent: function (data) {
        //cc.log("---->fanOutEvent:", data);
        var uid = data.uid;
        var actorNr = data.actorNr;
        var cards = data.cards;
        var cardRecognization = data.cardRecognization;
        this.m_pPokerLayer.setFanOutCards(cards, actorNr);

        this.audioCard(cardRecognization, actorNr);
        this.effectCard(cardRecognization, actorNr);
        if (cardRecognization == null) {
            //var random = Math.floor(Math.random() * 2);
            //this.m_pTableLayer.showSay(text, actorNr);
        }
    },

    fanCountdownEvent: function (data) {
        //cc.log("---->fanCountdownEvent:", data);
        gGameState = ZGZ.GAME_STATE.PLAY;
        if (this.m_pTableLayer) {
            this.m_pTableLayer.stopClock();
            this.removeFanOutMenu();
        }

        if (data.actor.uid == gPlayer.uid) {
            var boss = data.isBoss;
            if(this.trusteeshipMask == null){
                this.addFanOutMenu();
                //cc.log("---->未托管状态");
                if (this.m_pFanOutMenuLayer) {
                    this.m_pFanOutMenuLayer.setBtnEnabled(FanOutMenuBtn.kCCFanOutMenu_Pass, true);
                }
                this.m_pFanOutMenuLayer.setBtnEnabled(FanOutMenuBtn.kCCFanOutMenu_FanOut, true);
            }
        } else {

        }

        if (this.m_pTableLayer) {
            this.m_pTableLayer.showClock(data.actor.actorNr, data.second);
        }

        if (this.m_pPokerLayer) {
            if (data.isBoss) {
                this.m_pPokerLayer.hideAllActorFanOutCards();
            } else {
                this.m_pPokerLayer.hideFanOutCards(data.actor.actorNr);
            }
        }

    },

    /**
     *3家没有亮3,先出黑3,为防止骗人,通知他人. 调用sayForTalk: "有3"
     * @param data {actor: {uid: xx, actorNr: xx}}
     */
    fanWhenIsRedEvent: function (data) {
        var actor = data.actor;
        this.sayForTalk({append: null, actorNr: actor.actorNr, text: "有3"});
        this.audioFanYou3(actor.actorNr);
    },

    /**
     * 当玩家除完手牌，标识玩家名次和身份
     * @param data {actor: {uid: xx, actorNr: xx, rank: xx, identity: xx}}
     */
    fanFinishedEvent: function (data) {
        var actor = data.actor;
        this.m_pTableLayer.fanFinishedEvent(actor.actorNr, actor.rank, actor.identity);
    },

    trusteeshipEvent: function (data) {
        var winSize = cc.director.getWinSize();
        var actor = data.actor;
        this.m_pTableLayer.trusteeshipEvent(actor.actorNr);
        if (actor.uid == gPlayer.uid) {
            if (this.trusteeshipMask == null) {
                this.trusteeshipMask = new MaskLayer(true);
                var sCancelTrusteeship = new cc.MenuItemSprite(
                    new cc.Sprite("#game_btn_quxiaotuoguan.png"),
                    new cc.Sprite("#game_btn_quxiaotuoguan.png"),
                    this.cancelTrusteeship,
                    this
                );
                var cancelTrusteeshipMenu = new cc.Menu(sCancelTrusteeship);
                cancelTrusteeshipMenu.setPosition(winSize.width / 2 - 190, 100);
                cancelTrusteeshipMenu.scale = 0.6;
                this.trusteeshipMask.addChild(cancelTrusteeshipMenu);
                this.addChild(this.trusteeshipMask);
                //console.log("删添加一个托管");
            }
        }
    },

    cancelTrusteeshipEvent: function (data) {
        var winSize = cc.director.getWinSize();
        var actor = data.actor;
        this.m_pTableLayer.cancelTrusteeshipEvent(actor.actorNr);
        if (actor.uid == gPlayer.uid) {
            if (this.trusteeshipMask && cc.sys.isObjectValid(this.trusteeshipMask)) {
                this.trusteeshipMask.removeFromParent(true);
                this.trusteeshipMask = null;
                //console.log("删除一个托管");
            }
        }
    },

    trusteeship: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:

                break;

            case ccui.Widget.TOUCH_MOVED:

                break;

            case ccui.Widget.TOUCH_ENDED:
                playEffect(audio_common.Button_Click);

                GameController.trusteeship(gRoomId, gGameId);
                break;

            case ccui.Widget.TOUCH_CANCELED:

                break;

            default:
                break;
        }

    },

    cancelTrusteeship: function () {
        playEffect(audio_common.Button_Click);
        GameController.cancelTrusteeship(gRoomId, gGameId);
    },

    /**
     * 游戏结束
     * @param data
     */
    overEvent: function (data) {
        var self = this;
        this.removeFanOutMenu();
        this.cancelReadyWhenOver();

        if (this.m_pPokerLayer) {
            this.m_pPokerLayer.clearCards();
        }

        if (this.m_pTableLayer) {
            this.m_pTableLayer.stopClock();
        }

        if (this.trusteeshipMask && cc.sys.isObjectValid(this.trusteeshipMask)) {
            this.trusteeshipMask.removeFromParent(true);
            this.trusteeshipMask = null;
        }

        //显示玩家剩余手牌
        _.each(data.remainingCardsOfActors, function (v) {
            if (v.remainingCards.length == 0) return;
            if (v.actorNr == gActor.actorNr) return;
            self.showRemainingCards(v);
        })

        this.balanceLayer = new BalanceLayer(data,
            {
                ready: function () {
                    if (self.balanceLayer && cc.sys.isObjectValid(self.balanceLayer)) self.balanceLayer.removeFromParent(true);
                    if (self.m_pTableLayer) self.m_pTableLayer.updateActorHD(self.m_actorList);
                    GameController.ready(gRoomId, gGameId);
                },
                leave: function () {
                    GameController.leave(gRoomId);
                }
            });
        this.addChild(this.balanceLayer, 30);
    },


    showRemainingCards: function (data) {
        var actorNr = data.actorNr;
        var cards = data.remainingCards;
        this.m_pPokerLayer.showRemainingCards(cards, actorNr);
    },

    /**
     * 准备响应
     */
    readyResponse: function () {
        //cc.log("---->readyResponse");
        //cc.log(this.m_actorList);
        if (this.m_pReadyMenu && cc.sys.isObjectValid(this.m_pReadyMenu)) {
            this.m_pReadyMenu.removeFromParent(true);
            this.m_pReadyMenu = null;
        }
        var actor;
        for (var i = 0; this.m_actorList.length; i++) {
            actor = this.m_actorList[i];
            //cc.log("---->gPlayer.id:" + gPlayer.uid + "--actor.m_uid:" + actor.m_uid);
            if (gPlayer.uid == actor.m_uid) {
                actor.m_isReady = true;
                //cc.log(actor);
                this.m_pTableLayer.readyResponse(actor);
                return;
            }
        }

    },

    /**
     * 废弃，依赖Event处理
     * 说话响应
     * @param data
     * @constructor
     */
    talkResponse: function (data) {
        /*
         cc.log("----------------->TalkResponse:", data);
         var code = data.code;
         if (code == 500) {
         cc.log("----> talk fail");
         return;
         }

         var goal = data.goal;
         var append = data.append;
         var share = data.share;

         this.removeBidMenu();

         this.recognitionIdentityWithNr(goal, append, gActor.actorNr);
         this.sayForTalk({goal: goal, append: append, actorNr: gActor.actorNr});

         if (this.m_pTableLayer) {
         this.m_pTableLayer.stopClock();
         }
         this.updateShare(share);
         */
    },

    /**
     * 出牌响应
     * @param data
     * @constructor
     */
    fanOutResponse: function (data) {
        //cc.log("FanOutResponse :", data);
        var code = data.code;
        if (code == RETURN_CODE.FAIL) {
            //cc.log("----> FanOutResponse fail");
            return;
        }

        var cards = data.cards;
        var cardRecognization = data.cardRecognization;
        //this.m_pPokerLayer.setFanOutCards(cards, gActor.actorNr);
        playEffect(audio_common.Button_Click);
    },

    trusteeshipResponse: function (data) {

    },

    cancelTrusteeshipResponse: function (data) {

    },

    chatEvent: function (data) {
        if (data.type == GAME.CHAT.TYPE_QUICK) {
            //显示文字
            this.m_pTableLayer.showSay(ChatConf.quick[data.item], data.actorNr);
            //处理声音
            var actorHD = this.m_pTableLayer.getActorHDWithNr(data.actorNr);
            var sex = actorHD.m_gender;
            playEffect(audio_chat[data.item][sex]);

        }else if (data.type == GAME.CHAT.TYPE_EXP) {
            this.m_pTableLayer.showExpression(data.item, data.actorNr);
        }
    },

    effectCardCallBack: function ()
    {
        this.m_pEffectLayer = null;
        //cc.log("----> effectCardCallBack");
    },

    effectCard: function (cardRecognization, actorNr) {
        if (cardRecognization == null) {
            return;
        }
        if(this.m_pEffectLayer ){
            this.m_pEffectLayer.removeFromParent(true);
            this.m_pEffectLayer = null;
        }
        this.m_pEffectLayer = new EffectLayer({effect:cardRecognization.cardSeries, targe:this, callback:this.effectCardCallBack});
        //this.m_pEffectLayer = new EffectLayer({effect:6, targe:this, callback:this.effectCardCallBack});
        this.addChild(this.m_pEffectLayer, 10);
    },

    audioCard: function (cardRecognization, actorNr) {
        var actorHD = this.m_pTableLayer.getActorHDWithNr(actorNr);
        var sex = actorHD.m_gender;
        if (cardRecognization == null) {
            var random = Math.floor(Math.random() * 2);
            playEffect(audio_fanmenu.Pass[random][sex]);
            this.m_pTableLayer.showSay(PassText[random], actorNr);
            return;
        }
        if (cardRecognization.cardSeries > 2) {
            playEffect(audio_card[cardRecognization.cardSeries - 1][0][sex]);
        } else {
            playEffect(audio_card[cardRecognization.cardSeries - 1][cardRecognization.maxCardPoint][sex]);
        }
    },

    audioTalk: function (goal, actorNr) {
        var actorHD = this.m_pTableLayer.getActorHDWithNr(actorNr);
        var sex = actorHD.m_gender;
        playEffect(audio_talk[goal][sex]);
    },

    audioFanYou3: function (actorNr) {
        var actorHD = this.m_pTableLayer.getActorHDWithNr(actorNr);
        var sex = actorHD.m_gender;
        playEffect(audio_fan_you3[0][sex]);
    },

    /**
     * 更新股数
     * @param share
     */
    updateShare: function (share) {
        //var roomInfoLabel = new cc.LabelTTF("底注:"+this.m_pData.base, "Arial", 34);
        //var gameShare = new cc.LabelTTF("股数:"+share, "Arial", 34);

    }




});