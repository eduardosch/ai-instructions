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

<style lang="scss" scoped>
.the-footer {
  margin-top: auto;
  border-top: 1px solid $color-border;
  position: relative;
}

.the-footer__inner {
  max-width: rem(1120);
  margin: 0 auto;
  padding: rem(26) rem(40);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: rem(8);
  font-size: rem(13);
  color: $color-text-dim;
}

.the-footer__inner em {
  color: $color-text-muted;
  font-style: normal;
}

.the-footer__link {
  color: $color-primary;
  text-decoration: none;
}

.the-footer__link:hover {
  text-decoration: underline;
}
</style>
