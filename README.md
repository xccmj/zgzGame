zgzGame
=======

基于cocos2d-js的游戏客户端（大同扎股子）

===
install：
拷贝cocos2d-js目录下frameworks目录和tools目录到程序根目录；

===
based on cocos2d-js v3.10


===
Native编译时候需要在project.json的jsList数组第一行添加
"src/pomelo-cocos2d-jsb/index.js",



===
# Android打包命令
cocos compile -p android --android-studio --app-abi armeabi:armeabi-v7a -m release
cocos compile -p android --android-studio --app-abi armeabi:armeabi-v7a -m debug



===
# 安卓发布流程
1、打包
2、上传到七牛cdn，apk名字规则为：豆面扎股子_v1.4.apk，如果发布1.5则只修改版本号即可
3、修改zgz-web/assets/js/appView.js的变量: targetUrl，只修改版本号即可；并更新到服务器





## 适配IPv6
因工程基于cocos2d-js v3.10, 导致默认不支持IPv6
下载cocos2d最新第三方库:[https://github.com/cocos2d/cocos2d-x-3rd-party-libs-bin/releases] 当前为v107
把工程里framework/cocos2d-x/external/下的curl和websocket替换为第三方库的版本.
然后注释: cocos2d-x/blob/v3/cocos/network/WebSocket.cpp 598行 // info.extensions = exts;
编译运行即可.
当前(2016.7.29)最新第三方库的websocket有bug,[http://forum.cocos.com/t/websocket/38447],需要关注社区尽快解决.





-------------------------------

## framework/runtime-src
Classes里存放第三方的C++和自定义的C++
proj.ios_mac下面的lib是存放ping++sdk的