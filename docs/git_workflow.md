# Git Branching Workflow & Team Coordination Rules

To prevent merge conflicts during our fast-paced 4-day sprint, the team must adhere to the following git workflow rules:

---

## 1. Branching Model

We will use a simplified **Feature Branching** model. Do **never** commit directly to the `main` branch.

```
       [main] ───────────────────────────┬─────────────[Merge PR]─────>
                                         │                    ▲
       [feature/ui-reader] ──────────────┴──[Commit]──[PR]────┘
```

### Branch Naming Conventions:
* **AI & State Architect**: `feature/ai-state-<description>` (e.g., `feature/ai-state-gemini-integration`)
* **Components**: `feature/component-<description>` (e.g., `feature/component-reader-ruler`)
* **UX/UI & Styling**: `feature/style-<description>` (e.g., `feature/style-sepia-theme`)
* **Audio & Content**: `feature/audio-<description>` (e.g., `feature/audio-tts-syllables`)

---

## 2. Step-by-Step Git Workflow

### Step 2.1: Start of Day / Feature Creation
Before writing any code, pull the latest changes from the remote `main` branch to stay updated:
```bash
git checkout main
git pull origin main
git checkout -b feature/your-name-feature-description
```

### Step 2.2: Incremental Commits
Commit early and often. Write clear, imperative commit messages:
```bash
git add .
git commit -m "feat: add paragraph dimming filter in Reader.tsx"
```

### Step 2.3: Push & Create Pull Request (PR)
When your task is complete:
```bash
git push -u origin feature/your-name-feature-description
```
* Go to GitHub and open a Pull Request.
* Request at least one review from a teammate (highly recommend Lidetu or Debrup for code, Rakshita for UI, Riyanshika for API parameters).

### Step 2.4: Safe Merging
* If there are no conflicts, complete the merge.
* Delete the branch on GitHub and locally:
```bash
git checkout main
git pull origin main
git branch -d feature/your-name-feature-description
```

---

## 3. How to Resolve Merge Conflicts Safely
If your PR reports merge conflicts:
1. Fetch and merge `main` into your local feature branch first:
   ```bash
   git checkout feature/your-name-feature-description
   git merge main
   ```
2. Open VS Code. Under the **Source Control** panel, locate the conflict files.
3. Compare the **Current Change** (your code) vs **Incoming Change** (their code). Coordinate with the team member who wrote the conflicting file before selecting "Accept Merge".
4. Commit the resolved file and push:
   ```bash
   git add .
   git commit -m "chore: resolve merge conflicts with main"
   git push origin feature/your-name-feature-description
   ```

---

## 4. Communication Guidelines
* **Standups**: Message the group chat at the start of each day stating: (1) what you did yesterday, (2) what you are doing today, and (3) any blockers.
* **Component Handovers**: When completing a layout component, tag the styling lead (Rakshita) or state lead (Lidetu) to hook it into the live app layout.
