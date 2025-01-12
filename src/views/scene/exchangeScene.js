var ExchangeScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        this.scheduleOnce(this.updateTime, 0.5);
    },

    ctor: function (args) {
        this._super();
        //console.log("  ExchangeScene ctor");
        FrameCache.addSpriteFrames(res.common_plist);
        FrameCache.addSpriteFrames(res.index_plist);
        this.selected = 100;

        //background
        var winSize = cc.director.getWinSize();
        var bg = new cc.Sprite("#common_bg_beijing.png");
        bg.setPosition(winSize.width / 2, winSize.height / 2);
        bg.scale = ZGZ.SCALE * 10;
        this.addChild(bg);

        this.tabLayer = new ExchangeTabLayer({lobbyId: args.lobbyId, callback: this.onTabChange, target: this});
        this.addChild(this.tabLayer, 9);
        this.layer = null;

        this.lobbyId = args.lobbyId;

        //add a keyboard event listener to statusLabel
        this.keyboardListener = cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
            },
            onKeyReleased: function (keyCode, event) {
                playEffect(audio_common.Button_Click);
                var target = event.getCurrentTarget();
                if (keyCode == cc.KEY.back) {
                    if (target.lobbyId != undefined) {
                        GameController.enterLobby(target.lobbyId);
                    }
                    else {
                        UniversalController.enterIndex();
                    }
                }

            }
        }, this);

    },

    onExit: function () {
        this._super();
        //console.log("  ExchangeScene onExit");
        cc.eventManager.removeListener(this.keyboardListener);
        FrameCache.removeSpriteFrames(res.common_plist);
        FrameCache.removeSpriteFrames(res.index_plist);
    },

    updateTime: function () {
        this.onTabChange(0);

    },

    onTabChange: function (index) {

        var self = this;
        if (this.selected == index) return;

        if (this.layer) {
            this.layer.removeFromParent(true);
            this.layer = null;
        }
        playEffect(audio_common.Button_Click);
        if (index == 0) {
            UniversalController.getExchangeList(function (data) {
                var layer = new ExchangeListLayer(data);
                self.addChild(layer);
                self.layer = layer;
            })
        }

        if (index == 1) {
            UniversalController.getMyExchangeRecordList(function (data) {
                var layer = new ExchangeRecordListLayer(data);
                self.addChild(layer);
                self.layer = layer;
            })
        }

        this.selected = index;
    }

});

var CustomTableViewCell = cc.TableViewCell.extend({
    draw: function (ctx) {
        this._super(ctx);
    }
});

var ExchangeListLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (args) {
        this._super();
        this.data = args;

        var winSize = cc.director.getWinSize();
        var visibleOrigin = cc.director.getVisibleOrigin();
        var visibleSize = cc.director.getVisibleSize();


        //
        var iconImage = "#mobile_pay.png";
        var icon = new cc.Sprite(iconImage);
        //icon.scale = 0.8;
        var iconSize = icon.getBoundingBox();

        var exchangeList = args.exchangeList;
        var cellH = iconSize.height + 10;
        var tabH = 120;

        //兑换说明
        var exchangeSummary = '兑换说明: 元宝只能通过任务或活动获得! 充值不能购买元宝!!';
        var exchangeSummaryLabel = new cc.LabelTTF(exchangeSummary, 'AmericanTypewriter', 22);
        exchangeSummaryLabel.setAnchorPoint(0, 0.5);
        exchangeSummaryLabel.color = {r: 0, g: 255, b: 127};
        exchangeSummaryLabel.x = 20;
        exchangeSummaryLabel.y = visibleOrigin.y + visibleSize.height - tabH + 28;
        this.addChild(exchangeSummaryLabel);

//init data
        this.m_pTableView = null;
        this.m_nTableWidth = visibleSize.width;
        this.m_nTableHeight = (cellH * exchangeList.length > (visibleSize.height - tabH)) ? (visibleSize.height - tabH) : (cellH * exchangeList.length);
        this.m_nCellWidth = visibleSize.width;
        this.m_nCelleHeight = cellH;
        this.m_nTableX = visibleOrigin.x;
        this.m_nTableY = visibleOrigin.y + visibleSize.height - tabH - this.m_nTableHeight;
        this.m_nCelleNum = exchangeList.length;

        this.init();

    },
    init: function () {
        this.m_pTableView = new cc.TableView(this, cc.size(this.m_nTableWidth, this.m_nTableHeight));
        this.m_pTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.m_pTableView.x = this.m_nTableX;
        this.m_pTableView.y = this.m_nTableY;
        this.m_pTableView.setDelegate(this);
        this.m_pTableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(this.m_pTableView);
        this.m_pTableView.reloadData();
    },

    scrollViewDidScroll: function (view) {
        //c.log("----->scrollViewDidScroll ");
    },
    scrollViewDidZoom: function (view) {
        //cc.log("----->scrollViewDidZoom ");
    },

    tableCellTouched: function (table, cell) {
        //cc.log("cell touched at index: " + cell.getIdx());
    },

    tableCellSizeForIndex: function (table, idx) {
        return cc.size(this.m_nCellWidth, this.m_nCelleHeight);
    },

    tableCellAtIndex: function (table, idx) {
        var self = this;
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new CustomTableViewCell();
        }
        cell.removeAllChildren(true);
        var exchangeList = this.data.exchangeList;
        var oneExchange = exchangeList[idx];

        var xx = 15;
//bg
        var bg = new cc.Scale9Sprite("bg_cell.png", cc.rect(70, 10, 10, 10));
        bg.width = this.m_nCellWidth;
        bg.height = this.m_nCelleHeight;
        bg.setPosition(this.m_nCellWidth / 2, this.m_nCelleHeight / 2);
        cell.addChild(bg);
        //图标
        var itemImageString = "#mobile_pay.png";

        //话费
        if (oneExchange.type == CommonConf.EXCHANGE.TYPE.INBOX_CALL) {

        }
        else if (oneExchange.type == CommonConf.EXCHANGE.TYPE.VIRTUAL) {
            if (oneExchange.icon == 'GIFT') {
                itemImageString = "#index_duihuan_icon.png";
            }
            else if (oneExchange.icon == 'TRUMPET') {
                itemImageString = "#common_icon_laba.png";
            }
            else if (oneExchange.icon == 'NOTE_CARD') {
                itemImageString = "#jipaiqi.png";
            }
        }
        //实物兑换
        else if (oneExchange.type == CommonConf.EXCHANGE.TYPE.OUTBOX) {
            //如果是实物兑换, icon是远程HTTP资源
            itemImageString = oneExchange.icon;
        }

        try {

            //本地资源和远程资源(后期实物兑换用远程资源), 这里有一个问题, 就是在tableCell没刷出来时候, 远程资源加载完会显示在可视区域,
            // 第一次点进来会出现问题, 后面就不会出现了. 或者第一次点进来, 来回刷刷..
            // 可能是loadImg的行为, 导致cell... 先这样带着bug来..
            if (itemImageString.indexOf("http://") == -1) {
                var icon = new cc.Sprite(itemImageString);
                icon.setPosition(xx, this.m_nCelleHeight / 2);
                icon.setAnchorPoint(0, 0.5);
                cell.addChild(icon);
            }
            else {

                utils.loadImgFromUrl(cell, itemImageString, cc.p(xx, self.m_nCelleHeight / 2), {x: 0, y: 0.5}, idx)

            }
        } catch (e) {
            //异常后 直接显示"X"logo
            var icon = new cc.Sprite("#dialog_close_btn.png");
            icon.setPosition(xx, this.m_nCelleHeight / 2);
            icon.setAnchorPoint(0, 0.5);
            cell.addChild(icon);
        }

        if (oneExchange.icon == 'GIFT') {
            icon.scale = 0.85;
        }
        else if (oneExchange.icon == 'TRUMPET') {
            icon.scale = 0.6;
        }
        else if (oneExchange.icon == 'NOTE_CARD') {
            icon.scale = 0.6;
        }

        xx = xx + 150;


        //物品名称
        var nameLabel = new cc.LabelTTF(oneExchange.name, "Arial", 24);
        nameLabel.color = cc.color.WHITE;
        nameLabel.setAnchorPoint(0, 0);
        nameLabel.setPosition(xx, this.m_nCelleHeight / 2);
        cell.addChild(nameLabel);

        //库存
        var inventoryLabel = new cc.LabelTTF("剩余" + oneExchange.inventory + "个", "Arial", 16);
        inventoryLabel.setPosition(xx, this.m_nCelleHeight / 2 - 30);
        inventoryLabel.color = cc.color.GREEN;
        inventoryLabel.setAnchorPoint(0, 0);
        cell.addChild(inventoryLabel);

        //元宝要求
        var ingotImage = new cc.Sprite("#yuanbaoIcon.png");
        ingotImage.setPosition(xx + 270, this.m_nCelleHeight / 2 + 10);
        ingotImage.setAnchorPoint(0, 0.5);
        ingotImage.scale = 0.6;
        cell.addChild(ingotImage);

        var ingotLabel = new cc.LabelTTF(oneExchange.fragment + "个元宝可兑换", "Arial", 16);
        ingotLabel.setPosition(xx + 270, this.m_nCelleHeight / 2 - 30);
        ingotLabel.setAnchorPoint(0, 0);
        ingotLabel.color = cc.color.RED;
        cell.addChild(ingotLabel);

        //
        var item = new cc.MenuItemImage("#common_btn_lv.png", "#common_btn_lan.png", this.onExchange, this);
        item.setPosition(this.m_nCellWidth - 30, this.m_nCelleHeight / 2);
        item.setAnchorPoint(1, 0.5);
        item.scale = ZGZ.SCALE * 0.7;
        item.tag = idx;
        var itemSize = item.getContentSize();

        var text = "赚取元宝";
        if (gPlayer.fragment >= oneExchange.fragment)
            text = "兑换";
        var textLabel = new cc.LabelTTF(text, "Arial", 26);
        textLabel.color = cc.color.WHITE;
        textLabel.setAnchorPoint(0.5, 0.5);
        textLabel.setPosition(itemSize.width / 2, itemSize.height / 2);
        item.addChild(textLabel);

        var menu = new cc.Menu(item);
        menu.setPosition(0, 0);
        cell.addChild(menu);

        return cell;
    },

    numberOfCellsInTableView: function (table) {
        return this.m_nCelleNum;
    },

    onExchange: function (sender) {

        playEffect(audio_common.Button_Click);

        var self = this;
        var tag = sender.tag;
        var exchangeList = this.data.exchangeList;
        var oneExchange = exchangeList[tag];

        //设置兑换物品信息
        this.exchangeId = oneExchange._id;

        if (gPlayer.fragment >= oneExchange.fragment) {

            //兑换虚拟消耗品
            if (oneExchange.type == CommonConf.EXCHANGE.TYPE.VIRTUAL) {

                this.doExchangeVirtual();
                return;
            }

            //弹框, 如果是话费, 输入手机号码; 如果是实物类, 输入地址, 联系人, 电话;
            if (oneExchange.type == CommonConf.EXCHANGE.TYPE.INBOX_CALL) {
                this.infoBox = new DialogSmall('填写信息', 2, {ensureCallback: this.doExchange}, this);

                var boxSize = this.infoBox.bg.getBoundingBox();

                var mobileLabel = new cc.LabelTTF("手机号:", "AmericanTypewriter", 26);
                mobileLabel.setPosition(boxSize.width / 2 - 20, boxSize.height / 2 + 350);
                mobileLabel.color = cc.color.WHITE;
                mobileLabel.scale = 2;
                this.infoBox.bg.addChild(mobileLabel);


                var blockSize = cc.size(370, 70);
                this.mobileValue = new cc.EditBox(blockSize, new cc.Scale9Sprite("common_shurukuang.png", cc.rect(14, 14, 25, 29)));
                this.mobileValue.setPlaceHolder('请输入手机号');
                this.mobileValue.setFontColor(cc.color.BLACK);
                this.mobileValue.setPosition(boxSize.width / 2 + 300, boxSize.height / 2 + 350);
                this.mobileValue.color = cc.color.WHITE;
                this.mobileValue.setMaxLength(11);
                this.infoBox.bg.addChild(this.mobileValue);


                this.mobileRechargeTipLabel = new cc.LabelTTF("温馨提示: \n操作失败情况通常原因是：该号码不存在" +
                    "\n或号码对应归属地的运营商系统正在结算或维护" +
                    "\n请稍等再试。通常月初月末或者每天晚上12点左右" +
                    "\n各地区运营商系统会进入1-2两小时的维护结算。", "Arial", 14);
                this.mobileRechargeTipLabel.color = {r: 0, g: 255, b: 127};
                this.mobileRechargeTipLabel.setPosition(boxSize.width / 2 + 220, boxSize.height / 2 + 80);
                this.infoBox.addChild(this.mobileRechargeTipLabel, 10);

                this.addChild(this.infoBox, 20);

            }

            else if (oneExchange.type == CommonConf.EXCHANGE.TYPE.OUTBOX) {
                this.infoBox = new DialogSmall('填写信息', 2, {ensureCallback: this.doExchangeOutbox}, this);

                var boxSize = this.infoBox.bg.getBoundingBox();

                var mobileLabel = new cc.LabelTTF("手机号:", "AmericanTypewriter", 26);
                mobileLabel.setPosition(boxSize.width / 2 - 20, boxSize.height / 2 + 350);
                mobileLabel.color = cc.color.WHITE;
                mobileLabel.scale = 2;
                this.infoBox.bg.addChild(mobileLabel);


                var blockSize = cc.size(370, 70);
                this.mobileValue = new cc.EditBox(blockSize, new cc.Scale9Sprite("common_shurukuang.png", cc.rect(14, 14, 25, 29)));
                this.mobileValue.setPlaceHolder('请输入手机号');
                this.mobileValue.setFontColor(cc.color.BLACK);
                this.mobileValue.setPosition(boxSize.width / 2 + 300, boxSize.height / 2 + 350);
                this.mobileValue.color = cc.color.WHITE;
                this.mobileValue.setMaxLength(11);
                this.infoBox.bg.addChild(this.mobileValue);

                //收货人
                var consigneeLabel = new cc.LabelTTF("收货人:", "AmericanTypewriter", 26);
                consigneeLabel.setPosition(boxSize.width / 2 - 20, boxSize.height / 2 + 250);
                consigneeLabel.color = cc.color.WHITE;
                consigneeLabel.scale = 2;
                this.infoBox.bg.addChild(consigneeLabel);


                var blockSize = cc.size(370, 70);
                this.consigneeValue = new cc.EditBox(blockSize, new cc.Scale9Sprite("common_shurukuang.png", cc.rect(14, 14, 25, 29)));
                this.consigneeValue.setPlaceHolder('请输入收货人');
                this.consigneeValue.setFontColor(cc.color.BLACK);
                this.consigneeValue.setPosition(boxSize.width / 2 + 300, boxSize.height / 2 + 250);
                this.consigneeValue.color = cc.color.WHITE;
                this.infoBox.bg.addChild(this.consigneeValue);

                //收货地址
                var deliveryAddressLabel = new cc.LabelTTF("收货地址:", "AmericanTypewriter", 26);
                deliveryAddressLabel.setPosition(boxSize.width / 2 - 20, boxSize.height / 2 + 150);
                deliveryAddressLabel.color = cc.color.WHITE;
                deliveryAddressLabel.scale = 2;
                this.infoBox.bg.addChild(deliveryAddressLabel);


                var blockSize = cc.size(370, 70);
                this.deliveryAddressValue = new cc.EditBox(blockSize, new cc.Scale9Sprite("common_shurukuang.png", cc.rect(14, 14, 25, 29)));
                this.deliveryAddressValue.setPlaceHolder('请输入收货地址');
                this.deliveryAddressValue.setFontColor(cc.color.BLACK);
                this.deliveryAddressValue.setPosition(boxSize.width / 2 + 300, boxSize.height / 2 + 150);
                this.deliveryAddressValue.color = cc.color.WHITE;
                this.infoBox.bg.addChild(this.deliveryAddressValue);


                this.outboxRechargeTipLabel = new cc.LabelTTF("温馨提示: 兑换后,客服在1-3个工作日与您联系");
                this.outboxRechargeTipLabel.color = {r: 0, g: 255, b: 127};
                this.outboxRechargeTipLabel.setPosition(boxSize.width / 2 + 220, boxSize.height / 2 + 30);
                this.infoBox.addChild(this.outboxRechargeTipLabel, 10);

                this.addChild(this.infoBox, 20);

            }

        } else {
            //去做任务
            UniversalController.enterIndex();
        }

    },

    validateMobile: function () {
        var mobile = this.mobileValue.getString();

        if (mobile == '') {
            prompt.fadeMiddle('请输入手机号');
            return false;
        }
        if (!utils.mobileValidate(mobile)) {
            prompt.fadeMiddle('您输入的手机号有误, 请检查');
            return false;
        }
        return true;
    },

    validateConsignee: function () {
        var consignee = this.consigneeValue.getString();

        if (consignee == '') {
            prompt.fadeMiddle('请输入收货人');
            return false;
        }
        return true;
    },

    validateDeliveryAddress: function () {
        var deliveryAddressValue = this.deliveryAddressValue.getString();

        if (deliveryAddressValue == '') {
            prompt.fadeMiddle('请输入收货地址');
            return false;
        }

        return true;
    },

    doExchangeVirtual: function () {
        var self = this;
        UniversalController.exchange(this.exchangeId, '', 1, '', '', function (data) {
            if (data.code == RETURN_CODE.OK) {
                prompt.fadeMiddle('兑换成功, 请您注意查收');

                //兑换结束后更新view
                var exchangeList = self.data.exchangeList;

                for (var i = 0; i < exchangeList.length; i++) {
                    var item = exchangeList[i];
                    if (item._id == self.exchangeId) {
                        //暂时客户端处理
                        item.inventory -= 1;
                        item.inventory = item.inventory < 0 ? 0 : item.inventory;
                        self.m_pTableView.reloadData();
                        break;
                    }
                }


            }
            else {
                prompt.fadeMiddle(ERR_MESSAGE.getMessage(data.err));
            }
        });
    },

    doExchange: function () {
        if (!this.validateMobile()) return;

        var self = this;

        var mobile = this.mobileValue.getString();

        UniversalController.exchange(this.exchangeId, mobile, 1, this.contact, this.address, function (data) {
            if (data.code == RETURN_CODE.OK) {
                prompt.fadeMiddle('兑换成功, 请您注意查收');
                if (self.infoBox) self.infoBox.removeFromParent(true);

                //兑换结束后更新view
                var exchangeList = self.data.exchangeList;

                for (var i = 0; i < exchangeList.length; i++) {
                    var item = exchangeList[i];
                    if (item._id == self.exchangeId) {
                        //暂时客户端处理
                        item.inventory -= 1;
                        item.inventory = item.inventory < 0 ? 0 : item.inventory;
                        self.m_pTableView.reloadData();
                        break;
                    }
                }


            }
            else {
                prompt.fadeMiddle(ERR_MESSAGE.getMessage(data.err));
            }
        });

    },

    doExchangeOutbox: function () {
        if (!this.validateMobile()) return;
        if (!this.validateConsignee()) return;
        if (!this.validateDeliveryAddress()) return;

        var self = this;

        var mobile = this.mobileValue.getString();
        var contact = this.consigneeValue.getString();
        var address = this.deliveryAddressValue.getString();

        UniversalController.exchange(this.exchangeId, mobile, 1, contact, address, function (data) {
            if (data.code == RETURN_CODE.OK) {
                prompt.fadeMiddle('兑换成功, 我们会尽快把物品送到');
                if (self.infoBox) self.infoBox.removeFromParent(true);

                //兑换结束后更新view
                var exchangeList = self.data.exchangeList;

                for (var i = 0; i < exchangeList.length; i++) {
                    var item = exchangeList[i];
                    if (item._id == self.exchangeId) {
                        //暂时客户端处理
                        item.inventory -= 1;
                        item.inventory = item.inventory < 0 ? 0 : item.inventory;
                        self.m_pTableView.reloadData();
                        break;
                    }
                }


            }
            else {
                prompt.fadeMiddle(ERR_MESSAGE.getMessage(data.err));
            }
        });

    },


    onEnter: function () {
        this._super();

    },

    onExit: function () {
        this._super();
    }
});


//////////////////////
// 兑换记录
//////////////////////
var ExchangeRecordListLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (args) {
        this._super();
        this.data = args;

        var winSize = cc.director.getWinSize();
        var visibleOrigin = cc.director.getVisibleOrigin();
        var visibleSize = cc.director.getVisibleSize();

//

        var exchangeRecordList = args.exchangeRecordList;
        var cellH = 40;
        var tabH = 100;
//init data
        this.m_pTableView = null;
        this.m_nTableWidth = visibleSize.width;
        this.m_nTableHeight = (cellH * exchangeRecordList.length > (visibleSize.height - tabH)) ? (visibleSize.height - tabH) : (cellH * exchangeRecordList.length);
        this.m_nCellWidth = visibleSize.width;
        this.m_nCelleHeight = cellH;
        this.m_nTableX = visibleOrigin.x;
        this.m_nTableY = visibleOrigin.y + visibleSize.height - tabH - this.m_nTableHeight;
        this.m_nCelleNum = exchangeRecordList.length;

        //添加列头
        var startX = winSize.width / 4;
        var halfX = startX / 2;
        var columnY = visibleOrigin.y + visibleSize.height - tabH;
        var exchangeDateLabel = new cc.LabelTTF("兑换时间", "Arial", 18);
        exchangeDateLabel.setAnchorPoint(0.5, 0);
        exchangeDateLabel.color = cc.color.GREEN;
        exchangeDateLabel.setPosition(startX - halfX, columnY);
        this.addChild(exchangeDateLabel, 1);
        var exchangeProductLabel = new cc.LabelTTF("兑换商品", "Arial", 18);
        exchangeProductLabel.setAnchorPoint(0.5, 0);
        exchangeProductLabel.color = cc.color.GREEN;
        exchangeProductLabel.setPosition(startX * 2 - halfX, columnY);
        this.addChild(exchangeProductLabel, 1);
        var exchangeNumberLabel = new cc.LabelTTF("兑换单号", "Arial", 18);
        exchangeNumberLabel.setAnchorPoint(0.5, 0);
        exchangeNumberLabel.color = cc.color.GREEN;
        exchangeNumberLabel.setPosition(startX * 3 - halfX, columnY);
        this.addChild(exchangeNumberLabel, 1);
        var exchangeStateLabel = new cc.LabelTTF("兑换状态", "Arial", 18);
        exchangeStateLabel.setAnchorPoint(0.5, 0);
        exchangeStateLabel.color = cc.color.GREEN;
        exchangeStateLabel.setPosition(startX * 4 - halfX, columnY);
        this.addChild(exchangeStateLabel, 1);


        this.init();

    },
    init: function () {
        this.m_pTableView = new cc.TableView(this, cc.size(this.m_nTableWidth, this.m_nTableHeight));
        this.m_pTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.m_pTableView.x = this.m_nTableX;
        this.m_pTableView.y = this.m_nTableY;
        this.m_pTableView.setDelegate(this);
        this.m_pTableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(this.m_pTableView);
        this.m_pTableView.reloadData();
    },

    scrollViewDidScroll: function (view) {
        //c.log("----->scrollViewDidScroll ");
    },
    scrollViewDidZoom: function (view) {
        //cc.log("----->scrollViewDidZoom ");
    },

    tableCellTouched: function (table, cell) {
        //cc.log("cell touched at index: " + cell.getIdx());
    },

    tableCellSizeForIndex: function (table, idx) {
        return cc.size(this.m_nCellWidth, this.m_nCelleHeight);
    },

    tableCellAtIndex: function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new CustomTableViewCell();
        }
        cell.removeAllChildren(true);
        var exchangeRecordList = this.data.exchangeRecordList;
        var oneExchangeRecord = exchangeRecordList[idx];

//bg
        var bg = new cc.Scale9Sprite("bg_cell.png", cc.rect(70, 10, 10, 10));
        bg.width = this.m_nCellWidth;
        bg.height = this.m_nCelleHeight;
        bg.setPosition(this.m_nCellWidth / 2, this.m_nCelleHeight / 2);
        cell.addChild(bg);


        //
        var xx = this.m_nTableWidth / 4;
        var halfX = xx / 2;

        //兑换时间
        var date = new Date(oneExchangeRecord.createdAt);
        var createdAtLabel = new cc.LabelTTF(date.format('yyyy-MM-dd hh:mm:ss'));
        createdAtLabel.setPosition(xx - halfX, this.m_nCelleHeight / 2);
        cell.addChild(createdAtLabel);

        //兑换商品
        var productLabel = new cc.LabelTTF(oneExchangeRecord.productName);
        productLabel.setPosition(xx * 2 - halfX, this.m_nCelleHeight / 2);
        cell.addChild(productLabel);

        //兑换单号
        var numberLabel = new cc.LabelTTF(oneExchangeRecord.number);
        numberLabel.setPosition(xx * 3 - halfX, this.m_nCelleHeight / 2);
        cell.addChild(numberLabel);

        //兑换状态
        var stateLabel = new cc.LabelTTF(utils.getOrderStateString(oneExchangeRecord.state));
        stateLabel.setPosition(xx * 4 - halfX, this.m_nCelleHeight / 2);
        cell.addChild(stateLabel);


        return cell;
    },

    numberOfCellsInTableView: function (table) {
        return this.m_nCelleNum;
    },
    onCallBack: function (sender) {

    },

    onEnter: function () {
        this._super();

    },

    onExit: function () {
        this._super();
    }
});


