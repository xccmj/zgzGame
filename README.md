zgzGame
=======

基于cocos2d-js的游戏客户端（大同扎股子）

===
install：
拷贝cocos2d-js目录下frameworks目录和tools目录到程序根目录；

===
based on cocos2d-js v3.6.1


===
Native编译时候需要在project.json的jsList数组第一行添加
"src/pomelo-cocos2d-jsb/index.js",



===
# Android打包命令
cocos compile -p android --android-studio --app-abi armeabi:armeabi-v7a -m release
cocos compile -p android --android-studio --app-abi armeabi:armeabi-v7a -m debug