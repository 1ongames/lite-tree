// 빌드 후 추가 가능한 외부 스킨 예제
// 위치: public/skins/custom/index.js

export default {
  name: 'CustomSkin',
  template: `
    <div class="custom-skin">
      <header class="custom-header">
        <h1>Custom Skin</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/recent">Recent</a>
        </nav>
      </header>
      <main class="custom-main">
        <slot></slot>
      </main>
      <footer class="custom-footer">
        <p>Custom Skin - Loaded Dynamically</p>
      </footer>
    </div>
  `,
  style: `
    .custom-skin {
      min-height: 100vh;
      background: linear-gradient(to bottom, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .custom-header {
      padding: 2rem;
      background: rgba(0,0,0,0.2);
    }
    .custom-main {
      padding: 2rem;
      min-height: 60vh;
    }
    .custom-footer {
      padding: 1rem;
      text-align: center;
      background: rgba(0,0,0,0.2);
    }
  `
}
