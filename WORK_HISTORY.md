# 한눈에 미세먼지 (DustyWipe) - 작업 내역 및 연속성 가이드 (WORK_HISTORY.md)

이 문서는 대화 세션이 종료된 후 다른 대화 창이나 에이전트가 이 작업을 즉시 이어서 진행할 수 있도록 현재 진행 상황과 다음 단계를 정리한 로그입니다.

---

## 🛠️ 1. 현재 빌드 및 버전 정보

* **최신 앱 버전**: `versionCode 59`, `versionName "1.0.8"`
* **빌드 결과물**: 바탕화면(`~/Desktop/`)에 **`dusty-wipe-1.0.8-release.aab`** 및 **`mapping.txt`** 생성 완료 (R8 난독화 적용 및 versionCode 59로 재빌드 완료)
* **이전 빌드 보존**: 직전 빌드인 **`dusty-wipe-1.0.7-release.aab`**만 보존하고 나머지는 삭제 완료
* **최근 핵심 패치 사항**:
  - 포그라운드 서비스의 백그라운드 위치 권한(LOCATION) 동적 승급 로직 패치 (수동 새로고침 시 4초 타임아웃 및 종로구 롤백 버그 해결).
  - 로케일 무관 후보군(Candidate) 주소 지오코딩 해석 매핑 개편.
  - 안드로이드 네이티브 `StaticLayout` 및 `LeadingMarginSpan` 도입을 통해 뉴스 개행(Word wrapping) 및 들여쓰기(Indent) 정렬 디자인 완성도 극대화.
  - 동일한 대기질 데이터 수신 시 안개가 불필요하게 0%로 강제 초기화되던 오동작 수정.
  - 공공 API 통신 시 User-Agent 헤더 추가로 서버 차단 위험 방지.

---

## 📋 2. 스토어 심사 및 테스트 준비 현황

1. **구글 플레이 스토어 주소**:
   - 링크: https://play.google.com/store/apps/details?id=com.anonymous.dustywipe
2. **비공개 테스트 웹 참여 링크**:
   - 링크: https://play.google.com/apps/testing/com.anonymous.dustywipe
3. **테스터 피드백 취합 구글 시트 생성 완료**:
   - 공유 링크: https://docs.google.com/spreadsheets/d/1kwEsuWve5VqdvsuVImnHCzd7vt0ANBhJF07UHEk4N-A/edit
   - 형태: 상단 3개 행 예시 문구 포함 + 하단 1~20번 테스터용 공백 행 구성 완료.
4. **개인정보처리방침 문서 로컬 및 원격 업로드 완료**:
   - 경로: [/Users/tide/Projects/dusty-wipe/privacy_policy.md](file:///Users/tide/Projects/dusty-wipe/privacy_policy.md)
   - 공개 URL: https://raw.githubusercontent.com/chad0920kim/dusty-wipe/main/privacy_policy.md

---

## 🚀 3. 다음 단계 가이드 (Next Steps for Next Agent)

모든 필수적인 구글 플레이 콘솔 배포 및 설정이 **완료**되었습니다. 테스터 의견 수집과 피드백 취합 준비가 완료되었습니다.

1. **개인정보처리방침 깃허브 업로드 (완료)**
2. **구글 플레이 콘솔 대시보드 체크리스트 완성 (완료)**:
   - 개인정보처리방침 링크, 데이터 보안(Data Safety) 선언 및 백그라운드 위치/포그라운드 서비스 정당성 소명 완료.
3. **비공개 테스트 배포 및 웹 옵트인 주소 공유 (완료)**:
   - `versionCode 59` 기반의 빌드본(`dusty-wipe-1.0.8-release.aab` 및 난독화 매핑 파일 `mapping.txt`)이 정상 제출되어 심사 중 상태입니다.
   - 웹 옵트인 링크가 등록되어 테스터들과 공유할 준비를 마쳤습니다.
