# MOMO SERVER

### 🌊 당신의 감정 기록을 도와줄 작가의 감정 표현 '**MOMO**' 
<img src="https://user-images.githubusercontent.com/60434971/103637907-87ab4c00-4f8f-11eb-9007-43d4385e69ad.png" width="200" height="200"> <br>
* SOPT 27th APPJAM
* 2020.12.28 ~ 2021.01.16

<br>

## 📜프로젝트 설명
### 책 속의 문장을 제공함으로써, 보다 깊이 있는 감정 기록을 도와주는 일기 앱 서비스
<img src="https://user-images.githubusercontent.com/60434971/103638821-c8579500-4f90-11eb-9f73-a74c00150eeb.png" width="2000" height="450" > <br>

감정 카테고리를 선택하면, 감정과 어울리는 **3개의 문장**이 제공됩니다. 하나의 문장을 선택하여 그날의 일기를 기록하고, 2M에서 심해까지 **감정의 깊이**를 선택하여 저장합니다. 저장된 일기는 해당 깊이의 바다를 떠다니는 물방울이 됩니다.

사용자는 문장을 통해 **감수성을 자극**받으므로, 감정을 보다 섬세하고 구체적으로 기록할 수 있습니다. 따라서 평소에 일기를 쓰면서 **표현력**의 한계를 느꼈던 사람들에게 MOMO가 해결책이 되어줄 것입니다.
<br> <br>
## 📌핵심 기능

### ✔문장 추천
매일 매일 다른 3개의 문장을 감정별로 제공

### ✔일기 작성
문장을 선택하여 감정의 깊이가 담긴 일기를 기록

### ✔일기 조회
개별 일기 조회<br> 
**월간 일기 리스트** - **감정 깊이별 조회**, 날짜별 조회 제공<br>
월간 일기 통계 - 이번 달의 감정을 한 눈에 볼 수 있는 통계 제공 

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
    <th> 문장 추천 <br> 감정 조회 <br> 회원 관리 <br> 알림 </th>
    <th> 로그인<br> 회원가입<br> 비밀번호 찾기 </th>
  </tr>
</table>

</br>

## 🛠 ERD

<br>

## 🏛 Architecture

<br>


## ⚙ Dependencies
* sequelize : ORM 
* typescript : 타입 스크립트 
* crypto : 비밀번호 암호화 및 인증
* cross-env : 환경변수 
* @types/jsonwebtoken : Token 생성 및 인증
* @types/nodemailer : 이메일 발송

```

"dependencies": {
    "@types/cookie-parser": "^1.4.2",
    "@types/cors": "^2.8.9",
    "@types/http-errors": "^1.8.0",
    "@types/morgan": "^1.9.2",
    "body-parser": "^1.19.0",
    "cookie-parser": "~1.4.4",
    "cors": "^2.8.5",
    "debug": "~2.6.9",
    "dotenv": "^8.2.0",
    "errorhandler": "^1.5.1",
    "express": "^4.16.4",
    "express-validator": "^6.9.0",
    "http-errors": "~1.6.3",
    "jade": "~1.11.0",
    "jsonwebtoken": "^8.5.1",
    "morgan": "~1.9.1",
    "mysql2": "^2.2.5",
    "nodemailer": "^6.4.17",
    "rand-token": "^1.0.1",
    "sequelize": "^6.3.5",
    "swagger-cli": "^4.0.4",
    "swagger-ui-express": "^4.1.6"
  },
  "devDependencies": {
    "@types/errorhandler": "^1.5.0",
    "@types/express": "^4.17.9",
    "@types/jsonwebtoken": "^8.5.0",
    "@types/node": "^14.14.16",
    "@types/nodemailer": "^6.4.0",
    "@typescript-eslint/eslint-plugin": "^4.11.1",
    "@typescript-eslint/parser": "^4.11.1",
    "cross-env": "^7.0.3",
    "eslint": "^7.16.0",
    "eslint-config-airbnb-base": "^14.2.1",
    "eslint-config-prettier": "^7.1.0",
    "eslint-plugin-import": "^2.22.1",
    "eslint-plugin-prettier": "^3.3.0",
    "nodemon": "^2.0.6",
    "prettier": "2.2.1",
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
        res.status(200).json(authUtile~~~)
        
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

