
### 1. frida가 설치된 상태에서 아래 frida-ios-dump 파일을 다운받은 후, 압축 해제한다.

https://github.com/AloneMonkey/frida-ios-dump

![img.png](img.png)

### 2. Frida 및 Anaconda 설치하는 과정을 했다면, 가상 환경 생성되어 있을 것이다. 생성된 가상환경 list를 확인한다.


```shell
(base) C:\Users\ >conda env list
```

출력 결과 
```terminaloutput
# conda environments:
#
base                  *  C:\Users\ \anaconda3
frida16111               C:\Users\ \anaconda3\envs\frida16111
```

### 3. 생성한 가상환경으로 접속한다.

```shell
(base) C:\Users\>conda activate frida16111
```

### 4. 압축 해제한 firda-ios-dump 파일에 접근한다.

```shell
(frida16111) C:\Users\>cd D: 01. IOS\02. firda-ios-dump-master
```

### 5. pip3 install 명령어를 이용하여 requirement.txt. 파일을 설치한다.
```shell
(frida16111) D: 01. IOS\02. firda-ios-dump-master>pip3 install -r requirements.txt
```
출력 결과
```terminaloutput
Collecting asn1crypto (from -r requirements.txt (line 1))
  Using cached asn1crypto-1.5.1-py2.py3-none-any.whl.metadata (13 kB)
Collecting bcrypt (from -r requirements.txt (line 2))
  Downloading bcrypt-4.2.1-cp39-abi3-win_amd64.whl.metadata (10 kB)
Collecting cffi (from -r requirements.txt (line 3))
				.....중략.....
Downloading cryptography-44.0.0-cp39-abi3-win_amd64.whl (3.2 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 3.2/3.2 MB 2.9 MB/s eta 0:00:00
Using cached enum34-1.1.10-py3-none-any.whl (11 kB)
				.....중략.....
Downloading pygments-2.18.0-py3-none-any.whl (1.2 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 1.2/1.2 MB 2.2 MB/s eta 0:00:00
   				.....이하생략.....
```


### 6. frida-ios-dump 폴더 내 dump.py 파일을 아래 사진과 같이 수정한다.

![img_1.png](img_1.png)
dump.py 파일 확인

![img_2.png](img_2.png)
dumpy.py 수정

### 7. gow를 다운로드 후 PC에 설치한다.

-  gow는 윈도우에서 리눅스 명령어를 사용할 수 있도록 해준다.

https://github.com/bmatzelle/gow/releases

![img_3.png](img_3.png)

### 8. firda를 이용해 추출할 앱 패키지 명을 확인한다.

```shell
(frida16111) C:\Users\rhcsu>frida-ps -Uai
```

```terminaloutput
  PID  Name       Identifier
-----  ---------  -------------------------------
31822  App Store  com.apple.AppStore
25083  Filza      com.tigisoftware.Filza
 7523  NewTerm    ws.hbang.Terminal
31821  Safari     com.apple.mobilesafari
29772  Sileo      org.coolstar.SileoStore
 1886  Terminal   com.officialscheduler.mterminal
25515  Zebra      xyz.willy.Zebra
 4624  palera1n   com.samiiau.loader
41086  *******       co.kr.*******.app # 추출할 앱 확인
```

### 9. 추출할 어플을 실행 시킨 후, 아래의 명령어를 이용해서 IPA 추출 시도한다.

```shell
(frida16111) D: 01. IOS\ 02. firda-ios-dump-master>python dump.py "co.kr.*******.app"
```

```terminaloutput
CryptographyDeprecationWarning: Python 3.7 is no longer supported by the Python core team and support for it is deprecated in cryptography. A future release of cryptography will remove support for Python 3.7.
  from cryptography.hazmat.backends import default_backend
Start the target app co.kr.*******.app
Dumping ******* to C:\Users\AppData\Local\Temp
[frida-ios-dump]: SafetokenPattern.framework has been loaded.
[frida-ios-dump]: Safetoken.framework has been loaded.
[frida-ios-dump]: SafetokenBiometric.framework has been loaded.
[frida-ios-dump]: SASLibrary.framework has been loaded.
start dump /private/var/containers/Bundle/Application/89C70437-FE98-4C19-88F3-B627A2ED5ADA/*******_IOS.app/_IOS
_IOS.fid: 100%|█████████████████████████████████████████████████████████| 9.79M/9.79M [00:01<00:00, 6.50MB/s]
start dump
					.....중략.....
                    module_test.js: 22.0MB [00:07, 3.16MB/s]
0.00B [00:00, ?B/s]Generating "*******.ipa" # 추출 완료
```

### 10. 다음과 같이 frida-ios-dump 폴더 내 IPA가 추출된 것을 볼 수 있다.
![img_4.png](img_4.png)


> 번외 1. 엑세스가 거부되었습니다.


IPA 추출하는 과정에서 다음과 같이 '엑세스가 거부되었습니다.'라는 오류가 발생될 경우, 본문 '7. gow를 다운로드 후  PC에 설치한다.'를 참고하면 된다.

```shell
(frida16111) D: 01. IOS 02. firda-ios-dump-master>python dump.py "co.kr.*******.app"
```

```terminaloutput
C:\Users \anaconda3\envs\frida\lib\site-packages\paramiko\transport.py:32: 
CryptographyDeprecationWarning: Python 3.7 is no longer supported by the 
Python core team and support for it is deprecated in cryptography. A future release 
of cryptography will remove support for Python 3.7.
  from cryptography.hazmat.backends import default_backend
*** Caught exception: <class 'PermissionError'>: [WinError 5] 액세스가 거부되었습니다:
 'C:\\Users\\AppData\\Local\\Temp\\Payload\\Safetoken.fid'
Traceback (most recent call last):
  File "dump.py", line 336, in <module>
    create_dir(PAYLOAD_PATH)
  File "dump.py", line 246, in create_dir
    shutil.rmtree(path)
  File "C:\Users\anaconda3\envs\frida\lib\shutil.py", line 513, in rmtree
    return _rmtree_unsafe(path, onerror)
  File "C:\Users\anaconda3\envs\frida\lib\shutil.py", line 397, in _rmtree_unsafe
    onerror(os.unlink, fullname, sys.exc_info())
  File "C:\Users\anaconda3\envs\frida\lib\shutil.py", line 395, in _rmtree_unsafe
    os.unlink(fullname)
PermissionError: [WinError 5] 액세스가 거부되었습니다: 'C:\\Users\ \\AppData\\Local\\
Temp\\Payload\\Safetoken.fid'
Traceback (most recent call last):
  File "dump.py", line 360, in <module>
    shutil.rmtree(PAYLOAD_PATH)
  File "C:\Users \anaconda3\envs\frida\lib\shutil.py", line 513, in rmtree
    return _rmtree_unsafe(path, onerror)
  File "C:\Users \anaconda3\envs\frida\lib\shutil.py", line 397, in _rmtree_unsafe
    onerror(os.unlink, fullname, sys.exc_info())
  File "C:\Users \anaconda3\envs\frida\lib\shutil.py", line 395, in _rmtree_unsafe
    os.unlink(fullname)
PermissionError: [WinError 5] 액세스가 거부되었습니다: 'C:\\Users\ \\AppData\\Local\\Temp\\
Payload\\Safetoken.fid'
```