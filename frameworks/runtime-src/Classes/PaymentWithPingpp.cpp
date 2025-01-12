#include "PaymentWithPingpp.h"

#include "cocos2d_specifics.hpp"
#include "SDKBoxJSHelper.h"
#include "sdkbox/sdkbox.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include <jni.h>
#include "platform/android/jni/JniHelper.h"
#include <cocos2d.h>
#endif


#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)


bool jsb_payment(JSContext *cx, uint32_t argc, jsval *vp) {


    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    if (argc == 1) {
        std::string arg0;

        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_payment_pingpp : Error processing arguments");
        
        
        //
        cocos2d::JniMethodInfo methodInfo;
        
        
        bool isExsit = cocos2d::JniHelper::getStaticMethodInfo(methodInfo, "org/cocos2dx/javascript/AppActivity", "getCurrentActivity", "()Ljava/lang/Object;");

        if (isExsit)
        {
            
            jobject jobj = methodInfo.env->CallStaticObjectMethod(methodInfo.classID, methodInfo.methodID);
            
            bool isPaymentExsit = cocos2d::JniHelper::getMethodInfo(methodInfo, "org/cocos2dx/javascript/AppActivity", "doPayment", "(Ljava/lang/String;)V");
            
            if (isPaymentExsit)
            {
                jstring jmsg = methodInfo.env->NewStringUTF(arg0.c_str());
                
                methodInfo.env->CallVoidMethod(jobj, methodInfo.methodID, jmsg);

            }

            
            methodInfo.env->DeleteLocalRef(methodInfo.classID);
        }
        
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "js_payment_pingpp : wrong number of arguments");
    return false;
}

#elif (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC)

bool jsb_payment(JSContext *cx, uint32_t argc, jsval *vp) {
    return true;
}

#endif


void register_jsb_payment_pingpp(JSContext* cx, JS::HandleObject global) {
    JS::RootedObject pluginObj(cx);
    sdkbox::getJsObjOrCreat(cx, global, "payment.pingpp", &pluginObj);

    JS_DefineFunction(cx, pluginObj, "doPayment", jsb_payment, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    
}