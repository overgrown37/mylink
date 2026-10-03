# [PRD] 멀티 링크 서비스 '마이링크 (MyLink)' 제품 기능 정의서

---

| 문서 버전 | v1.6.0 (Tailwind CSS 스타일링 표준 단일화) | 작성일자 | 2026-10-03 |
| :--- | :--- | :--- | :--- |
| **제품명** | 마이링크 (MyLink) | **형태** | Web SaaS (링크트리 클론 서비스) |
| **기술 기반** | Next.js (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Zustand | **데이터 저장소** | Mock Data & 브라우저 LocalStorage (Zustand Persist) |
| **개발 전략** | 단계별 점진적 학습 개발 (Phase 1: 프로필 페이지 집중) | **UI/디자인 시스템** | shadcn/ui + `design.md` 비주얼 가이드라인 |
| **스타일 표준** | Tailwind CSS 100% 단일화 (CSS 모듈 배제) | **참조 디자인 문서** | [`design.md`](file:///c:/Users/anqh3/Documents/Vide_Coding_Projects/mylink/design.md) (디스코드 마케팅 무드 비주얼 가이드) |
| **문서 상태** | 확정 (Approved) | | |

---

## 1. 프로젝트 개요 및 배경

### 1.1 개요
**'마이링크(MyLink)'**는 크리에이터, 개발자, 프리랜서 등 개인 브랜딩이 필요한 모든 사용자가 자신의 다양한 소셜 채널, 포트폴리오, 프로젝트 링크를 단 하나의 URL에 모아 공유할 수 있는 링크트리(Linktree) 클론 서비스입니다.

### 1.2 개발 목적 및 단계별 학습 전략
- **점진적 학습 지향**: 복잡한 시스템을 한 번에 구축하지 않고, **로컬 스토리지를 활용한 프로필 페이지 렌더링(Phase 1)**부터 시작하여 대시보드(Phase 2), 인증(Phase 3)으로 단계적으로 기능을 확장합니다.
- **원링크(One-Link) 핵심 가치 검증**: 링크트리의 가장 본질적인 기능인 '프로필 및 링크 목록의 시각적 노출'을 우선 완성합니다.
- **인프라 제로 부담**: 서버 데이터베이스 없이 브라우저 LocalStorage와 Zustand를 통해 순수 클라이언트 환경에서 상태 관리와 영속성을 완벽히 학습 및 구현합니다.

---

## 2. 단계별 개발 로드맵 (Phased Learning Roadmap)

```
[ Phase 1 : 현재 집중 단계 ]
 └── 로컬스토리지 기반 프로필 페이지 구현
     - Zustand + LocalStorage 스토어 연동
     - 프로필 정보 (아바타, 이름, 바이오)
     - 소셜 아이콘 바 & 링크/섹션 목록 렌더링
     - 5가지 프리셋 테마 지원
     ※ 대시보드, 통계, 인증은 Phase 1에서 제외

[ Phase 2 : 차기 단계 ]
 └── 리스트형 대시보드 (/dashboard)
     - 링크 추가 / 수정 / 삭제
     - 링크 위/아래 순서 변경
     - 프로필 및 테마 선택 UI

[ Phase 3 : 확장 단계 ]
 └── 회원가입 / 로그인 인증 & 멀티유저 라우팅
     - 이메일/비밀번호 가입 및 세션 관리
     - 동적 핸들 라우팅 (/[username])

[ Phase 4 : 심화 단계 ]
 └── 통계(Analytics) 및 미디어 임베드
```

---

## 3. 사용자 시나리오 (User Scenarios)

본 서비스의 주요 사용자와 학습 흐름을 고려한 3가지 핵심 사용자 여정(User Journey)입니다.

### 시나리오 A: 방문자가 SNS 링크를 통해 크리에이터의 마이링크 프로필을 탐색하는 여정 (Phase 1 중심)

> **페르소나**: 이지은 (25세, IT 스타트업 마케터 / 모바일 사용자)  
> **상황 및 목적**: 인스타그램 프로필 바이오에 있는 마이링크 URL을 클릭하여 크리에이터가 운영하는 블로그와 주요 프로젝트를 탐색하고자 함.

1. **진입 (Entry)**: 지은은 스마트폰 인스타그램에서 프로필 바이오 링크를 탭하여 마이링크 페이지에 접속한다.
2. **프로필 인지 (First Impression)**:
   - 화면 중앙에 고화질 프로필 아바타, 크리에이터 닉네임("김무성 \| Vibe Coder"), 친근한 한 줄 소개글이 정갈하게 노출된다.
   - 감각적인 배경 테마와 세련된 카드 레이아웃을 통해 전문적이고 신뢰할 수 있는 첫인상을 받는다.
3. **소셜 채널 탐색 (Social Engagement)**:
   - 프로필 하단에 배치된 소셜 아이콘 바(GitHub, Instagram, YouTube, Email)를 확인하고, 인스타그램 아이콘을 탭해 크리에이터의 일상 SNS로 새 탭 이동한다.
4. **링크 목록 및 섹션 탐색 (Navigation)**:
   - 다시 돌아와 "📌 주요 프로젝트" 섹션 헤더 아래 정리된 "FlowNote - AI 스마트 노트 서비스" 링크 버튼을 탭하여 프로젝트 상세 웹사이트를 살펴본다.
   - 모든 링크는 터치하기 넉넉한 버튼 높이(50px 이상)와 호버/탭 피드백을 제공하여 오터치 없이 부드럽게 탐색할 수 있다.
5. **공유 및 이탈 (Share & Completion)**:
   - 마음에 든 포트폴리오를 동료에게 알려주기 위해 우측 상단 '공유하기' 버튼을 탭한다.
   - "URL이 클립보드에 복사되었습니다!" 토스트 알림을 확인하고 카카오톡 채팅방에 붙여넣어 공유한다.

---

### 시나리오 B: 개발/학습자가 로컬스토리지와 테마 변경 기능을 검증하는 여정 (Phase 1 학습자 시나리오)

> **페르소나**: 김무성 (22세, 프론트엔드 및 바이브 코딩 학습자)  
> **상황 및 목적**: Next.js와 Zustand `persist` 미들웨어가 LocalStorage와 어떻게 연동되는지 확인하고, 테마 변경 시 상태가 영구 유지되는지 테스트하고자 함.

1. **초기 접속 및 Mock 데이터 확인**:
   - 로컬 개발 환경(`http://localhost:3000`)에 브라우저로 최초 접속한다.
   - 브라우저 개발자 도구(F12)의 Application > Local Storage를 확인했을 때, `mylink_profile_data` 키로 사전 정의된 Mock 데이터가 자동으로 시딩(Seeding)되어 있음을 확인한다.
   - 기본 설정된 '퍼플 그라디언트' 테마로 화면이 매끄럽게 렌더링된다.
2. **테마 실시간 변경 테스트**:
   - 화면 하단의 미니 테마 스위처에서 '슬릭 다크(dark-mode)'를 클릭한다.
   - Zustand 스토어의 액션이 실행되면서, 전체 배경이 딥 차콜 다크 모드로 전환되고 링크 카드와 텍스트 색상이 화이트/에메랄드 톤으로 즉시 반응하여 바뀐다.
   - 동시에 LocalStorage의 `themeId` 값이 `"dark-mode"`로 실시간 갱신된다.
3. **새로고침 및 영속성 검증 (Persistence Check)**:
   - 브라우저를 강력 새로고침(Ctrl + Shift + R)하거나 브라우저 탭을 완전히 닫았다가 다시 열어본다.
   - 깜빡임(Hydration Mismatch) 없이 마지막으로 선택했던 '슬릭 다크' 테마 상태가 완벽하게 복원되어 유지되는 것을 확인한다.

---

### 시나리오 C: 신규 크리에이터가 가입하여 대시보드에서 링크를 관리하는 여정 (Phase 2 & 3 미래 확장 시나리오)

> **페르소나**: 박서준 (28세, 1인 테크 유튜버 / 프리랜서)  
> **상황 및 목적**: 유튜브, 굿즈샵, 뉴스레터, 협업 문의 링크가 여기저기 흩어져 있어 마이링크에서 단 하나의 통합 링크를 생성하고 관리하고자 함.

1. **가입 및 핸들 선점**:
   - 마이링크 랜딩 페이지에서 "내 링크 만들기" 버튼을 클릭한다.
   - 이메일, 비밀번호, 그리고 자신만의 고유 핸들(`@seojun_tech`)을 입력하여 중복 검사를 통과하고 가입을 마친다.
2. **대시보드 링크 관리**:
   - 가입 완료 즉시 `/dashboard`로 이동한다.
   - [새 링크 추가] 버튼을 눌러 "유튜브 최신 영상", "주간 테크 뉴스레터 구독", "굿즈 스토어" 링크 3개를 등록한다.
   - 최근 프로모션 중인 "굿즈 스토어"를 상단에 배치하기 위해 [▲ 위로] 버튼을 두 번 눌러 최상단으로 순서를 변경한다.
3. **공개 프로필 확인 및 배포**:
   - 대시보드 상단 내 공개 URL(`http://localhost:3000/seojun_tech`) 바로가기를 클릭하여 실제 방문자에게 보일 화면을 검수한 뒤, 유튜브 채널 '소개' 탭 링크에 등록한다.

---

## 4. 핵심 시스템 아키텍처 및 전역 상태 관리

### 4.1 데이터 흐름도 (Phase 1 중심)
```
[사용자 브라우저]
       │
       ├─► 프로필 페이지 (/) : 로컬스토리지 데이터 로드 및 렌더링
       │         ▲
       │         │
       │    [Zustand Store (Persist Middleware)]
       │    └─ useProfileStore ──► LocalStorage ('mylink_profile_data')
       │         │
       │         ▼ (초기 접속 시)
       │    [Default Mock Data] : 샘플 프로필 및 링크 자동 적재
```

### 4.2 전역 상태 관리 전략: Zustand
- **선정 이유**:
  1. **LocalStorage 자동 동기화 (`persist` 미들웨어)**: 스토어 상태가 변경되면 별도 코드 없이 브라우저 `localStorage`에 자동 영구 저장됩니다.
  2. **초경량 & 제로 보일러플레이트**: 약 1KB 크기로 `<Provider>` 없이 훅 하나로 어디서나 상태 구독이 가능합니다.
  3. **SSR Hydration 안정성**: Next.js App Router 환경에서 클라이언트 수화(Hydration) 불일치를 깔끔하게 방지합니다.

- **Phase 1 스토어 구조 (`useProfileStore`)**:
  - **상태(State)**: `profile` (이름, 바이오, 아바타, 테마 ID, 소셜 링크, 링크 목록), `hasHydrated` (로딩 완료 플래그)
  - **액션(Actions)**: `setTheme(themeId)`, `updateProfile(data)`, `resetToMockData()`

### 4.3 UI 및 디자인 시스템 전략: shadcn/ui + design.md 통합
- **기본 철학 및 개발 원칙**: 
  - 컴포넌트 아키텍처 및 인터랙션은 **[shadcn/ui](https://ui.shadcn.com/)**를 표준으로 사용하고,
  - 시각적 테마, 컬러 팔레트, 타이포그래피, 모션 및 형태학적 감성은 **[`design.md`](file:///c:/Users/anqh3/Documents/Vide_Coding_Projects/mylink/design.md)** 디자인 문서를 전적으로 참고하여 반영합니다.
- **스타일링 표준화 규칙 (Tailwind CSS 100% 통일)**:
  - 모든 컴포넌트 및 페이지 스타일은 **CSS 모듈(`*.module.css`)을 배제하고 Tailwind CSS 유틸리티 클래스로 통일**합니다.
  - 이를 통해 스타일 파편화를 막고 shadcn/ui와의 높은 호환성 및 테마 토큰(`src/app/globals.css`)의 일관성을 극대화합니다.
- **design.md 핵심 비주얼 가이드라인 반영 규칙**:
  1. **브랜드 컬러 및 서피스 (Color Palette)**:
     - **Canvas**: 딥 인디고 (`#0a0d3a`) 베이스 및 부드러운 그라디언트 메쉬
     - **Brand Primary**: 시그니처 블러플(Blurple `#5865f2`)을 주요 버튼 및 액션 강조에 활용
     - **Accents**: 높은 인터랙션 유도를 위한 일렉트릭 그린(`#35ed7e`), 활기찬 분위기의 비브런트 마젠타(`#ec48bd`)
     - **Surfaces**: 레이즈드 인디고 (`#1e2353`), 오닉스 (`#23272a`) 카드로 깊이감 표현
  2. **형태 및 지오메트리 (Geometry & Radius)**:
     - shadcn/ui의 컴포넌트 라운딩에 부드럽고 풍부한 반경(`rounded-xl`, `rounded-2xl`, 12px~16px)을 적용하여 친근하고 완성도 높은 감성 연출
  3. **그림자 및 모션 (Shadow & Movement)**:
     - 디퓨즈 바이올렛 틴트 플로팅 섀도우(`discord-float-shadow`) 및 섬세한 스케일 인터랙션 적용
- **컴포넌트 구현 매핑 (shadcn/ui 기반)**:
  - **프로필 아바타**: `Avatar`, `AvatarImage`, `AvatarFallback` (풍부한 라운딩 및 플로팅 섀도우)
  - **버튼 시스템**: `Button` (기본 shadcn variant에 `design.md`의 Blurple / Green / Ghost 스타일 테마 주입)
  - **링크 카드**: `Card` (레이즈드 인디고 / 오닉스 서피스 + 호버 시 Blurple/Magenta 보더 하이라이트)
  - **섹션 구분**: `Separator` (마젠타/블러플 틴트의 정갈한 라인)
  - **뱃지 & 태그**: `Badge` (마젠타 및 일렉트릭 그린 악센트 뱃지)
  - **아이콘 시스템**: `lucide-react` (Instagram, Youtube, Github, Share2, ExternalLink 등)

---

## 5. 종합 기능 목록 (Feature List Matrix)

단계별 개발 계획에 따른 전체 기능 목록입니다.

| 기능 ID | 대분류 | 기능명 및 상세 내용 | 개발 단계 | 우선순위 | 난이도 |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **FEAT-DATA-01** | 데이터 | **Mock 데이터 자동 시딩**: 최초 접속 시 샘플 프로필/링크를 LocalStorage에 적재 | **Phase 1** | P0 | 하 |
| **FEAT-DATA-02** | 데이터 | **LocalStorage 동기화**: Zustand Persist 미들웨어 기반 실시간 상태 저장 | **Phase 1** | P0 | 중 |
| **FEAT-PROF-01** | 프로필 | **프로필 헤더 렌더링**: 아바타 이미지, 표시 이름, 한 줄 소개(Bio) 노출 | **Phase 1** | P0 | 하 |
| **FEAT-SOC-01** | 소셜 | **소셜 아이콘 바**: 등록된 SNS URL(인스타, 유튜브, 깃허브 등)을 아이콘으로 노출 | **Phase 1** | P0 | 하 |
| **FEAT-LINK-01** | 링크 | **링크 버튼 리스트**: 등록된 링크 버튼(제목 + 외부 이동) 렌더링 | **Phase 1** | P0 | 하 |
| **FEAT-LINK-02** | 링크 | **섹션 헤더 블록**: 링크들을 시각적으로 묶어주는 카테고리 헤더 텍스트 렌더링 | **Phase 1** | P0 | 하 |
| **FEAT-THM-01** | 테마 | **5개 프리셋 테마 스타일**: 미니멀, 다크, 그라디언트, 파스텔, 네오 스타일 적용 | **Phase 1** | P0 | 중 |
| **FEAT-THM-02** | 테마 | **테마 전환 체험**: 프로필 페이지에서 테마 변경 시 로컬스토리지 저장 및 실시간 반영 | **Phase 1** | P1 | 하 |
| **FEAT-PAGE-01** | 공개 페이지 | **모바일 최적화 레이아웃**: 스마트폰 뷰포트 기준 중앙 정렬 카드형 뷰 제공 | **Phase 1** | P0 | 하 |
| **FEAT-PAGE-02** | 공개 페이지 | **외부 링크 안전 이동**: 새 탭(`target="_blank"`, `rel="noopener noreferrer"`) 이동 | **Phase 1** | P0 | 하 |
| **FEAT-PAGE-03** | 공개 페이지 | **URL 공유하기**: 원클릭 클립보드 복사 및 성공 알림 토스트 | **Phase 1** | P1 | 하 |
| **FEAT-DASH-01** | 대시보드 | 프로필 정보(이름, 소개글, 아바타 URL) 편집 폼 | Phase 2 | P0 | 중 |
| **FEAT-DASH-02** | 대시보드 | 새 링크 및 섹션 헤더 추가 기능 | Phase 2 | P0 | 중 |
| **FEAT-DASH-03** | 대시보드 | 등록된 링크 제목/URL 인라인 수정 | Phase 2 | P0 | 중 |
| **FEAT-DASH-04** | 대시보드 | 링크 삭제 (확인 팝업 후 즉시 제거) | Phase 2 | P0 | 하 |
| **FEAT-DASH-05** | 대시보드 | 링크 순서 변경 ([▲ 위로], [▼ 아래로] 이동 버튼) | Phase 2 | P0 | 중 |
| **FEAT-DASH-06** | 대시보드 | 대시보드 내 테마 선택 라디오 카드 UI | Phase 2 | P0 | 하 |
| **FEAT-AUTH-01** | 인증 | 이메일 + 비밀번호 자체 회원가입 및 핸들(`username`) 중복 검사 | Phase 3 | P0 | 중 |
| **FEAT-AUTH-02** | 인증 | 로그인 및 세션 관리 (`mylink_session`) | Phase 3 | P0 | 하 |
| **FEAT-AUTH-03** | 인증 | 미인증 사용자 대시보드 접근 차단 라우트 가드 | Phase 3 | P0 | 하 |
| **FEAT-PAGE-04** | 공개 페이지 | `/[username]` 동적 라우팅 기반 사용자별 멀티 프로필 분기 렌더링 | Phase 3 | P0 | 중 |
| **FEAT-STAT-01** | 통계 | 페이지 조회수(PV) 및 링크별 클릭수(Click) 집계 대시보드 | Phase 4 | P2 | 상 |

---

## 6. Phase 1 세부 구현 명세 (현재 집중 개발 범위)

### 6.1 프로필 헤더 (Profile Header)
- **아바타 (`Avatar`, `AvatarImage`, `AvatarFallback`)**: 96×96px 원형 아바타, 이미지 로딩 실패 시 이니셜 Fallback 자동 제공
- **이름**: 가독성 높은 볼드 타이포그래피 (`text-xl font-bold tracking-tight`)
- **핸들 태그 (`Badge`)**: `@username` 형태의 `Badge (variant="secondary")` 배지 표기
- **바이오 (Bio)**: 최대 2~3줄 줄바꿈이 지원되는 소개글 (`text-sm text-muted-foreground`)

### 6.2 소셜 아이콘 바 (Social Icons Bar)
- 지원 플랫폼: Instagram, YouTube, GitHub, Twitter/X, LinkedIn, Email (`lucide-react` 아이콘 매핑)
- **버튼 스타일 (`Button`)**: `variant="ghost" size="icon"` 형태의 원형 터치 버튼 (`rounded-full h-10 w-10`)
- URL 값이 존재하는 플랫폼만 필터링하여 가로 중앙 정렬 플렉스 박스로 렌더링

### 6.3 링크 & 섹션 리스트 (Links & Headers)
- **섹션 헤더 (`Separator` + 텍스트)**: 연관된 링크들을 그룹화하는 소제목 텍스트 및 구분선
- **링크 카드 (`Card` / `Button`)**:
  - `Card` 또는 `Button (variant="outline" size="lg")` 기반의 모바일 친화적 높이 (최소 52px)
  - 호버/탭 시 부드러운 스케일업 및 배경 강조 (`hover:bg-accent hover:border-foreground/20 transition-all`)
  - 우측에 `ExternalLink` 아이콘을 배치하여 외부 링크임을 명확히 인지
  - 클릭 시 보안 속성(`rel="noopener noreferrer"`)과 함께 새 창 이동

### 6.4 5가지 테마 프리셋 (Theme Presets)
- `design.md`의 비주얼 정체성과 shadcn/ui CSS 변수 토큰(`--background`, `--foreground`, `--card`, `--border` 등)을 연계한 5종 스타일:
  - `discord-signature` (대표 테마): `design.md` 기반의 딥 인디고 캔버스 + Blurple 버튼 + 마젠타/그린 악센트 + 플로팅 섀도우
  - `minimal-light`: 화이트 배경 + 정갈한 보더 + 다크 텍스트 (shadcn 기본 Light)
  - `dark-mode`: 딥 징크/차콜 배경 + 톤다운 카드 + 화이트 텍스트 (shadcn 기본 Dark)
  - `pastel-peach`: 따뜻한 소프트 피치 크림 + 부드러운 캡슐 버튼
  - `neo-brutal`: 웜 옐로우 + 두꺼운 3px 블랙 보더 + 하드 드롭 섀도우

---

## 7. 데이터 모델 명세 (Phase 1 LocalStorage Schema)

LocalStorage 저장 키: `mylink_profile_data`

```typescript
// 1. 링크/헤더 블록
interface LinkItem {
  id: string;               // UUID
  type: 'link' | 'header';  // 링크 버튼 또는 섹션 헤더
  title: string;            // 표시 제목
  url?: string;             // 웹 URL (type === 'link' 일 때 필수)
  order: number;            // 정렬 순서
}

// 2. 소셜 링크 모음
interface SocialLinks {
  instagram?: string;
  youtube?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
}

// 3. 지원 테마 ID
type ThemeId = 
  | 'discord-signature'
  | 'minimal-light' 
  | 'dark-mode' 
  | 'pastel-peach' 
  | 'neo-brutal';

// 4. 프로필 전체 데이터 구조 (Zustand Persist 대상)
interface UserProfile {
  displayName: string;      // 표시 이름
  handle: string;           // 사용자 핸들 (예: "mooseong")
  bio: string;              // 소개글
  avatarUrl: string;        // 아바타 이미지 URL
  themeId: ThemeId;         // 적용된 테마 ID
  socials: SocialLinks;     // 소셜 링크
  links: LinkItem[];        // 링크 및 섹션 목록
  updatedAt: string;        // 최종 갱신 일자
}
```

---

## 8. Phase 1 기본 Mock 데이터 명세

초기 로컬스토리지에 저장되어 바로 페이지를 확인할 수 있는 기본 데이터:

- **표시 이름**: "김무성 | Vibe Coder"
- **핸들**: "@mooseong"
- **소개글**: "아이디어를 코드로 실현하는 개발자입니다 🚀\n포트폴리오와 주요 활동 링크를 모았습니다."
- **아바타 이미지**: 고화질 프로필 샘플 이미지
- **테마**: `vibrant-gradient`
- **소셜 링크**: GitHub, Instagram, YouTube, Email
- **링크 목록**:
  - `[Header]` 📌 주요 프로젝트
  - `[Link]` FlowNote - AI 스마트 노트 서비스 (`https://github.com`)
  - `[Link]` PixelCraft - 모던 웹 컴포넌트 라이브러리 (`https://github.com`)
  - `[Header]` ✍️ 콘텐츠 & 문의
  - `[Link]` 기술 블로그 바로가기 (`https://velog.io`)
  - `[Link]` 1:1 커피챗 및 협업 문의 (`mailto:contact@example.com`)

---

## 9. 성공 기준 (Success Criteria for Phase 1)

1. **LocalStorage 정상 연동**: 브라우저를 새로고침하거나 닫았다 열어도 프로필/링크/테마 상태가 유지되는가?
2. **모바일 최적화 UI**: 모바일 뷰포트에서 터치하기 편하고 시각적으로 정돈된 링크트리 레이아웃으로 렌더링되는가?
3. **테마 전환 반영**: 테마 변경 시 로컬스토리지 값이 갱신되고 화면 스타일이 즉시 전환되는가?
