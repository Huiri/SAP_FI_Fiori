### git commit 규칙

|명령어|내용|
| :-----------------------------------: | :---------------------------------------: |
| CHORE | 빌드 업무 수정, 패키지 매니저 수정 |
| **ADD** |   코드나 테스트, 예제, 문서 등의 추가   |
| **FIX** | 올바르지 않은 동작을 고친 경우 |
| **REMOVE** |   코드의 삭제가 있을 때   |
| **UPDATE** |   문서나 리소스, 라이브러리등의 수정, 추가, 보완   |
| **FEAT** |  새로운 기능 추가   |
| **CORRECT** | 주로 문법의 오류나 타입의 변경, 이름 변경 등   |
| REFACTOR |   코드의 전면적인 수정   |
| DOCS |  문서의 개정   |
| RENAME | 파일의 이름 변경 |
| TEST | TEST 코드 관련   |


### 파일명 규칙 : 대문자 시작
|폴더|파일명|기능|
| :-----------------------------------: | :-----------------------------------: | :---------------------------------------: |
| Component/MasterCustomer|
| ./ | CustomerList | BP 고객 조회 view 및 Controller |
| ./ | CustomerDetail | BP 고객 상세 view 및 Controller |
| ./ | CreateCustomer | BP 고객 생성 view 및 Controller |
| ./Fragment | Nation | BP 국가/지역 Fragment |
| Component/MasterGLAccount|
| ./ | GLAccountList | BP 고객 조회 view 및 Controller |
| ./ | GLAccountDetail | BP 고객 상세 view 및 Controller |
| ./ | CreateGLAccount | BP 고객 생성 view 및 Controller |
| ./Fragment | CoA | 계정과목표 Fragment |
| ./Fragment | AccountGroup | AccountGroup Fragment |
| ./Fragment | BP | BP Fragment |

### 함수, 변수 이름 규칙
함수명 camelCase : 띄어쓰기 없이 단어는 대문자로 시작

ex) onBack(){}, createOrder(){}, navToCustomerList(){}
  
  - 이동함수 : to[Manifest 명]
  - 이벤트함수 : on으로 시작
  - 테이블 컬럼명 : 언더바 빼고 단어붙이기 , 대문자대문자
    ex) bp_name -> BpName
  - 상수를 제외한 변수 : 띄어쓰기 없이 첫글자 소문자, 두번째 단어는 대문자로 시작
    ex) indexedNum, countNum 등
  - 상수 : 대문자
    ex) CONSTNUM
    
