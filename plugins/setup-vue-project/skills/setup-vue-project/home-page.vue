<script setup lang="ts">
import VueLogo from '@/assets/icons/vue-logo.svg?component'
import IconTerminal from '@/assets/icons/icon-terminal.svg?component'
import IconFolder from '@/assets/icons/icon-folder.svg?component'
import IconHelp from '@/assets/icons/icon-help.svg?component'

const projectName = '<project-name>'
</script>

<template>
  <div class="page">
    <div class="glow" />

    <nav class="nav">
      <div class="nav-inner">
        <div class="logo">
          <VueLogo />
          <span class="app-name">{{ projectName }}</span>
        </div>
        <a href="https://github.com/eduardosch" class="nav-link" target="_blank" rel="noopener">github.com/eduardosch ↗</a>
      </div>
    </nav>

    <section class="hero">
      <span class="badge">Project scaffolded</span>
      <h1>Your Vue app is ready.</h1>
      <p class="subtitle">
        This project was scaffolded with <strong>setup-vue-project</strong> —
        TypeScript and project tooling are wired up and ready for
        <code>npm run dev</code>.
      </p>
      <div class="terminal">
        <div><span class="prompt">$</span> npm install</div>
        <div><span class="prompt">$</span> npm run dev</div>
      </div>
      <div class="actions">
        <a href="https://vuejs.org" class="btn-primary" target="_blank" rel="noopener">Read the Vue docs</a>
        <a href="https://github.com/eduardosch" class="btn-ghost" target="_blank" rel="noopener">View the plugin</a>
      </div>
    </section>

    <section class="cards">
      <div class="card">
        <IconTerminal />
        <h3>Start the dev server</h3>
        <p>Run <code>npm run dev</code> and open the local URL printed in your terminal.</p>
      </div>
      <div class="card">
        <IconFolder />
        <h3>Explore the structure</h3>
        <p>Components and views go under <code>src/</code>, following the plugin's conventions.</p>
      </div>
      <div class="card">
        <IconHelp />
        <h3>Get support</h3>
        <p>Questions or issues with the plugin go to <a href="https://github.com/eduardosch" class="accent-link" target="_blank" rel="noopener">github.com/eduardosch</a>.</p>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-inner">
        <span>Scaffolded with <em>setup-vue-project</em> — a plugin by Eduardo Schröder</span>
        <a href="https://github.com/eduardosch" class="accent-link" target="_blank" rel="noopener">github.com/eduardosch</a>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: #0f1412;
  color: #f2f5f2;
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
}

a { text-decoration: none; }
</style>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.glow {
  position: absolute;
  top: -220px;
  left: 50%;
  transform: translateX(-50%);
  width: 760px;
  height: 760px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(66,184,131,0.16) 0%, rgba(66,184,131,0) 68%);
  pointer-events: none;
}

.nav { width: 100%; position: relative; }

.nav-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo { display: flex; align-items: center; gap: 12px; }

.app-name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.01em;
}

.nav-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #a9b5ac;
}

.hero {
  max-width: 720px;
  margin: 88px auto 0;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  position: relative;
}

.badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #42B883;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 14px;
  border: 1px solid rgba(66,184,131,0.35);
  border-radius: 999px;
}

h1 {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 52px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.subtitle {
  margin: 0;
  max-width: 520px;
  font-size: 17px;
  line-height: 1.6;
  color: #a9b5ac;
}

.subtitle strong { color: #f2f5f2; font-weight: 500; }

.subtitle code, p code {
  font-family: 'JetBrains Mono', monospace;
  color: #42B883;
}

.terminal {
  width: 100%;
  max-width: 420px;
  background: #16201c;
  border: 1px solid rgba(66,184,131,0.25);
  border-radius: 14px;
  padding: 20px 24px;
  text-align: left;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.9;
}

.prompt { color: #5c6b60; }

.actions { display: flex; gap: 14px; margin-top: 4px; }

.btn-primary {
  background: #42B883;
  color: #0f1412;
  font-weight: 600;
  font-size: 15px;
  padding: 12px 22px;
  border-radius: 10px;
}

.btn-ghost {
  border: 1px solid rgba(242,245,242,0.2);
  color: #f2f5f2;
  font-weight: 500;
  font-size: 15px;
  padding: 12px 22px;
  border-radius: 10px;
}

.btn-ghost:hover { background: rgba(66,184,131,0.1); }

.cards {
  max-width: 1120px;
  margin: 72px auto 88px;
  padding: 0 40px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  position: relative;
}

.card {
  background: #141a17;
  border: 1px solid rgba(242,245,242,0.08);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card:hover { border-color: rgba(66,184,131,0.45); }

.card h3 {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
}

.card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #a9b5ac;
}

.accent-link { color: #42B883; }
.accent-link:hover { text-decoration: underline; }

.footer {
  margin-top: auto;
  border-top: 1px solid rgba(242,245,242,0.08);
  position: relative;
}

.footer-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 26px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: #6b7770;
}

.footer-inner em { color: #a9b5ac; font-style: normal; }
</style>
