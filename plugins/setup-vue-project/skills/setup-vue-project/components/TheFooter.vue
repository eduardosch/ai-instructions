<script setup lang="ts">
</script>

<template>
  <footer class="the-footer">
    <div class="the-footer__inner">
      <span>Scaffolded with <em>setup-vue-project</em> — a plugin by Eduardo Schröder</span>
      <a
        href="https://github.com/eduardosch"
        class="the-footer__link"
        target="_blank"
        rel="noopener"
      >
        github.com/eduardosch
      </a>
    </div>
  </footer>
</template>

<style scoped>
.the-footer {
  margin-top: auto;
  border-top: 1px solid rgba(242, 245, 242, 0.08);
  position: relative;
}

.the-footer__inner {
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

.the-footer__inner em {
  color: #a9b5ac;
  font-style: normal;
}

.the-footer__link {
  color: #42b883;
  text-decoration: none;
}

.the-footer__link:hover {
  text-decoration: underline;
}
</style>
