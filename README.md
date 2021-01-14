# MOMO-SERVER

### 🌊 책 속의 문장을 제공함으로써, 보다 깊이 있는 감정 기록을 도와주는 일기 앱 서비스 '**MOMO**'

<img src="https://user-images.githubusercontent.com/60434971/103637907-87ab4c00-4f8f-11eb-9007-43d4385e69ad.png" width="200" height="200"> <br>

* SOPT 27th APPJAM
* 2020.12.28 ~ 2021.01.16

<br>

## 📜프로젝트 설명
<img src="https://user-images.githubusercontent.com/60434971/104602472-cb543300-56be-11eb-9b25-f73bcf9a53d8.png" height="600" > <br>

### MOMO는 책 속의 문장과 일기를 결합하여 '보다 쉬운 감정 기록'을 도와주는 일기 앱서비스 입니다. <br>
오늘의 감정을 선택하면, ✨**매일 3개씩 새로운 문장**이 제공됩니다. <br>
마음의 드는 문장을 선택하고 ✏**오늘의 감정을 기록**해보세요. <br>
문장이 감수성을 자극해서 평소보다 훨씬 쉽게 감정을 기록할 수 있을 거예요. <br>
🐳 **깊어진 감정을 바다의 깊이로 표현**해서 나만의 바다를 만들어보세요.<br>

<br>

## 🎢 Workflow
워크플로우를 보려면 👇 아래를 클릭하세요
### 🔗 [MOMO workflow](https://github.com/Team-MoMo/MoMo-Server/blob/feat/docs/src/docs/momo_workflow.pdf)

<br> <br>

## 📌핵심 기능

<img src="https://user-images.githubusercontent.com/60434971/104631203-488fa000-56df-11eb-9b8e-56c8d73a2edb.png" height="400" >

### ✔문장 추천
"오늘의 감정은 어땠나요?"<br>
"마음에 파동이 이는 문장을 만나보세요."<br>
✨**유저별로 매일 매일 색다른 3개의 문장을 감정별로 제공**<br><br>

### ✔일기 작성

"감정이 얼마나 깊은가요?<br>
나만의 바다에 기록해보세요"<br>
✏**작가의 감정표현을 빌려 깊이가 담긴 일기를 기록** <br><br>

### ✔일기 조회

'2M,30M..700M...그리고 1005M'<br>
"한달간의 감정을 바다 깊숙히 유영하며 느껴보세요"<br>
**🐳 월간 일기 리스트** - **깊이별 조회 (일기 물방울 랜덤 배치)** <br><br>

월간 일기 리스트 - 날짜별/필터별 조회 제공<br>
월간 일기 통계 - 한달간 감정을 한 눈에 볼 수 있는 통계 제공  <br>
개별 일기 조회<br>

<br>

## 👨‍👧‍👧 Developer & Role

<table style="text-align: center;">
   <tr>
    <td><img src="https://user-images.githubusercontent.com/60434971/103637487-e7552780-4f8e-11eb-8f2d-229fe6cdf165.jpg" width="200" height="180"></th>
    <td><img src="https://user-images.githubusercontent.com/60434971/103643562-41a6b600-4f98-11eb-975c-eb13f53360b0.jpg" width="200" height="180"></th>
    <td><img src="https://user-images.githubusercontent.com/60434971/103643834-ad891e80-4f98-11eb-9730-0bfa0bbafbdb.jpg" width="200" height="180"></th>
  </tr>
  <tr>
    <th>강영우</th>
    <th>석영현</th>
    <th>김채원</th>
  </tr>
  <tr>
    <th><a href="https://github.com/rdd9223">🏚YeongWoooo</a></th>
    <th><a href="https://github.com/yeonghyeonSeok">🏠yeonghyeonSeok</a></th>
    <th><a href="https://github.com/chaeppy">🏡chaeppy</a></th>
  </tr>
    <tr>
    <th> 일기 작성<br> 일기 조회<br> 일기 통계<br> 개발환경 설정 </th>
    <th> 문장 추천 <br> 문장등록 <br>감정 조회 <br> 회원 관리 <br> 알림 </th>
    <th> 로그인<br> 회원가입<br> 비밀번호 찾기 </th>
  </tr>
</table>

</br>

## 🛠 ERD

<img src="https://user-images.githubusercontent.com/60434971/104465337-4b16ca80-55f7-11eb-92bd-17567861e092.png" height="550">

<br>

## 🏛 Architecture
<img src="https://user-images.githubusercontent.com/60434971/104630231-dff3f380-56dd-11eb-8378-f618d5d6d467.JPG" height="500">

<br>


## ⚙ Dependencies
* `typescript` - 타입스크립트 지원 모듈
* `ts-node` - typescript node서버 구동
* `nodemon` - 코드 수정시 자동 재시작 도구
* `swagger` : Api Docs
* `sequelize` : ORM
* `cross-env` : 환경 변수
* `jsonwebtoken` : Token 생성 및 인증
* `yup` : 입력 검증
* `crypto` : 비밀번호 암호화 및 인증
* `dayjs`: 날짜/시간
* `axios` : http 통신
* `node-schedule` : 스케쥴러
* `nodemailer` : 이메일 발송
* `google-auth-library` : 구글로그인
* `prettier` - 코드 포멧터
* `eslint` - 문법 정적분석 도구
* `jest` : 테스트 
* `supertest` - 통합테스트 모듈

```

 "dependencies": {
    "@types/cookie-parser": "^1.4.2",
    "@types/cors": "^2.8.9",
    "@types/http-errors": "^1.8.0",
    "@types/morgan": "^1.9.2",
    "@types/yup": "^0.29.11",
    "axios": "^0.21.1",
    "body-parser": "^1.19.0",
    "cookie-parser": "~1.4.4",
    "cors": "^2.8.5",
    "dayjs": "^1.10.1",
    "debug": "~2.6.9",
    "dotenv": "^8.2.0",
    "errorhandler": "^1.5.1",
    "express": "^4.16.4",
    "google-auth-library": "^6.1.3",
    "http-errors": "~1.6.3",
    "jade": "~1.11.0",
    "jsonwebtoken": "^8.5.1",
    "morgan": "~1.9.1",
    "mysql2": "^2.2.5",
    "node-schedule": "^1.3.2",
    "nodemailer": "^6.4.17",
    "rand-token": "^1.0.1",
    "sequelize": "^5.22.0",
    "sequelize-cli": "^6.2.0",
    "swagger-cli": "^4.0.4",
    "swagger-jsdoc": "^6.0.0",
    "swagger-ui-express": "^4.1.6",
    "yamljs": "^0.3.0",
    "yup": "^0.32.8"
  },
  "devDependencies": {
    "@types/errorhandler": "^1.5.0",
    "@types/express": "^4.17.9",
    "@types/jest": "^26.0.20",
    "@types/jsonwebtoken": "^8.5.0",
    "@types/node": "^14.14.16",
    "@types/node-schedule": "^1.3.1",
    "@types/nodemailer": "^6.4.0",
    "@types/supertest": "^2.0.10",
    "@types/swagger-ui-express": "^4.1.2",
    "@types/yamljs": "^0.2.31",
    "@typescript-eslint/eslint-plugin": "^4.11.1",
    "@typescript-eslint/parser": "^4.11.1",
    "cross-env": "^7.0.3",
    "eslint": "^7.16.0",
    "eslint-config-airbnb-base": "^14.2.1",
    "eslint-config-prettier": "^7.1.0",
    "eslint-plugin-import": "^2.22.1",
    "eslint-plugin-prettier": "^3.3.0",
    "jest": "^26.6.3",
    "nodemon": "^2.0.6",
    "prettier": "2.2.1",
    "supertest": "^6.0.1",
    "ts-jest": "^26.4.4",
    "ts-node": "^9.1.1",
    "typescript": "^4.1.3"
  }
  
```

<br>

## 🙏 Rule

### 1️⃣ Code convention

1. 변수명: camel case
2. fommating: prettier
3. lint: eslint
4. airbnb 형식 사용- 세미콜론, 탭: 2
6. async await 사용
7. 파일명

    - snake case
    - 폴더명: 복수형
    - controller의 경우 (라우터명)s_controller.js
    - 메소드에 라우터명 붙이지 않기
    - 각 폴더에 인덱스 넣기
8. 변수명

    - camel case
    - 배열: List
    - 데이터를 담는 변수: 동사 포함 금지
    - 함수: 동사가 제일 앞에 위치
    - 메소드: READ(찾기) CREATE(만들기) UPDATE(수정하기) DELETE(삭제하기)
    - 통신 API 응답을 위한 변수: data로 통일

        ```jsx
        {
         message: "",
         data: {},
        }
        res.status(200).json(resJsone~~~)
        
        ```

<br>

### 2️⃣ Git

1. 브랜치 중심 운영
    - master - 배포용
    - develop - 테스트용
    - feat/ - 새로운 기능 개발
    - fix/ - 오류가 난 기능 수정

2. **커밋 메세지**
    - Feat: 새기능
    - Refactor: 원래있던 코드의 수정(기능 변경O)
    - Style: 원래있던 코드의 수정(기능 변경X)
    - Docs: 문서변경
    - Fix: 오류 수정
    - Etc: 애매한거
    - 한글로 커밋
    - 커밋은 이해하기 편한 단위로 잘게 쪼개기

3. 머지 규칙
    - Pull request
    - 작성자 외 1명 이상이 리뷰(develop),  
    - squash and merge 사용

4. 브랜치 시나리오
    - 새 기능 개발
        - master, develop (branch따기) → feat/users(개발완료) → develop 머지(develop 문제 없음) → master로 머지
    - 오류 발생
        - master (branch따기) → fix/users(수정완료) → develop 머지(develop 문제 없음) → master머지

<br>

### 3️⃣ Communication

* Gather Town
* Slack
* Notion
* GitHub - Issue & Projects
* Zoom
