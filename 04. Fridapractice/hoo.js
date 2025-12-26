Java.perform(function () {


    var targetMain = Java.use("com.eqst.lms.solution3.MainActivity");
    // 무결성 검증 메서드 우회
    targetMain.illl1lillil1iil1lilil1il.overload().implementation = function() {
        return "Fake String";
    };
    targetMain.checkusbdebug2.implementation = function() {
        return;
    };
    var targetSplash = Java.use("com.eqst.lms.solution3.SplashActivity");
    targetSplash.checkusbdebug.overload().implementation = function() {
        return;
    };


    var targetSplash = Java.use("com.eqst.lms.solution3.SplashActivity");
    targetSplash.checkusbdebug.overload().implementation = function() {
        return;
    };
    targetSplash.illillillil1iillillillil.overload().implementation = function() {
        console.log("원래의 True/False 값 : " + this.illillillil1iillillillil()); // 기존 False
        return true;
    };
    targetSplash.illillillil1iilllilil1il.overload().implementation = function() {
        console.log("원래의 True/False 값 : " + this.illillillil1iilllilil1il()); // 기존 False
        return true;
    };
    targetSplash.illillillilliillillillil.overload().implementation = function() {
        console.log("원래의 True/False 값 : " + this.illillillilliillillillil()); // 기존 False
        return true;
    };



    /* ========================================
    * 🛡️ CRITICAL: finish() 우회 - MainActivity만!
    * ======================================== */
    var Activity = Java.use("android.app.Activity");

    // finish() 차단: MainActivity에서만!
    Activity.finish.overload().implementation = function() {
        var name = this.getClass().getName();

        if (name.includes("MainActivity")) {
            console.log(`[+] 🚫 MainActivity.finish() BLOCKED!`);
            return; // MainActivity 종료 방지
        }
        return this.finish(); //기타는 정상 종료
    };
    // finish(int) 오버로드도 동일 로직
    Activity.finish.overload('int').implementation = function(reason) {
        if (this.getClass().getName().includes("MainActivity")) {
            console.log(`[+] 🚫 MainActivity.finish(${reason}) BLOCKED!`);
            return;
        }
        return this.finish(reason);
    };
    // 🔧 시스템 ADB 체크 우회 (백업)
    Java.use("android.provider.Settings$Global").getInt.overload('android.content.ContentResolver', 'java.lang.String')
        .implementation = function(resolver, name) {
        if (name.toLowerCase().includes("adb")) {
            console.log("[+] Global ADB bypassed");
            return 0;
        }
        return this.getInt(resolver, name);
    };

    console.log("[*] ✅ ALL BYPASSED! Splash→Main→FLAG SUCCESS!");
});