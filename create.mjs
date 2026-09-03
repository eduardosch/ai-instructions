#!/usr/bin/env node
/**
 * Scaffolds a new plugin folder under plugins/<name>/ and registers it
 * in .claude-plugin/marketplace.json.
 *
 * Usage: node create.mjs <plugin-name>
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const name = process.argv[2]

if (!name) {
  console.error('\n✖ Usage: node create.mjs <plugin-name>\n')
  process.exit(1)
}

if (!/^[a-z0-9-]+$/.test(name)) {
  console.error('\n✖ Plugin name must be lowercase letters, numbers, and hyphens only.\n')
  process.exit(1)
}

const pluginDir = join('plugins', name)
const skillDir = join(pluginDir, 'skills', name)

if (existsSync(pluginDir)) {
  console.error(`\n✖ plugins/${name}/ already exists.\n`)
  process.exit(1)
}

// --- Create folders -------------------------------------------------------

mkdirSync(skillDir, { recursive: true })

// --- SKILL.md -------------------------------------------------------------

writeFileSync(
  join(skillDir, 'SKILL.md'),
  `---
name: ${name}
description: TODO — one-line description of what this skill does.
---

## ${name}

TODO — describe what this skill does and when to invoke it.

## Instructions

When this skill is invoked, follow these steps:

1. TODO
`,
)

// --- README.md ------------------------------------------------------------

writeFileSync(
  join(pluginDir, 'README.md'),
  `# \`${name}\` Claude Skill

TODO — short description.

## Installation

Launch Claude Code first:

\`\`\`bash
claude
\`\`\`

Then from within Claude Code, add the marketplace and install the skill:

\`\`\`bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install ${name}@eduardosch-marketplace
\`\`\`

## Uninstalling

\`\`\`bash
/plugin uninstall ${name}

/plugin marketplace remove eduardosch-marketplace
\`\`\`

## Usage

\`\`\`
/${name}
\`\`\`
`,
)

// --- marketplace.json -----------------------------------------------------

const marketplacePath = '.claude-plugin/marketplace.json'
const marketplace = JSON.parse(readFileSync(marketplacePath, 'utf8'))

marketplace.plugins.push({
  name,
  description: 'TODO — one-line description.',
  version: '1.0.0',
  source: `./plugins/${name}`,
  strict: false,
  skills: [`./skills/${name}`],
  keywords: [],
  author: {
    name: 'Eduardo Schroder',
    email: 'dudu.schroder@gmail.com',
  },
  license: 'MIT',
  category: 'TODO',
})

writeFileSync(marketplacePath, JSON.stringify(marketplace, null, 2) + '\n')

// --- Summary --------------------------------------------------------------

console.log(`
✔ Plugin "${name}" created

  plugins/${name}/
  ├── README.md
  └── skills/${name}/
      └── SKILL.md

  Registered in .claude-plugin/marketplace.json

Next steps:
  1. Fill in the TODO sections in plugins/${name}/skills/${name}/SKILL.md
  2. Update the description and category in .claude-plugin/marketplace.json
  3. Commit with: /commit-message
`)
