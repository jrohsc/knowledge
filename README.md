# 다시, 지식 — Daily Knowledge Encyclopedia

한국어로 읽고, 시각적으로 이해하고, 복습하며 서로 연결하는 개인 지식 백과사전입니다. Next.js App Router의 **완전 정적 내보내기**를 사용하며, 서버·계정·외부 API 없이 GitHub Pages에서 동작합니다.

목표 주소: **https://jrohsc.github.io/knowledge/**

## 설치와 실행

Node.js 22 이상, npm을 사용합니다. `package-lock.json`을 커밋해 재현 가능한 설치를 유지합니다.

```sh
npm ci
npm run dev
```

개발 주소: http://127.0.0.1:4315/knowledge/

`predev`는 콘텐츠를 검증하고 복습용 정적 JSON을 생성합니다. MDX 본문 변경은 개발 서버에 반영됩니다. 메타데이터를 변경한 뒤 복습 JSON도 갱신하려면 `npm run validate`를 실행하세요.

## 빌드와 검증

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

- `npm test`: 날짜·복습 간격·검색·일일 추천·백업 형식의 단위 테스트
- `npm run validate`: 기사와 분류, 질문, 연결, 연대표 무결성 검증 및 복습 JSON 생성
- `npm run build`: 콘텐츠 검증 → 타입 검사 → 모든 페이지를 `out/`에 생성
- `npm run typecheck`: 독립 TypeScript 검사
- `npm run test:e2e`: 실제 `out/`를 제공하는 정적 서버에서 Playwright 및 axe 접근성 검사
- `npm run preview`: http://127.0.0.1:4315/knowledge/ 에서 정적 산출물 확인

테스트 서버에는 SPA fallback이 없습니다. 기사별 `index.html`에 직접 접속하므로 GitHub Pages의 새로고침 조건을 검증합니다. E2E가 서버를 시작했다면 테스트 종료 후 자동으로 정리합니다.

## 제공 기능

- 매일 날짜에 따라 바뀌는 역사·철학·과학·수학 네 분야의 읽기 목록
- 14개 완성된 한국어 MDX 기사, 글마다 5개 핵심 요점과 3개 개념 질문
- 한국어·영어·별칭 검색, Cmd/Ctrl+K, 키보드 탐색과 검색창 포커스 관리
- 미분의 할선/접선, 만유인력, 입자 분포, 동전 반복 실험, 자연선택 비율, 전자껍질, DNA 발현 과정 등 SVG 설명
- 지역별 평행 타임라인, 기간 선택·확대·이동, 같은 연도의 문명 비교
- 방향과 의미를 설명하는 큐레이션 지식 관계 지도
- 읽기 위치·완료·이해도·예정 복습·복습 이력·퀴즈 응답 저장
- JSON 학습 기록 백업과 명시적 교체를 통한 복원
- 밝은 화면/어두운 화면, 반응형 읽기 화면, reduced-motion, 인쇄 스타일
- 글별 정적 URL·메타데이터·한글 웹폰트·KaTeX 폰트의 자체 호스팅

외부 링크는 참고 자료를 여는 용도입니다. 기본 화면·검색·시각화·복습에는 외부 서비스 요청이 필요하지 않습니다. 서비스워커 기반 오프라인 캐시는 구현하지 않았으며, 처음 페이지나 복습 자료를 불러올 때는 네트워크가 필요합니다.

## 디렉터리

```text
app/                         페이지와 공통 스타일
  topic/[id]/page.tsx         기사별 정적 생성 + MDX 렌더링
  [page]/page.tsx             탐색·복습·지도·타임라인 정적 경로
content/
  articles/*.mdx             기사 원본과 JSON/YAML frontmatter
  subjects.ts                분야·상위 그룹·하위 분류
  relationships.ts           방향·종류·설명이 있는 지식 관계
  timeline.ts                지역별 역사 구간 및 연도 설명
components/
  visuals/                   SVG·D3 기반 재사용 시각화
lib/
  schema.ts                  콘텐츠 계약
  content.ts                 빌드 시 파일 로딩과 경량 목록 추출
  learning.ts                검색·추천·복습의 순수 함수
  storage.ts                 저장소 인터페이스와 백업 검증
scripts/                     검증 및 하위 경로 정적 미리보기
public/data/topics/          빌드 시 생성되는 복습 자료 (Git 제외)
tests/                       단위·브라우저·접근성 검사
.github/workflows/pages.yml   CI 및 Pages 배포
```

기사는 서버에서 빌드 시 렌더링됩니다. 본문 전체를 클라이언트 검색에 싣지 않습니다. 공통 메뉴와 탐색에는 경량 `TopicSummary`를 전달하며, 복습 페이지는 선택한 글의 JSON만 불러옵니다. 검색은 현재 제목·영문 이름·별칭·설명·하위 분류를 색인하며, 본문 전체 검색은 의도적으로 포함하지 않습니다.

## 콘텐츠 추가

자세한 규약은 [콘텐츠 작성 가이드](docs/CONTENT.md)를 참고하세요.

1. `content/articles/`에서 비슷한 기사를 복사합니다.
2. 파일 이름과 `id`를 동일한 영문 소문자 kebab-case로 정합니다.
3. frontmatter의 분야·하위 분류·요약·질문·연결·참고 자료를 수정합니다.
4. MDX 본문을 작성하고 필요한 시각화 컴포넌트를 삽입합니다.
5. `content/relationships.ts`에 연결의 **의미**를 추가합니다.
6. 필요한 역사 구간은 `content/timeline.ts`에 추가합니다.
7. `npm run build`로 정적 URL과 참조 무결성을 검증합니다.

**ID는 영구 주소와 학습 기록의 키입니다.** 이미 공개한 글의 제목을 바꿀 때도 ID는 유지하세요. URL을 바꿔야 한다면 기존 경로의 정적 안내 페이지와 저장 데이터 마이그레이션을 함께 설계해야 합니다.

새 분야는 `content/subjects.ts`에 고유 ID와 한국어 이름, 상위 그룹, 하위 분류, 테마 색을 추가하면 됩니다. 일일 추천의 영역을 늘리거나 새 상위 그룹을 탐색 메뉴에 노출하려면 `lib/learning.ts`의 `dailyTopics`와 `Explore.tsx`의 그룹 목록을 함께 수정합니다.

## 시각화 추가

[시각화 가이드](docs/VISUALIZATIONS.md)에 원칙과 현재 컴포넌트를 정리했습니다.

```mdx
<InteractiveFunction />

<CausalFlow
  causes={["재정 위기", "신분 특권", "대표권 갈등"]}
  event="1789년, 혁명"
  outcomes={["입헌군주제 시도", "공화국", "새 권력의 등장"]}
/>

<BeforeAfter
  before="바뀌기 전의 구조"
  after="바뀐 뒤의 구조"
  caption="두 구조를 비교할 때 필요한 조건"
/>
```

새 모듈은 `components/visuals/`에 구현하고 `index.ts`에서 export하면 본문 MDX에서 사용할 수 있습니다. 대표 시각화로 쓰려면 `VisualKind`와 `HeroVisual` 레지스트리, 검증기의 허용 목록을 함께 추가합니다. 복잡한 인터랙션만 `'use client'`로 지정합니다. MDX는 신뢰할 수 있는 저장소 소스만 빌드하며 사용자 입력을 MDX로 실행하지 않습니다.

수식은 `$f'(x)$` 또는 별도 문단의 `$$ ... $$`로 작성합니다. remark-math와 rehype-katex가 빌드 시 렌더링합니다.

## 학습 기록과 복습

`ProgressRepository`의 `load`, `save`, `subscribe`가 저장 방식의 경계입니다. `ProgressProvider`에 다른 구현을 주입해 향후 서버 동기화로 교체할 수 있습니다. 현재 키는 `knowledge.progress.v1`입니다.

- 읽기 진입: 최근 열람 시간, 처음인 글은 학습 중으로 변경
- 스크롤: 가장 멀리 읽은 비율 저장, 재방문 시 이어 읽기 제공
- 15초 머무르기 또는 명시적인 학습 동작: 활동일 기록
- 읽기 완료: 완료 일시와 100% 기록, 예정일이 없으면 내일 복습
- 수동 예약: 내일 / 7일 후 / 다음 달 같은 날짜(없는 날짜는 말일)
- 다시 볼래요: 1일 후
- 기억했어요: 직전 간격의 2배, 최소 3일
- 쉽게 설명할 수 있어요: 2.5배, 최소 14일
- 연속일: 오늘 또는 어제부터 끊김 없이 이어진 활동일

시간 계산은 사용자의 현지 달력 날짜를 사용합니다. 월말과 윤년을 처리합니다. 특정 알고리즘의 최적 효과를 주장하지 않는, 설명 가능한 간단한 반복 일정입니다.

브라우저 데이터 삭제·시크릿 모드 종료·기기 변경으로 기록이 없어질 수 있으므로 복습 화면에서 백업을 내보낼 수 있습니다. 손상된 저장 기록은 자동으로 덮어쓰지 않습니다. 저장 실패를 사용자에게 알리고, 정상적인 백업만 복원합니다. 서버 동기화와 다중 기기 병합은 현재 제공하지 않습니다.

## GitHub Pages 배포

1. `jrohsc` 계정에 **knowledge** 저장소를 만듭니다.
2. 이 프로젝트를 저장소의 루트로 커밋하고 `main`에 push합니다.
3. GitHub 저장소 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
4. Actions의 **검증 및 GitHub Pages 배포** 실행을 확인합니다.
5. `build` 단계의 단위·콘텐츠·타입·브라우저·접근성 검사가 모두 통과하면 `deploy` 단계가 배포합니다.

```sh
git init -b main
git add .
git commit -m "Build Korean visual knowledge encyclopedia"
git remote add origin https://github.com/jrohsc/knowledge.git
git push -u origin main
```

이미 Git 저장소라면 `git init`을 반복할 필요가 없습니다. 이미 origin이 있다면 올바른 저장소인지 먼저 확인하세요. GitHub 자격 증명은 로컬 Git 또는 사용자의 GitHub 환경에서 설정하며 이 프로젝트에 저장하지 않습니다.

배포 산출물은 `out/`입니다. `public/.nojekyll`이 함께 복사됩니다. Next.js는 `trailingSlash: true`로 `/topic/entropy/index.html`을 생성하므로 `/knowledge/topic/entropy/`의 직접 접근과 새로고침이 가능합니다. API Route, 서버 액션, SSR, 이미지 최적화 서버, rewrite에 의존하지 않습니다.

워크플로는 PR에서도 모든 검사를 수행하되 배포하지 않습니다. 프로덕션 배포에는 `pages: write`, `id-token: write`만 추가하고 코드는 읽기 권한만 사용합니다. 계정의 Pages 제공 범위는 저장소 공개 여부와 GitHub 플랜에 따라 다를 수 있습니다.

## 저장소 이름 또는 basePath 변경

기본값은 `next.config.ts`와 `lib/paths.ts`의 `/knowledge`이며 환경 변수로 함께 변경됩니다.

```sh
NEXT_PUBLIC_BASE_PATH=/new-repository npm run build
NEXT_PUBLIC_BASE_PATH=/new-repository npm run preview
```

지속적인 변경은 다음을 함께 수정하세요.

- `.github/workflows/pages.yml`의 `NEXT_PUBLIC_BASE_PATH`
- `next.config.ts`, `lib/paths.ts`의 기본값
- `app/layout.tsx`의 `metadataBase`
- `playwright.config.ts`, `tests/e2e/site.spec.ts`의 기대 경로
- README의 배포 URL

루트 사이트는 `NEXT_PUBLIC_BASE_PATH=''`로 빌드합니다. **basePath는 빌드 시 고정되므로 반드시 다시 빌드하세요.** Next `Link`에는 `/knowledge`를 직접 붙이지 않습니다. `public/` 자원과 fetch에는 `assetPath()`를 사용합니다. 폰트·CSS·JS는 Next 번들러가 basePath를 반영하며 외부 CDN 폰트에 의존하지 않습니다.

## 편집과 품질

기사는 일차적인 이해를 돕는 독자적인 요약이며, 역사적 쟁점과 과학적 모형의 한계를 표시합니다. 참고 자료는 각 글 하단에서 확인할 수 있습니다. 연대표의 고대 경계와 문명권 구간은 엄밀한 국경이나 단일 국가의 존속과 동일하지 않습니다. 새 글을 추가할 때 날짜와 과학적 표현을 원자료로 확인하세요.

자동 검사는 역사·과학의 사실성을 입증하지 않습니다. 화면과 동작을 변경할 때는 밝은/어두운 테마와 모바일에서 직접 읽어보는 검토를 병행하세요.

기술 설정 참고: [Next.js basePath](https://nextjs.org/docs/pages/api-reference/config/next-config-js/basePath), [Next.js static export 예제](https://github.com/vercel/next.js/tree/canary/examples/with-static-export), [GitHub Pages 사용자 정의 워크플로](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

홈페이지의 **큰 그림**에서 역사·철학·과학·수학을 선택하거나 세 가지 분야 간 읽기 경로를 재생할 수 있습니다. **전체 목차**로 전환하면 모든 글로 바로 이동합니다. 14개 글에는 개념을 설명하는 세 장면 SVG 삽화를 제공합니다. 확장 방법은 [시각화 가이드](docs/VISUALIZATIONS.md)를 참고하세요.
