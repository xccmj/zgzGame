var UpgradeLayer = function (data) {
    return this.ctor(data);
}

UpgradeLayer.prototype = {
    ctor: function (data) {

        this.box = new DialogSmall("版本更新", 3, {ensureCallback: this.ensureCallback, cancelCallback: this.cancelCallback, ensureLabel: '前往更新', cancelLabel: '暂不更新'}, this, 1);

        this.init(data);

        return this.box;

    },

    init: function (data) {
        var versionLabel = new cc.LabelTTF("最新版本: "+data.version, 'AmericanTypewriter', 36);
        versionLabel.color = {r: 0, g: 255, b: 127};
        versionLabel.x = 150;
        versionLabel.y = 510;
        versionLabel.setAnchorPoint(0, 0.5);


        this.box.bg.addChild(versionLabel);
        var summaryLabel = new cc.LabelTTF(data.summary, 'AmericanTypewriter', 34);
        summaryLabel.x = 150;
        summaryLabel.y = 440;
        summaryLabel.setAnchorPoint(0, 1);
        this.box.bg.addChild(summaryLabel);

        this.releaseUrlAndroid = data.releaseUrlAndroid;
    },

    ensureCallback: function (cb) {


        if (gOS === cc.sys.OS_IOS) {
            prompt.fadeMiddle('请前往Apple Store更新')
        }
        else {
            //erun是通过js-binding定义在c++的
            erun.openBrowser(this.releaseUrlAndroid);
        }


    },

    cancelCallback: function (cb) {
        cb(true);
    }
}