# 빌드 후 레이아웃 추가 가이드

## 방법 1: public 디렉토리 활용

1. **빌드 시 생성되는 구조:**
```
.output/
  public/
    skins/
      normal/
      dark/
      custom/  <- 여기에 새 스킨 추가
```

2. **새 스킨 추가:**
```bash
# .output/public/skins/myskin/ 디렉토리 생성
mkdir -p .output/public/skins/myskin

# index.js 파일 생성 (Vue 컴포넌트)
cat > .output/public/skins/myskin/index.js << 'EOF'
export default {
  template: `
    <div class="myskin">
      <header>My Custom Skin</header>
      <main><slot /></main>
    </div>
  `,
  name: 'MySkin'
}
EOF
```

## 방법 2: 심볼릭 링크 (Linux/Mac)

```bash
# 외부 스킨 디렉토리를 빌드 결과에 링크
ln -s /path/to/external/skins .output/public/skins
```

## 방법 3: 환경 변수 기반 동적 로드

```bash
# .env 파일
SKIN_PATH=/var/www/skins
DEFAULT_SKIN=myskin
```

## serverConfig.json 수정

```json
{
  "default_skin": "myskin"
}
```

## 주의사항

1. **보안:** eval() 사용 시 신뢰할 수 있는 소스만 로드
2. **캐싱:** 스킨 변경 시 브라우저 캐시 클리어 필요
3. **타입:** 외부 스킨은 TypeScript 타입 체크 불가
4. **빌드 최적화:** 내장 스킨이 번들 크기 최적화에 유리

## 권장 구조

```
프로젝트 루트/
├── app/
│   └── layouts/
│       └── skins/
│           ├── normal/     # 기본 내장 스킨
│           └── dark/       # 내장 스킨
├── public/
│   └── skins/              # 런타임 추가 가능한 외부 스킨
│       └── custom/
└── .output/
    └── public/
        └── skins/          # 빌드 후 여기에 복사됨
```
