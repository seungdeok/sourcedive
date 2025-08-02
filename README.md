# 🔍 SourceDive
![NPM Version](https://img.shields.io/npm/v/sourcedive)

- 오픈소스 프로젝트를 분석하는데 사용하는 도구를 제공해줍니다.
  - 패키지/Github Repo의 meta 정보
  - 사용되는 라이브러리 분석
  - 사용되는 의존성 그래프 분석

<br />

## packages
다음 패키지는 외부에 배포되지 않고, `sourcedive` 프로젝트 내부에서만 관리됩니다.

- `@sourcedive/tsconfig` :타입스크립트 구성 파일

<br />

## apps

sourcedive의 어플리케이션을 관리합니다.
- `@sourcedive/web`: npm registry, github repository의 정보를 볼 수 있는 웹입니다.
- `sourcedive`: 로컬 프로젝트의 의존성 그래프 정보를 얻을 수 있는 CLI입니다.

<br />

## 지원 환경
- Node v18+
- pnpm v9+
- Browser 
  - Chrome 64+
  - Edge 79+
  - Firefox 67+
  - Opera 51+
  - Safari 12+