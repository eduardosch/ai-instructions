# AI Instructions Project

## Git Commits

Always use the `commit-message` skill when creating git commits in this repository.

Invoke it with `/commit-message` or by asking to "create a commit message".

Can be invoked writing just commit or commit and push.

Every new plugin or new module must be a major commit like: feat!(plugin-name or module-name) - message

New SPECS or SKILLS must be a major version as well

## Plugins

After creating a new plugin, always:
1. Update `.claude-plugin/marketplace.json` to register it in the plugins array, following the same shape as the existing entries (name, description, version, source, skills, keywords, author, license, category).
2. Update the root `README.md` to add a section for the new plugin under **Plugins**, including a one-line description, the install command, and usage instructions.


## PROJECT README
Update the root `README.md` whenever there is a new plugin / skill or this usage or installation steps change.

## Releases

Always use the `versioning` skill when cutting a release in this repository.

Invoke it with `/versioning` or by asking to "release" or "cut a release".

After every push in this repository, always run the release script: `node plugins/versioning/skills/release.mjs`. Then push the release commit and tag with `git push` and `git push --tags`.
