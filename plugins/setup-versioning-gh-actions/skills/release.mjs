#!/usr/bin/env node
/**
 * Automatic semantic version tracker.
 *
 * Reads the commit history since the last "vX.Y.Z" tag, classifies each
 * commit by its Conventional Commit type (allowing a leading emoji, per
 * this project's commit style — see CLAUDE.md), decides the correct
 * semver bump, prepends a CHANGELOG.md entry, and creates a release
 * commit + annotated git tag. Also updates, when present:
 *   - package.json / package-lock.json
 *   - app/build.gradle(.kts)  (versionName + versionCode)
 *   - gradle.properties       (VERSION_NAME or version)
 *
 * Initial-development rules (major version 0):
 *   - The first release (no tag yet) is always 0.1.0.
 *   - A breaking change ("!") bumps MINOR instead of MAJOR.
 *   - Moving to 1.0.0 is a deliberate, manual step: create the v1.0.0 tag
 *     yourself once the public API is stable and you commit to backward
 *     compatibility. The script continues from there.
 *
 * Runs in CI on every push to main/master (.github/workflows/release.yml),
 * which pushes the release commit and tag afterwards.
 * Can also be run locally from the project root (paths are relative to the cwd):
 *        node .github/scripts/release.mjs
 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim()
}

function fail(message) {
  console.error(`\n✖ ${message}\n`)
  process.exit(1)
}

// --- 1. Safety checks -------------------------------------------------

const RELEASE_BRANCHES = ['main', 'master']
const currentBranch = run('git rev-parse --abbrev-ref HEAD')
if (!RELEASE_BRANCHES.includes(currentBranch)) {
  fail(
    `Releases can only be cut from ${RELEASE_BRANCHES.map((b) => `"${b}"`).join(' or ')} (currently on "${currentBranch}"). ` +
      `Merge your changes first, then run this from there.`,
  )
}

const status = run('git status --porcelain')
if (status) {
  fail('Working tree has uncommitted changes. Commit or stash them before running a release.')
}

// --- 2. Find commit range since last release tag -----------------------

let lastTag = ''
try {
  lastTag = run('git describe --tags --abbrev=0 --match "v*"')
} catch {
  lastTag = ''
}

const range = lastTag ? `${lastTag}..HEAD` : 'HEAD'
const rawLog = run(`git log ${range} --pretty=format:%s`)
const subjects = rawLog ? rawLog.split('\n').filter(Boolean) : []

if (subjects.length === 0) {
  console.log(
    lastTag
      ? `\nNothing to release — no commits since ${lastTag}.\n`
      : '\nNothing to release — no commits found.\n',
  )
  process.exit(0)
}

// --- 3. Parse each commit subject --------------------------------------
// Strips a leading emoji (or any leading run of non-word, non-space
// characters), then matches the Conventional Commit pattern
// `type[!][(scope)]: description`.

const CONVENTIONAL = /^(\w+)(!)?(?:\([^)]*\))?:\s*(.+)$/

function parseSubject(subject) {
  const stripped = subject.replace(/^[^\w\s]+\s*/u, '')
  const match = stripped.match(CONVENTIONAL)
  if (!match) {
    return { type: null, breaking: false, description: subject }
  }
  const [, type, breakingMark, description] = match
  return { type: type.toLowerCase(), breaking: Boolean(breakingMark), description }
}

const commits = subjects.map(parseSubject)

// --- 4. Decide the bump level -------------------------------------------

const FIX_TYPES = new Set(['fix', 'perf', 'security'])

const hasBreaking = commits.some((c) => c.breaking)
const hasFeat = commits.some((c) => c.type === 'feat')
const hasFix = commits.some((c) => c.type && FIX_TYPES.has(c.type))

let bump
let reason
if (hasBreaking) {
  bump = 'major'
  reason = 'breaking change ("!") found'
} else if (hasFeat) {
  bump = 'minor'
  reason = 'new feature ("feat") found'
} else if (hasFix) {
  bump = 'patch'
  reason = 'fix/perf/security commit found'
} else {
  bump = 'patch'
  reason = 'only maintenance commits (refactor/docs/style/test/chore/ci/build) — patch fallback'
}

// --- 5. Compute new version from last git tag --------------------------
// package.json is not required; the tag is the source of truth.
//
//  - No tag yet          -> 0.1.0 (initial development)
//  - Major is 0 + "!"    -> minor bump (stay in 0.x until you go stable manually)
//  - Major >= 1 + "!"    -> major bump (backward compatibility is broken)

const currentVersion = lastTag ? lastTag.replace(/^v/, '') : '0.0.0'
const [major, minor, patch] = currentVersion.split('.').map(Number)

let newVersion
if (!lastTag) {
  newVersion = '0.1.0'
  bump = 'initial'
  reason = 'first release (no previous tag) — initial development starts at 0.1.0'
} else if (bump === 'major' && major === 0) {
  newVersion = `0.${minor + 1}.0`
  reason += ' — on 0.x, bumping minor instead of major'
} else if (bump === 'major') {
  newVersion = `${major + 1}.0.0`
} else if (bump === 'minor') {
  newVersion = `${major}.${minor + 1}.0`
} else {
  newVersion = `${major}.${minor}.${patch + 1}`
}

// --- 6. Update package.json + package-lock.json if present -------------

const pkgPath = 'package.json'
const hasPkg = existsSync(pkgPath)
if (hasPkg) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  pkg.version = newVersion
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

// --- 6b. Update Kotlin/Android version files if present ----------------
// versionCode must be an integer that increases on every Play Store upload,
// so it is derived from the semver: major*10000 + minor*100 + patch.

const [nMajor, nMinor, nPatch] = newVersion.split('.').map(Number)
const versionCode = nMajor * 10000 + nMinor * 100 + nPatch
const kotlinFiles = []

function patchFile(path, replacers) {
  if (!existsSync(path)) return
  const original = readFileSync(path, 'utf8')
  const updated = replacers.reduce((text, [regex, value]) => text.replace(regex, value), original)
  if (updated !== original) {
    writeFileSync(path, updated)
    kotlinFiles.push(path)
  }
}

for (const gradlePath of ['app/build.gradle.kts', 'app/build.gradle']) {
  patchFile(gradlePath, [
    [/versionName\s*=?\s*"[^"]*"/, `versionName = "${newVersion}"`],
    [/versionCode\s*=?\s*\d+/, `versionCode = ${versionCode}`],
  ])
}
patchFile('gradle.properties', [
  [/^VERSION_NAME=.*$/m, `VERSION_NAME=${newVersion}`],
  [/^version=.*$/m, `version=${newVersion}`],
])

// --- 7. Build and prepend CHANGELOG.md entry ---------------------------

const groups = {
  Features: commits.filter((c) => c.type === 'feat'),
  Fixes: commits.filter((c) => c.type && FIX_TYPES.has(c.type)),
  Other: commits.filter((c) => !c.type || (c.type !== 'feat' && !FIX_TYPES.has(c.type))),
}

const today = new Date().toISOString().slice(0, 10)
let entry = `## v${newVersion} — ${today}\n\n`
for (const [heading, list] of Object.entries(groups)) {
  if (list.length === 0) continue
  entry += `### ${heading}\n\n`
  for (const c of list) {
    entry += `- ${c.description}\n`
  }
  entry += '\n'
}

const changelogPath = 'CHANGELOG.md'
const existing = existsSync(changelogPath) ? readFileSync(changelogPath, 'utf8') : '# Changelog\n\n'
const updatedChangelog = existing.startsWith('# Changelog')
  ? existing.replace('# Changelog\n\n', `# Changelog\n\n${entry}`)
  : `# Changelog\n\n${entry}${existing}`
writeFileSync(changelogPath, updatedChangelog)

// --- 8. Commit + tag ---------------------------------------------------

const filesToStage = [changelogPath]
if (hasPkg) {
  filesToStage.push(pkgPath)
}
filesToStage.push(...kotlinFiles)
run(`git add ${filesToStage.join(' ')}`)
run(`git commit -m "🔨 chore: release v${newVersion}"`)
run(`git tag -a v${newVersion} -m "v${newVersion}"`)

// --- 9. Summary --------------------------------------------------------

const bumpLabel = bump === 'initial' ? 'initial release' : `${bump} bump`

console.log(`
✔ Released v${newVersion} (${bumpLabel} — ${reason})
  ${currentVersion} → ${newVersion}
  ${subjects.length} commit${subjects.length === 1 ? '' : 's'} since ${lastTag || 'the beginning'}${
    kotlinFiles.length ? `\n  Updated: ${kotlinFiles.join(', ')} (versionCode ${versionCode})` : ''
  }

${process.env.CI ? '' : 'Next steps:\n  git push && git push --tags\n'}`)
