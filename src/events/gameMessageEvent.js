var pomelo = window.pomelo;

pomelo.on('onJoin', function (data) {
    console.log('receive join event.');
    console.log(data);

    cc.eventManager.dispatchCustomEvent("joinEvent", data);

});

pomelo.on('onLeave', function (data) {
    console.log('---->receive onLeave event.');
    console.log(data);

    cc.eventManager.dispatchCustomEvent("leaveEvent", data);
});

pomelo.on('onReady', function (data) {
    console.log('receive onReady event.');
    cc.eventManager.dispatchCustomEvent("readyEvent", data);
});



pomelo.on('onStart', function (data) {
    console.log('receive onStart event.');
    console.log(data);
    //赋值当前玩家actor全局变量
    gActor.actorNr = data.actor.actorNr;
    gActor.uid = data.actor.uid;
    gActor.cards = data.actor.gameStatus.currentHoldingCards;
    cc.eventManager.dispatchCustomEvent("gameStartEvent", data);
});

pomelo.on('onTalkCountdown', function (data) {
    console.log('receive onTalkCountdown event.', data);

    console.log('data.actor.uid + gPlayer.uid => ', data.actor.uid, gPlayer.uid);
    console.log('data.actor.uid == gPlayer.uid => ', data.actor.uid == gPlayer.uid);
    cc.eventManager.dispatchCustomEvent("talkCountdownEvent", data);


});

/**
 * 说话超时，代表没说话，UI逻辑倒计时结束，当前说话玩家面前Talk Menu消失;其他玩家UI显示当前玩家倒计时icon结束；
 * 服务器端会触发下一个talkCountdown事件，如果说话结束，会触发出牌onFanCountdown，如果没人说话，会重新开始onStart
 */
pomelo.on('onTalkTimeout', function (data) {
    console.log('onTalkTimeout.', data);

});

/**
 * 接收说话消息，处理说话成功UI逻辑；自己说话通过response响应
 */
pomelo.on('onTalk', function (data) {
    console.log('receive onTalk event.', data);
    //goal=说话结果（参考consts.GAME.IDENTITY)；append=说话时亮3情况，数组里放牌号；share=股子数

    cc.eventManager.dispatchCustomEvent("talkEvent", data);
});

/**
 * 接收说话消息，说话阶段结束
 */
pomelo.on('onAfterTalk', function (data) {
    console.log('receive onAfterTalk event.', data);
    //goal=说话结果（参考consts.GAME.IDENTITY)；append=说话时亮3情况，数组里放牌号；share=股子数

    cc.eventManager.dispatchCustomEvent("afterTalk", data);
});

/**
 * 出牌倒计时，
 */
pomelo.on('onFanCountdown', function (data) {
    console.log('receive onFanCountdown event.', data);
    console.log('lastFanCardRecognization:.', data.lastFanCardRecognization);
    gActor.isBoss = data.isBoss;

    //如果当前出牌玩家是上回合BOSS，则禁用或不显示“不出”按钮
    if (data.actor.uid == gPlayer.uid && data.isBoss) {

    }
    //actor: {uid: xx, actorNr: xx},isBoss: true/false（是否当前回合BOSS）,
    //lastFanCardRecognization: utils.cards.CardRecognization (上手牌型，如果是第一个出牌，则是null）, second: 倒计时时间
    cc.eventManager.dispatchCustomEvent("fanCountdownEvent", data);
});

//pomelo.on('onFanTimeout', function (data) {
//    console.log('onFanTimeout.');
//});

/**
 * 出牌消息，出牌者出牌时发送给其他玩家接受的消息；当前出牌者通过request/response得到出牌响应(gameController.fan)
 */
pomelo.on('onFan', function (data) {
    console.log('receive onFan event.', data);
    //如果有出牌，则设置全局变量上手牌型
    if (data.cardRecognization) {
        gLastFanCardRecognization = data.cardRecognization;
    }
    cc.eventManager.dispatchCustomEvent("fanOutEvent", data);
    //actor: {uid: xx, actorNr: xx},
    //cardRecognization: utils.cards.CardRecognization (当前出牌牌型）, cards: 出牌，数组[]，为空时为不出

});

/**
 * 托管
 * {actor: {uid: xx, actorNr: xx}}
 */
pomelo.on('onTrusteeship', function (data) {
    console.log('receive onTrusteeship event.');
    cc.eventManager.dispatchCustomEvent("trusteeshipEvent", data);

});

/**
 * 取消托管
 * {actor: {uid: xx, actorNr: xx}}
 */
pomelo.on('onCancelTrusteeship', function (data) {
    console.log('receive onCancelTrusteeship event.');
    cc.eventManager.dispatchCustomEvent("cancelTrusteeshipEvent", data);
});

/**
 * 结束
 * {
     game: {result: consts.GAME.RESULT.x, share: x},
     details: [{uid:x, actorNr:x, actualIdentity:[], result: consts.GAME.ACTOR_RESULT.x, gold: x, roomId: game.roomId, rank: actor.gameStatus.rank}]
   }
 */
pomelo.on('onOver', function (data) {
    console.log('receive onOver event.');
    cc.eventManager.dispatchCustomEvent("gameOverEvent", data);
});

/**
 * 当红3在没亮3情况下，出黑3，规则定义不能骗人，通知其他玩家自己有红3
 * {actor: {uid: xx, actorNr: xx}}
 */
pomelo.on('onFanWhenIsRed', function (data) {
    console.log('receive onFanWhenIsRed event.');
    cc.eventManager.dispatchCustomEvent("fanWhenIsRedEvent", data);
});

/**
 * 当玩家出牌结束，通知所有人
 * {
        actor: {
            uid: actor.uid,
            actorNr: actor.actorNr,
            rank: Int,
            identity: consts.GAME.IDENTITY.x
        }
    }
 */
pomelo.on('onFanFinished', function (data) {
    console.log('receive onFanFinished event.');
    cc.eventManager.dispatchCustomEvent("fanFinishedEvent", data);
});

pomelo.on('onChat', function (data) {
    console.log('receive onChat event.');
});

pomelo.on('onBroadcast', function (data) {
    console.log('receive onBroadcast event.');
});

/**
 * 自己金币变化
 */
pomelo.on('onGoldChange', function (data) {
    console.log('receive onGoldChange event.');
    gPlayer.gold = data.gold;
});

pomelo.on('disconnect', function(reason) {
    console.log('disconnected..');
    console.log(reason);
});

pomelo.on('onKick', function (data) {
    console.log('onKick..');
    console.log(data);
});

pomelo.on('heartbeat timeout', function (data) {
    console.log('heartbeat timeout..');
    console.log(data);
})