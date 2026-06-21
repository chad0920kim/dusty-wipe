# 한눈에 미세먼지 (DustyWipe) - 작업 내역 및 연속성 가이드 (WORK_HISTORY.md)

이 문서는 대화 세션이 종료된 후 다른 대화 창이나 에이전트가 이 작업을 즉시 이어서 진행할 수 있도록 현재 진행 상황과 다음 단계를 정리한 로그입니다.

---

## 🛠️ 1. 현재 빌드 및 버전 정보

* **최신 앱 버전**: `versionCode 56`, `versionName "1.0.8"`
* **빌드 결과물**: 바탕화면(`~/Desktop/`)에 **`dusty-wipe-1.0.8-release.aab`** 생성 및 배포 완료
* **이전 빌드 보존**: 직전 빌드인 **`dusty-wipe-1.0.7-release.aab`**만 보존하고 나머지는 삭제 완료
* **최근 핵심 패치 사항**:
  - 포그라운드 서비스의 백그라운드 위치 권한(LOCATION) 동적 승급 로직 패치 (수동 새로고침 시 4초 타임아웃 및 종로구 롤백 버그 해결).
  - 로케일 무관 후보군(Candidate) 주소 지오코딩 해석 매핑 개편.
  - 안드로이드 네이티브 `StaticLayout` 및 `LeadingMarginSpan` 도입을 통해 뉴스 개행(Word wrapping) 및 들여쓰기(Indent) 정렬 디자인 완성도 극대화.
  - 동일한 대기질 데이터 수신 시 안개가 불필요하게 0%로 강제 초기화되던 오동작 수정.
  - 공공 API 통신 시 User-Agent 헤더 추가로 서버 차단 위험 방지.

---

## 📋 2. 스토어 심사 및 테스트 준비 현황

1. **테스터 피드백 취합 구글 시트 생성 완료**:
   - 공유 링크: https://docs.google.com/spreadsheets/d/1kwEsuWve5VqdvsuVImnHCzd7vt0ANBhJF07UHEk4N-A/edit
   - 형태: 상단 3개 행 예시 문구 포함 + 하단 1~20번 테스터용 공백 행 구성 완료.
2. **개인정보처리방침 문서 로컬 생성 완료**:
   - 경로: [/Users/tide/Projects/dusty-wipe/privacy_policy.md](file:///Users/tide/Projects/dusty-wipe/privacy_policy.md)
3. **깃허브 제어 토큰 환경변수 등록 완료**:
   - 경로: [/Users/tide/Projects/dusty-wipe/.env](file:///Users/tide/Projects/dusty-wipe/.env) 내 `GITHUB_TOKEN` 변수에 PAT 저장 완료.

---

## 🚀 3. 다음 단계 가이드 (Next Steps for Next Agent)

다음 세션에서 작업을 시작하는 에이전트는 아래 순서로 작업을 이어서 진행해 주십시오.

1. **개인정보처리방침 깃허브 업로드 (완료)**:
   - `dusty-wipe/.env`에 기입된 `GITHUB_TOKEN`을 사용하여 원격 깃허브 저장소(`chad0920kim/dusty-wipe`)를 새로 생성 및 연결 완료했습니다.
   - `privacy_policy.md`를 포함한 프로젝트 소스를 커밋하고 푸시를 완료했습니다.
   - 개인정보처리방침 공개 URL: https://raw.githubusercontent.com/chad0920kim/dusty-wipe/main/privacy_policy.md
2. **구글 플레이 콘솔 대시보드 체크리스트 완성**:
   - 획득한 개인정보처리방침 깃허브 URL(`https://raw.githubusercontent.com/chad0920kim/dusty-wipe/main/privacy_policy.md`)을 플레이 콘솔의 개인정보처리방침 필드에 입력합니다.
   - 프로젝트 내 `brain/.../play_store_registration.md` 파일에 기록된 데이터 보안(Data Safety) 선언 가이드, 위치 권한 사유 등을 참조하여 구글 설문 체크리스트를 최종 클리어합니다.
3. **비공개 테스트 배포 및 웹 옵트인 주소 공유**:
   - 빌드된 `dusty-wipe-1.0.8-release.aab`를 비공개 테스트 트랙에 출시 제출합니다.
   - 구글 그룹스를 구성하고, 비공개 테스트 테스터 탭 하단에서 **웹 옵트인 링크**를 추출하여 테스터들과 공유할 수 있도록 사용자에게 전달합니다.
