# 🔍 Sourcedive CLI
외부 환경의 파일을 조회하려면 SourceDive CLI(Command Line Interface)를 사용해야 합니다.

## CLI 사용 가이드
### 설치 및 실행
```bash
$ npx sourcedive -o {outputDirectory} -f {entryFile}
$ yarn dlx sourcedive -o {outputDirectory} -f {entryFile}
$ pnpm dlx sourcedive -o {outputDirectory} -f {entryFile}
```

### 사용 예시
```bash
// React 프로젝트의 특정 컴포넌트 분석
$ npx sourcedive -o {outputDirectory} -f src/components/Header.jsx

// Node.js 서버 파일 분석
$ npx sourcedive -o {outputDirectory} -f server/app.js
```