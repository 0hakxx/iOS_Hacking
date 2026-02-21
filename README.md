# 📱 iOS Hacking & Frida 학습 노트

> iOS 모바일 앱 보안 취약점 분석 및 동적 후킹 도구(Frida) 실습 기록  
> 인프런 iOS 해킹 강의 기반 학습 노트

---

## 📁 디렉토리 구조

```
iOS_Hacking/
├── 00. Jailbreak/               # 탈옥 도구 및 탈옥 방법
├── 01. Setting/                 # 환경 설정
├── 02. IPA추출/                 # IPA 파일 추출 방법
├── 03. Inflearn_iOSHacking/     # 인프런 iOS 해킹 강의 실습 노트 (메인)
└── 04. Fridapractice/           # Frida 도구 AOS 실습
```

---

## 📂 00. Jailbreak - 탈옥

iPhone 디바이스를 탈옥하여 분석 환경을 구축하는 방법을 다룹니다.

- **WinRa1n 탈옥** : Windows 환경에서 WinRa1n 도구를 사용한 탈옥 방법
- 탈옥 도구 스크린샷 포함 (JailBreakTool1~8)

---

## 📂 01. Setting - 환경 설정

iOS 앱 분석을 위한 개발 환경 설정을 다룹니다.

- Frida 설치 (Anaconda 가상환경 `ios_py3` 사용)
- 분석 툴체인 구성

---

## 📂 02. IPA추출 - IPA 파일 추출

탈옥 기기에서 앱의 IPA 파일을 추출하는 방법을 다룹니다.

---

## 📂 03. Inflearn_iOSHacking - 인프런 iOS 해킹 강의 실습

> 실습 대상 앱: **DVIA-v2** (Damn Vulnerable iOS App)

### 📑 목차

| No. | 주제 | 설명 |
|-----|------|------|
| 01 | [IPA 파일 구조](./03.%20Inflearn_iOSHacking/01.%20IPA%20파일%20구조.md) | IPA 파일 내부 구조 및 분석 방법 |
| 02 | [취약한 데이터 스토리지](./03.%20Inflearn_iOSHacking/02.%20취약한%20데이터%20스토리지.md) | 로컬 데이터 저장 취약점 분석 |
| 03 | [Jailbreak Detection](./03.%20Inflearn_iOSHacking/03.%20Jailbreak%20Detection.md) | 탈옥 탐지 우회 (Frida + Ghidra) |
| 04 | [Jailbreak Detection 2](./03.%20Inflearn_iOSHacking/04.%20Jailbreak%20Detection2.md) | 탈옥 탐지 우회 심화 |
| 05 | [AntiDebugging](./03.%20Inflearn_iOSHacking/05.%20AntiDebugging.md) | 안티 디버깅 우회 |
| 06 | [지나친 권한 부여](./03.%20Inflearn_iOSHacking/06.%20지나친%20권한%20부여.md) | 앱 권한 과부여 취약점 |
| 07 | [Runtime Manipulation](./03.%20Inflearn_iOSHacking/07.%20Runtime%20Manipulation.md) | 런타임 인증 우회 실습 |
| 08 | [Side Channel Data Leakage](./03.%20Inflearn_iOSHacking/08.%20Side%20Channel%20Data%20Leakage.md) | 사이드채널 데이터 유출 |
| 09 | [IPC Issues](./03.%20Inflearn_iOSHacking/09.%20IPC%20Issues.md) | IPC(프로세스 간 통신) 취약점 |
| 10 | [Network Layer Security](./03.%20Inflearn_iOSHacking/10.%20NetworkLayerSecurity.md) | 네트워크 계층 보안 취약점 |
| 11 | [WebView Issues](./03.%20Inflearn_iOSHacking/11.%20WebViewIssues.md) | WebView 취약점 |
| 12 | [Application Patching](./03.%20Inflearn_iOSHacking/12.%20Application%20Patching.md) | 앱 바이너리 패치 |
| 13 | [Sensitive Info in Memory](./03.%20Inflearn_iOSHacking/13.%20Sensitive%20Information%20in%20Memory.md) | 메모리 내 민감 정보 탐지 |
| 14 | [Touch/Face ID Bypass](./03.%20Inflearn_iOSHacking/14.%20TouchFace%20ID%20Bypass.md) | 생체 인증 우회 |
| 15 | [Frida-Trace](./03.%20Inflearn_iOSHacking/15.%20iOS%20클래스%20및%20메소드%20추적%20Frida-Trace.md) | frida-trace 를 이용한 클래스/메소드 추적 |

---

### 🔍 주요 실습 상세

#### 03. Jailbreak Detection - 탈옥 탐지 우회

탈옥 탐지 방식은 크게 **4가지 종류**가 있습니다.

**방법 1: Ghidra로 바이너리 분석 후 Frida 후킹 (문제 1)**
- Ghidra로 `DVIA-v2` 바이너리를 디컴파일하여 탈옥 탐지 로직 파악
- ASLR 적용으로 실행마다 베이스 주소가 변경됨
- 베이스 주소 + 오프셋으로 타겟 주소 계산
- `x0` 레지스터 값을 `0x0`으로 변경하여 우회

```js
const targetModule = Process.getModuleByName("DVIA-v2");
const realBase = targetModule.base;
const Jailbreak_address = realBase.add(0x171f5c);

Interceptor.attach(Jailbreak_address, {
    onEnter: function (args) {
        this.context.x0 = 0x0;
        console.log("x0 : " + this.context.x0);
    }
});
```

**방법 2: Frida ObjC API로 클래스/메소드 직접 후킹 (문제 2)**
- 메모리에서 `JailbreakDetection` ��래스 탐색
- `isJailbroken` 메소드 반환값을 `0x0(false)`으로 변경

```js
if(ObjC.available){
    var classname = "JailbreakDetection";
    var methodname = "isJailbroken";
    var hook = ObjC.classes[classname][methodname];

    Interceptor.attach(hook.implementation, {
        onLeave: function(retval) {
            var new_retval = ptr("0x0");
            retval.replace(new_retval);
            console.log("[+] 새 리턴 값: " + retval);
        }
    });
}
```

#### 07. Runtime Manipulation - 런타임 조작 (인증 우회)

- Ghidra로 인증 로직 분석
- Frida로 함수 후킹, x8 레지스터 값을 조작하여 Brute Force 인증 우회
- x8 레지스터가 8488에서 break되어 인증 성공

---

## 📂 04. Fridapractice - Frida AOS 실습

Android 환경에서 Frida를 활용한 모바일 앱 보안 실습을 다룹니다.

### 📑 목차

| No. | 주제 | 설명 |
|-----|------|------|
| 01 | [AOS Frida 기본 문법](./04.%20Fridapractice/01.%20AOS_Frida%20기본%20문법.md) | Frida 기본 문법 및 API 정리 |
| 02 | [AOS Frida LAB](./04.%20Fridapractice/02.%20AOS_Frida_LAB.md) | Frida 기본 문법 실습 LAB |
| 03 | [루팅 탐지 우회 (UnCrackable-Level1)](./04.%20Fridapractice/03.%20루팅%20탐지%20우회%20(UnCrackable-Level1.apk).md) | OWASP UnCrackable Level1 루팅 탐지 우회 |
| 04 | [Password 복호화 (UnCrackable-Level1)](./04.%20Fridapractice/04.%20Password%20복호화%20(UnCrackable-Level1.apk).md) | 암호화된 비밀번호 복호화 |
| 05 | [로그인 우회 (Sieve.apk)](./04.%20Fridapractice/05.%20로그인%20우회%20(Sieve.apk).md) | Sieve 앱 로그인 인증 우회 |
| 06 | [SSL Pinning 우회](./04.%20Fridapractice/06.%20SSL%20Pinning.md) | SSL Certificate Pinning 우회 |
| 07 | [라이브러리 후킹 (UnCrackable-Level2)](./04.%20Fridapractice/07.%20UncrackableLevel2(라이브러리%20후킹).md) | Native 라이브러리 함수 후킹 |
| 08 | [UnCrackable Level3](./04.%20Fridapractice/08.%20UncrackableLevel3.md) | 고급 앱 크래킹 실습 |

---

## 🛠️ 사용 도구

| 도구 | 용도 |
|------|------|
| **Frida** | 동적 후킹 및 런타임 조작 |
| **Ghidra** | iOS 바이너리 정적 분석 / 디컴파일 |
| **frida-trace** | iOS 클래스 및 메소드 자동 추적 |
| **Anaconda** | Frida 가상환경 관리 (`ios_py3`) |
| **WinRa1n** | Windows 환경 iPhone 탈옥 도구 |
| **DVIA-v2** | iOS 취약점 실습용 앱 (Damn Vulnerable iOS App) |

---

## 🚀 Frida 기본 사용법

```bash
# 가상환경 진입
conda activate ios_py3

# 실행 중인 앱 목록 확인
frida-ps -Ua

# 후킹 스크립트 실행
frida -U -l hook.js <앱이름>

# frida-trace로 메소드 추적
frida-trace -U -m "-[클래스명 메소드명]" <앱이름>
```

---

## 📚 참고 자료

- [Frida 공식 문서](https://frida.re/docs/javascript-api/)
- [Frida Scripts 모음](https://github.com/interference-security/frida-scripts/)
- [DVIA-v2 (실습 앱)](https://github.com/prateek147/DVIA-v2)
- [OWASP UnCrackable Apps](https://github.com/OWASP/owasp-mastg/tree/master/Crackmes)

---

## ⚠️ 면책 조항

이 저장소는 **교육 및 학습 목적**으로만 작성되었습니다.  
본 내용은 자신이 소유하거나 명시적 허가를 받은 시스템에서만 사용해야 하며,  
허가 없이 타인의 기기나 앱에 적용하는 것은 불법입니다.
