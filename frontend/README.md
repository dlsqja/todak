### Prettier 설치 및 설정 방법

1. 확장 설치

- 좌측 Extensions(⌘⇧X / Ctrl+Shift+X) → “Prettier - Code formatter” 설치

2. 사용자/워크스페이스 설정 열기

- Command Palette(⌘⇧P / Ctrl+Shift+P) → “Preferences: Open Settings (JSON)”

3. 아래 항목 추가 (권장 기본)

```
{
  // Prettier를 기본 포맷터로
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 저장할 때 자동 포맷
  "editor.formatOnSave": true,

  // TypeScript, JSON 등에서도 강제
  "[javascript]": { "editor.formatOnSave": true },
  "[typescript]": { "editor.formatOnSave": true },
  "[json]":       { "editor.formatOnSave": true }
}
```

4. 프로젝트 전용 설정 파일(선택)

```
//.prettierrc
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": true,
  "tabWidth: 2",
  "useTabs": false
}
```

루트에 .prettierrc 생성
→ 팀원이 동일 규칙을 쓰도록 Git 에 커밋
