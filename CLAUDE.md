# AI Instructions Project

## Git Commits

Always use the `commit-message` skill when creating git commits in this repository.

Invoke it with `/commit-message` or by asking to "create a commit message".

Can be invoked writing just commit or commit and push.

## Plugins

After creating a new plugin, always update `.claude-plugin/marketplace.json` to register it in the plugins array, following the same shape as the existing entries (name, description, version, source, skills, keywords, author, license, category).

## Releases

Always use the `versioning` skill when cutting a release in this repository.

Invoke it with `/versioning` or by asking to "release" or "cut a release".

After every commit or push in this repository, always run the release script: `node plugins/versioning/skills/release.mjs`. Then push the release commit and tag with `git push` and `git push --tags`.
