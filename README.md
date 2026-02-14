# ADHD Chore Autopilot

ADHD-friendly household chore planner for Obsidian with automated scheduling, quick-focus sessions, optional rewards, and Daily Notes sync.

## Features

- Auto-plan chores by frequency:
  - daily
  - every N days
  - weekly (preferred days)
  - monthly (day of month)
- Preloaded household chore templates (staggered schedule).
- Daily workload cap (`max daily minutes`) to reduce overload.
- Rollover handling for missed tasks.
- Weekly reset and rotation planning.
- Quick Focus mode (small, fast task set).
- Body Double timer with visible countdown + cancel.
- Optional gamification:
  - XP, levels, streaks
  - milestone badges
- Chore event logging to a vault note.
- Optional Daily Notes integration:
  - open selected day note
  - sync chores block to day note
  - sync whole week

## Commands

- `Open chore autopilot`
- `Plan today chores`
- `Quick focus chores`
- `Add chore template`
- `Start body double session`
- `Open badges and milestones`
- `Run weekly reset`
- `Open chore log note`
- `Sync this week chores to daily notes`
- `Create or open Chore Dashboard note`

## Settings

- Max daily minutes
- Auto-generate on startup
- Rollover missed chores
- Quick focus task count
- Enable streaks and rewards
- Show gamification chips
- Enable reminders
- Reminder times
- Log events to note
- Log note path
- Auto weekly reset
- Enable Daily Notes integration
- Auto-sync chore block when planning
- Daily notes folder override
- Daily note date format override
- Emit Tasks plugin format
- Chore task tag (optional)

## Daily Notes Sync

When syncing, the plugin writes a managed block in each daily note:

```md
<!-- ADHD_CHORES_START -->
## Chores
- [ ] ...
<!-- ADHD_CHORES_END -->
```

Re-syncing updates this block in place (no duplicate blocks).

## Tasks Plugin Compatibility

Task query integration is officially supported with the community **Tasks plugin** (`obsidian-tasks-plugin`).

Other task/kanban plugins (for example note-centric systems) may not index checklist lines the same way.

## Author

- Author: Piplup Stitched
- GitHub: https://github.com/piplupstitched
- Donate: https://ko-fi.com/piplupstitched
