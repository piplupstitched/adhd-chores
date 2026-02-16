var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ADHDChoresPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var VIEW_TYPE = "adhd-chores-view";
function fmtDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function fmtTime(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
function parseDate(s) {
  return /* @__PURE__ */ new Date(`${s}T00:00:00`);
}
function daysBetween(a, b) {
  if (!a || !b)
    return 0;
  const ms = parseDate(b).getTime() - parseDate(a).getTime();
  return Math.floor(ms / (1e3 * 60 * 60 * 24));
}
function addDays(s, days) {
  const d = parseDate(s);
  d.setDate(d.getDate() + days);
  return fmtDate(d);
}
function getWeekStart(dateStr) {
  const d = parseDate(dateStr);
  const dow = d.getDay();
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diffToMonday);
  return fmtDate(d);
}
function formatRemainingMs(ms) {
  const safe = Math.max(0, ms);
  const totalSec = Math.floor(safe / 1e3);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function dayCode(day) {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return names[day] || String(day);
}
function parseReminderTimes(csv) {
  return csv.split(",").map((v) => v.trim()).filter((v) => /^\d{2}:\d{2}$/.test(v));
}
function standardTemplates() {
  return [
    { id: "std-make-bed", name: "Make bed", room: "Bedroom", frequency: "daily", interval: 1, preferredDays: [], dayOfMonth: 1, estMinutes: 3, points: 4, active: true, createdAt: "2026-01-01" },
    { id: "std-kitchen-reset", name: "Kitchen reset and dishes", room: "Kitchen", frequency: "daily", interval: 1, preferredDays: [], dayOfMonth: 1, estMinutes: 12, points: 12, active: true, createdAt: "2026-01-01" },
    { id: "std-10min-tidy", name: "10-minute home tidy", room: "Whole Home", frequency: "daily", interval: 1, preferredDays: [], dayOfMonth: 1, estMinutes: 10, points: 10, active: true, createdAt: "2026-01-01" },
    { id: "std-bathroom-touchup", name: "Bathroom sink and mirror touch-up", room: "Bathroom", frequency: "every_n_days", interval: 3, preferredDays: [], dayOfMonth: 1, estMinutes: 10, points: 10, active: true, createdAt: "2026-01-01", anchorDate: "2026-01-02" },
    { id: "std-trash", name: "Empty trash and recycling", room: "Whole Home", frequency: "every_n_days", interval: 2, preferredDays: [], dayOfMonth: 1, estMinutes: 8, points: 8, active: true, createdAt: "2026-01-01", anchorDate: "2026-01-01" },
    { id: "std-laundry", name: "Laundry load", room: "Laundry", frequency: "weekly", interval: 1, preferredDays: [3, 0], dayOfMonth: 1, estMinutes: 15, points: 14, active: true, createdAt: "2026-01-01" },
    { id: "std-vacuum", name: "Vacuum floors", room: "Whole Home", frequency: "weekly", interval: 1, preferredDays: [6], dayOfMonth: 1, estMinutes: 25, points: 20, active: true, createdAt: "2026-01-01" },
    { id: "std-mop", name: "Mop hard floors", room: "Kitchen/Bathroom", frequency: "weekly", interval: 1, preferredDays: [0], dayOfMonth: 1, estMinutes: 20, points: 18, active: true, createdAt: "2026-01-01" },
    { id: "std-bathroom-deep", name: "Clean bathroom (toilet, tub, floor)", room: "Bathroom", frequency: "weekly", interval: 1, preferredDays: [1], dayOfMonth: 1, estMinutes: 30, points: 24, active: true, createdAt: "2026-01-01" },
    { id: "std-dust", name: "Dust surfaces", room: "Living Areas", frequency: "weekly", interval: 1, preferredDays: [4], dayOfMonth: 1, estMinutes: 15, points: 14, active: true, createdAt: "2026-01-01" },
    { id: "std-change-sheets", name: "Change bed sheets", room: "Bedroom", frequency: "weekly", interval: 1, preferredDays: [0], dayOfMonth: 1, estMinutes: 12, points: 12, active: true, createdAt: "2026-01-01" },
    { id: "std-fridge-check", name: "Fridge cleanout and wipe", room: "Kitchen", frequency: "weekly", interval: 1, preferredDays: [4], dayOfMonth: 1, estMinutes: 15, points: 14, active: true, createdAt: "2026-01-01" },
    { id: "std-filter-check", name: "HVAC filter check/replacement", room: "Home", frequency: "monthly", interval: 1, preferredDays: [], dayOfMonth: 1, estMinutes: 8, points: 10, active: true, createdAt: "2026-01-01" },
    { id: "std-deep-fridge", name: "Deep clean fridge shelves", room: "Kitchen", frequency: "monthly", interval: 1, preferredDays: [], dayOfMonth: 10, estMinutes: 25, points: 22, active: true, createdAt: "2026-01-01" },
    { id: "std-baseboards", name: "Wipe baseboards and doors", room: "Whole Home", frequency: "monthly", interval: 1, preferredDays: [], dayOfMonth: 20, estMinutes: 30, points: 24, active: true, createdAt: "2026-01-01" }
  ];
}
var DEFAULT_DATA = {
  templates: standardTemplates(),
  tasks: [],
  rewards: { xp: 0, level: 1, currentStreak: 0, longestStreak: 0, lastCompletionDate: "" },
  badges: [],
  settings: {
    maxDailyMinutes: 30,
    autoGenerateOnStartup: true,
    rolloverMissed: true,
    focusTaskCount: 3,
    enableRewards: true,
    showGamification: true,
    remindersEnabled: true,
    reminderTimesCsv: "09:00,14:00,19:00",
    logToNote: true,
    logNotePath: "TaskNotes/Chore Log.md",
    autoWeeklyReset: true,
    dailyNotesIntegrationEnabled: true,
    syncDailyBlockOnPlan: false,
    dailyNotesFolder: "",
    dailyNotesFormat: "",
    emitTasksPluginFormat: true,
    choreTaskTag: ""
  },
  meta: { lastWeeklyResetDate: "", lastPlanDate: "", bodyDoubleEndsAt: "", bodyDoubleDurationMinutes: 0 }
};
function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
function defaultBadgeCatalog() {
  return [
    { id: "quick-win", label: "Quick Win", description: "Complete a 5-minute or shorter chore", targetType: "quick", targetValue: 1 },
    { id: "tasks-10", label: "Momentum", description: "Complete 10 chores", targetType: "tasks", targetValue: 10 },
    { id: "tasks-50", label: "Consistency", description: "Complete 50 chores", targetType: "tasks", targetValue: 50 },
    { id: "tasks-100", label: "House Hero", description: "Complete 100 chores", targetType: "tasks", targetValue: 100 },
    { id: "streak-3", label: "3-Day Streak", description: "Complete chores 3 days in a row", targetType: "streak", targetValue: 3 },
    { id: "streak-7", label: "7-Day Streak", description: "Complete chores 7 days in a row", targetType: "streak", targetValue: 7 },
    { id: "streak-14", label: "14-Day Streak", description: "Complete chores 14 days in a row", targetType: "streak", targetValue: 14 },
    { id: "level-2", label: "Level 2", description: "Reach level 2", targetType: "level", targetValue: 2 },
    { id: "level-3", label: "Level 3", description: "Reach level 3", targetType: "level", targetValue: 3 },
    { id: "level-5", label: "Level 5", description: "Reach level 5", targetType: "level", targetValue: 5 },
    { id: "level-8", label: "Level 8", description: "Reach level 8", targetType: "level", targetValue: 8 },
    { id: "level-10", label: "Level 10", description: "Reach level 10", targetType: "level", targetValue: 10 }
  ];
}
var AddChoreModal = class extends import_obsidian.Modal {
  constructor(app, onSave) {
    super(app);
    this.nameVal = "";
    this.roomVal = "";
    this.frequencyVal = "weekly";
    this.intervalVal = 1;
    this.preferredDaysVal = "";
    this.dayOfMonthVal = 1;
    this.estMinutesVal = 10;
    this.pointsVal = 10;
    this.onSave = onSave;
  }
  onOpen() {
    this.titleEl.setText("Add Chore Template");
    const { contentEl } = this;
    contentEl.empty();
    new import_obsidian.Setting(contentEl).setName("Name").addText((t) => t.setPlaceholder("Wipe kitchen counters").onChange((v) => this.nameVal = v.trim()));
    new import_obsidian.Setting(contentEl).setName("Room").addText((t) => t.setPlaceholder("Kitchen").onChange((v) => this.roomVal = v.trim()));
    new import_obsidian.Setting(contentEl).setName("Frequency").addDropdown((d) => {
      d.addOption("daily", "Daily");
      d.addOption("every_n_days", "Every N Days");
      d.addOption("weekly", "Weekly");
      d.addOption("monthly", "Monthly");
      d.setValue(this.frequencyVal);
      d.onChange((v) => this.frequencyVal = v);
    });
    new import_obsidian.Setting(contentEl).setName("Interval").setDesc("For every N days").addText((t) => t.setValue(String(this.intervalVal)).onChange((v) => {
      const n = parseInt(v || "1", 10);
      this.intervalVal = Number.isFinite(n) && n > 0 ? n : 1;
    }));
    new import_obsidian.Setting(contentEl).setName("Weekly days").setDesc("0-6 comma list (0=Sun)").addText((t) => t.setPlaceholder("1,4").onChange((v) => this.preferredDaysVal = v.trim()));
    new import_obsidian.Setting(contentEl).setName("Monthly day").setDesc("1-28").addText((t) => t.setValue(String(this.dayOfMonthVal)).onChange((v) => {
      const n = parseInt(v || "1", 10);
      this.dayOfMonthVal = Number.isFinite(n) ? Math.min(28, Math.max(1, n)) : 1;
    }));
    new import_obsidian.Setting(contentEl).setName("Estimated minutes").addText((t) => t.setValue(String(this.estMinutesVal)).onChange((v) => {
      const n = parseInt(v || "10", 10);
      this.estMinutesVal = Number.isFinite(n) ? Math.max(1, n) : 10;
    }));
    new import_obsidian.Setting(contentEl).setName("Points").addText((t) => t.setValue(String(this.pointsVal)).onChange((v) => {
      const n = parseInt(v || "10", 10);
      this.pointsVal = Number.isFinite(n) ? Math.max(1, n) : 10;
    }));
    const row = contentEl.createDiv();
    const save = row.createEl("button", { text: "Save template" });
    save.addEventListener("click", () => {
      void (async () => {
        if (!this.nameVal) {
          new import_obsidian.Notice("Please enter a chore name.");
          return;
        }
        const preferredDays = this.preferredDaysVal.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => Number.isFinite(n) && n >= 0 && n <= 6);
        const template = {
          id: `custom-${Date.now()}`,
          name: this.nameVal,
          room: this.roomVal || "Home",
          frequency: this.frequencyVal,
          interval: this.intervalVal,
          preferredDays,
          dayOfMonth: this.dayOfMonthVal,
          estMinutes: this.estMinutesVal,
          points: this.pointsVal,
          active: true,
          createdAt: fmtDate(/* @__PURE__ */ new Date())
        };
        await this.onSave(template);
        this.close();
      })().catch(() => {
      });
    });
    const cancel = row.createEl("button", { text: "Cancel" });
    cancel.addEventListener("click", () => this.close());
  }
};
var BodyDoubleModal = class extends import_obsidian.Modal {
  constructor(app, onPick) {
    super(app);
    this.onPick = onPick;
  }
  onOpen() {
    this.titleEl.setText("Body Double Session");
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("p", { text: "Pick a focus sprint duration.", cls: "adhd-empty" });
    const row = contentEl.createDiv();
    for (const minutes of [10, 15, 25]) {
      const btn = row.createEl("button", { text: `${minutes} min` });
      btn.addEventListener("click", () => {
        this.onPick(minutes);
        this.close();
      });
    }
  }
};
var BadgesModal = class extends import_obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    this.titleEl.setText("Badges and milestones");
    const { contentEl } = this;
    contentEl.empty();
    const catalog = this.plugin.getBadgeCatalog();
    const unlockedCount = catalog.filter((c) => this.plugin.getUnlockedBadge(c.id) !== null).length;
    contentEl.createEl("p", {
      text: `${unlockedCount}/${catalog.length} unlocked`,
      cls: "adhd-empty"
    });
    for (const badge of catalog) {
      const unlocked = this.plugin.getUnlockedBadge(badge.id);
      const row = contentEl.createDiv("adhd-badge-row");
      if (unlocked)
        row.addClass("unlocked");
      const title = row.createDiv("adhd-badge-title");
      title.setText(badge.label);
      row.createDiv({
        cls: "adhd-badge-desc",
        text: badge.description
      });
      if (unlocked) {
        row.createDiv({
          cls: "adhd-badge-progress",
          text: `Unlocked ${unlocked.unlockedAt.slice(0, 10)}`
        });
      } else {
        const progress = this.plugin.getBadgeProgress(badge);
        row.createDiv({
          cls: "adhd-badge-progress",
          text: `Progress: ${progress.current}/${progress.target}`
        });
      }
    }
  }
};
var ADHDChoresView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.selectedDate = null;
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "Chore Autopilot";
  }
  getIcon() {
    return "check-square";
  }
  onOpen() {
    this.render();
  }
  render() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("adhd-chores-view");
    const header = container.createDiv("adhd-chores-header");
    header.createEl("h3", { text: "Chore autopilot" });
    const actions = header.createDiv("adhd-chores-actions");
    const planBtn = actions.createEl("button", { text: "Plan today" });
    planBtn.addEventListener("click", () => {
      void this.plugin.generateTodayPlan(true);
    });
    const focusBtn = actions.createEl("button", { text: "Quick focus" });
    focusBtn.addEventListener("click", () => {
      void this.plugin.quickFocusMode();
    });
    const bodyBtn = actions.createEl("button", { text: "Body double" });
    bodyBtn.addEventListener("click", () => this.plugin.openBodyDoubleModal());
    const badgesBtn = actions.createEl("button", { text: "Badges" });
    badgesBtn.addEventListener("click", () => this.plugin.openBadgesModal());
    const resetBtn = actions.createEl("button", { text: "Weekly reset" });
    resetBtn.addEventListener("click", () => {
      void this.plugin.runWeeklyReset(true);
    });
    const addBtn = actions.createEl("button", { text: "Add chore" });
    addBtn.addEventListener("click", () => this.plugin.openAddTemplateModal());
    const today = this.plugin.todayStr();
    if (!this.selectedDate)
      this.selectedDate = today;
    const weekStart = getWeekStart(today);
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    if (!weekDates.includes(this.selectedDate))
      this.selectedDate = today;
    const cal = container.createDiv("adhd-calendar-strip");
    for (const date of weekDates) {
      const pending = this.plugin.getTasksForDate(date).filter((t) => t.status === "pending").length;
      const done = this.plugin.getCompletedForDate(date).length;
      const btn = cal.createEl("button", {
        cls: "adhd-cal-day",
        text: `${dayCode(parseDate(date).getDay()).slice(0, 1)} ${date.slice(8)}`
      });
      if (date === today)
        btn.addClass("today");
      if (date === this.selectedDate)
        btn.addClass("selected");
      btn.setAttribute("title", `${pending} pending, ${done} done`);
      btn.addEventListener("click", () => {
        this.selectedDate = date;
        this.render();
      });
    }
    const viewDate = this.selectedDate || today;
    const viewPending = this.plugin.getTasksForDate(viewDate).filter((t) => t.status === "pending").length;
    const viewDone = this.plugin.getCompletedForDate(viewDate).length;
    const calActions = container.createDiv("adhd-calendar-actions");
    calActions.createEl("span", {
      cls: "adhd-calendar-selected",
      text: `${viewDate} | ${viewPending} pending, ${viewDone} done`
    });
    const openDayNoteBtn = calActions.createEl("button", { text: "Open day note" });
    openDayNoteBtn.addEventListener("click", () => {
      void this.plugin.openDailyNoteForDate(viewDate);
    });
    const syncDayNoteBtn = calActions.createEl("button", { text: "Sync chores" });
    syncDayNoteBtn.addEventListener("click", () => {
      void this.plugin.syncDateToDailyNote(viewDate);
    });
    const syncWeekBtn = calActions.createEl("button", { text: "Sync week" });
    syncWeekBtn.addEventListener("click", () => {
      void this.plugin.syncWeekToDailyNotes();
    });
    const todayTasks = this.plugin.getTasksForDate(viewDate);
    const pendingToday = todayTasks.filter((t) => t.status === "pending");
    const doneToday = this.plugin.getCompletedForDate(viewDate).length;
    if (this.plugin.data.settings.showGamification) {
      const chips = container.createDiv("adhd-chip-row");
      chips.createDiv({ cls: "adhd-chip", text: `${pendingToday.length} pending` });
      chips.createDiv({ cls: "adhd-chip", text: `${doneToday} done today` });
      if (this.plugin.data.settings.enableRewards) {
        chips.createDiv({ cls: "adhd-chip", text: `lvl ${this.plugin.data.rewards.level}` });
        chips.createDiv({ cls: "adhd-chip", text: `${this.plugin.data.rewards.xp} xp` });
        chips.createDiv({ cls: "adhd-chip", text: `${this.plugin.data.rewards.currentStreak} day streak` });
        chips.createDiv({ cls: "adhd-chip", text: `${this.plugin.data.badges.length} badges` });
      }
    }
    if (this.plugin.data.settings.showGamification && this.plugin.data.badges.length > 0) {
      container.createEl("div", { cls: "adhd-section-title", text: "Recent badges" });
      const badgesRow = container.createDiv("adhd-chip-row");
      for (const badge of this.plugin.data.badges.slice(-3).reverse()) {
        const chip = badgesRow.createDiv({ cls: "adhd-chip adhd-badge-chip", text: badge.label });
        chip.setAttribute("title", `${badge.description} (${badge.unlockedAt.slice(0, 10)})`);
      }
    }
    if (this.plugin.isBodyDoubleActive()) {
      const timerRow = container.createDiv("adhd-body-timer");
      timerRow.createEl("span", { text: "Body double" });
      timerRow.createEl("strong", {
        cls: "adhd-body-timer-value",
        text: this.plugin.getBodyDoubleRemainingLabel()
      });
      const cancel = timerRow.createEl("button", { text: "Cancel" });
      cancel.addEventListener("click", () => {
        void this.plugin.cancelBodyDoubleSession();
      });
    }
    container.createEl("div", { cls: "adhd-section-title", text: `Day plan (${viewDate})` });
    if (todayTasks.length === 0) {
      container.createEl("div", { cls: "adhd-empty", text: 'No chores scheduled. Click "Plan today".' });
    } else {
      for (const task of todayTasks) {
        const row = container.createDiv("adhd-task-row");
        if (task.status === "done")
          row.addClass("done");
        const checkbox = row.createEl("input", { type: "checkbox" });
        checkbox.checked = task.status === "done";
        checkbox.disabled = task.status === "done";
        checkbox.addEventListener("change", () => {
          if (checkbox.checked)
            void this.plugin.completeTask(task.id);
        });
        const main = row.createDiv("adhd-task-main");
        main.createEl("div", { cls: "adhd-task-title", text: task.title });
        main.createEl("div", { cls: "adhd-task-meta", text: `${task.room} | ${task.estMinutes}m | ${task.points} pts` });
        if (task.status === "pending") {
          const snooze = row.createEl("button", { text: "Snooze +1d" });
          snooze.addEventListener("click", () => {
            void this.plugin.snoozeTask(task.id, 1);
          });
        }
      }
    }
    const overdue = this.plugin.getOverdueTasks(today);
    container.createEl("div", { cls: "adhd-section-title", text: "Overdue" });
    if (overdue.length === 0) {
      container.createEl("div", { cls: "adhd-empty", text: "Nothing overdue." });
    } else {
      for (const task of overdue.slice(0, 8)) {
        const row = container.createDiv("adhd-task-row");
        const main = row.createDiv("adhd-task-main");
        main.createEl("div", { cls: "adhd-task-title", text: task.title });
        main.createEl("div", { cls: "adhd-task-meta", text: `due ${task.dueDate} | ${task.estMinutes}m` });
      }
    }
  }
};
var ADHDChoresSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("ADHD chore autopilot").setHeading();
    containerEl.createEl("p", {
      text: "Task query integration officially supports the community Tasks plugin (obsidian-tasks-plugin). Other task/kanban plugins may not index checklist lines the same way.",
      cls: "adhd-empty"
    });
    new import_obsidian.Setting(containerEl).setName("Max daily minutes").addText((t) => t.setValue(String(this.plugin.data.settings.maxDailyMinutes)).onChange(async (v) => {
      const n = parseInt(v || "30", 10);
      this.plugin.data.settings.maxDailyMinutes = Number.isFinite(n) ? Math.max(5, n) : 30;
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Auto-generate on startup").addToggle((t) => t.setValue(this.plugin.data.settings.autoGenerateOnStartup).onChange(async (v) => {
      this.plugin.data.settings.autoGenerateOnStartup = v;
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Rollover missed chores").addToggle((t) => t.setValue(this.plugin.data.settings.rolloverMissed).onChange(async (v) => {
      this.plugin.data.settings.rolloverMissed = v;
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Quick focus task count").addText((t) => t.setValue(String(this.plugin.data.settings.focusTaskCount)).onChange(async (v) => {
      const n = parseInt(v || "3", 10);
      this.plugin.data.settings.focusTaskCount = Number.isFinite(n) ? Math.min(6, Math.max(1, n)) : 3;
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Enable streaks and rewards").setDesc("Optional. Turn this off anytime.").addToggle((t) => t.setValue(this.plugin.data.settings.enableRewards).onChange(async (v) => {
      this.plugin.data.settings.enableRewards = v;
      await this.plugin.savePluginData();
      this.plugin.refreshView();
    }));
    new import_obsidian.Setting(containerEl).setName("Show gamification chips").addToggle((t) => t.setValue(this.plugin.data.settings.showGamification).onChange(async (v) => {
      this.plugin.data.settings.showGamification = v;
      await this.plugin.savePluginData();
      this.plugin.refreshView();
    }));
    new import_obsidian.Setting(containerEl).setName("Reminders").setHeading();
    new import_obsidian.Setting(containerEl).setName("Enable reminders").addToggle((t) => t.setValue(this.plugin.data.settings.remindersEnabled).onChange(async (v) => {
      this.plugin.data.settings.remindersEnabled = v;
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Reminder times").setDesc("Comma-separated 24h times, e.g. 09:00,14:00,19:00").addText((t) => t.setValue(this.plugin.data.settings.reminderTimesCsv).onChange(async (v) => {
      this.plugin.data.settings.reminderTimesCsv = v.trim();
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Logging").setHeading();
    new import_obsidian.Setting(containerEl).setName("Log events to note").addToggle((t) => t.setValue(this.plugin.data.settings.logToNote).onChange(async (v) => {
      this.plugin.data.settings.logToNote = v;
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Log note path").addText((t) => t.setValue(this.plugin.data.settings.logNotePath).onChange(async (v) => {
      this.plugin.data.settings.logNotePath = v.trim() || "TaskNotes/Chore Log.md";
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Weekly reset").setHeading();
    new import_obsidian.Setting(containerEl).setName("Auto weekly reset").setDesc("Runs on Mondays at startup.").addToggle((t) => t.setValue(this.plugin.data.settings.autoWeeklyReset).onChange(async (v) => {
      this.plugin.data.settings.autoWeeklyReset = v;
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Daily notes integration").setHeading();
    new import_obsidian.Setting(containerEl).setName("Enable Daily Notes integration").setDesc("Use selected date actions to open/sync daily notes.").addToggle((t) => t.setValue(this.plugin.data.settings.dailyNotesIntegrationEnabled).onChange(async (v) => {
      this.plugin.data.settings.dailyNotesIntegrationEnabled = v;
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Auto-sync chore block when planning").setDesc("Writes/updates a chore block in each planned day note.").addToggle((t) => t.setValue(this.plugin.data.settings.syncDailyBlockOnPlan).onChange(async (v) => {
      this.plugin.data.settings.syncDailyBlockOnPlan = v;
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Daily notes folder override").setDesc("Leave blank to use core Daily Notes plugin folder.").addText((t) => t.setValue(this.plugin.data.settings.dailyNotesFolder).onChange(async (v) => {
      this.plugin.data.settings.dailyNotesFolder = v.trim();
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Daily note date format override").setDesc("Leave blank to use core Daily Notes format. Example: YYYY-MM-DD").addText((t) => t.setValue(this.plugin.data.settings.dailyNotesFormat).onChange(async (v) => {
      this.plugin.data.settings.dailyNotesFormat = v.trim();
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Emit Tasks plugin format").setDesc("Appends optional tag + due date emoji so Tasks/Agenda plugins can index chores.").addToggle((t) => t.setValue(this.plugin.data.settings.emitTasksPluginFormat).onChange(async (v) => {
      this.plugin.data.settings.emitTasksPluginFormat = v;
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Chore task tag").setDesc("Optional. Leave blank for no tag. Example: #task/chore").addText((t) => t.setValue(this.plugin.data.settings.choreTaskTag).onChange(async (v) => {
      this.plugin.data.settings.choreTaskTag = v.trim();
      await this.plugin.savePluginData();
    }));
    new import_obsidian.Setting(containerEl).setName("Chore templates").setHeading();
    for (const template of this.plugin.data.templates) {
      new import_obsidian.Setting(containerEl).setName(`${template.name} (${template.room})`).setDesc(this.plugin.describeTemplate(template)).addToggle((t) => t.setValue(template.active).onChange(async (v) => {
        template.active = v;
        await this.plugin.savePluginData();
        this.display();
      })).addButton((b) => b.setButtonText("Delete").setWarning().onClick(() => {
        void (async () => {
          this.plugin.data.templates = this.plugin.data.templates.filter((t) => t.id !== template.id);
          this.plugin.data.tasks = this.plugin.data.tasks.filter((task) => task.templateId !== template.id);
          await this.plugin.savePluginData();
          this.display();
          this.plugin.refreshView();
        })().catch(() => {
        });
      }));
    }
    new import_obsidian.Setting(containerEl).addButton((b) => b.setButtonText("Add chore template").setCta().onClick(() => this.plugin.openAddTemplateModal()));
  }
};
var ADHDChoresPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.data = cloneDefaults();
    this.reminderTickId = null;
    this.notifiedReminderKeys = /* @__PURE__ */ new Set();
    this.bodyDoubleTimeoutId = null;
    this.bodyDoubleDisplayTickId = null;
    this.bodyDoubleStatusEl = null;
  }
  async onload() {
    await this.loadPluginData();
    this.migrateTemplateLibrary();
    this.registerView(VIEW_TYPE, (leaf) => new ADHDChoresView(leaf, this));
    this.addSettingTab(new ADHDChoresSettingTab(this.app, this));
    this.addRibbonIcon("check-square", "Open Chore Autopilot", () => {
      void this.activateView();
    });
    this.bodyDoubleStatusEl = this.addStatusBarItem();
    this.updateBodyDoubleStatus();
    this.addCommand({ id: "open-chore-autopilot", name: "Open chore autopilot", callback: () => {
      void this.activateView();
    } });
    this.addCommand({ id: "plan-today-chores", name: "Plan today chores", callback: () => {
      void this.generateTodayPlan(true);
    } });
    this.addCommand({ id: "quick-focus-chores", name: "Quick focus chores", callback: () => {
      void this.quickFocusMode();
    } });
    this.addCommand({ id: "add-chore-template", name: "Add chore template", callback: () => this.openAddTemplateModal() });
    this.addCommand({ id: "start-body-double-session", name: "Start body double session", callback: () => this.openBodyDoubleModal() });
    this.addCommand({ id: "open-chore-badges", name: "Open badges and milestones", callback: () => this.openBadgesModal() });
    this.addCommand({ id: "weekly-reset-chores", name: "Run weekly reset", callback: () => {
      void this.runWeeklyReset(true);
    } });
    this.addCommand({ id: "open-chore-log-note", name: "Open chore log note", callback: () => this.openLogNote() });
    this.addCommand({ id: "sync-week-to-daily-notes", name: "Sync this week chores to daily notes", callback: () => {
      void this.syncWeekToDailyNotes();
    } });
    this.addCommand({ id: "create-chore-dashboard-note", name: "Create or open chore dashboard note", callback: () => {
      void this.createOrOpenChoreDashboard();
    } });
    this.app.workspace.onLayoutReady(() => {
      void (async () => {
        const today = this.todayStr();
        if (this.data.settings.autoWeeklyReset && parseDate(today).getDay() === 1 && this.data.meta.lastWeeklyResetDate !== today) {
          await this.runWeeklyReset(false);
        } else if (this.data.settings.autoGenerateOnStartup) {
          await this.generateTodayPlan(false);
        }
      })().catch(() => {
      });
    });
    this.startReminderTicker();
    this.restoreBodyDoubleSessionIfNeeded();
  }
  onunload() {
    if (this.reminderTickId !== null)
      window.clearInterval(this.reminderTickId);
    if (this.bodyDoubleTimeoutId !== null)
      window.clearTimeout(this.bodyDoubleTimeoutId);
    if (this.bodyDoubleDisplayTickId !== null)
      window.clearInterval(this.bodyDoubleDisplayTickId);
  }
  todayStr() {
    return fmtDate(/* @__PURE__ */ new Date());
  }
  getTasksForDate(date) {
    return this.data.tasks.filter((t) => t.dueDate === date).sort((a, b) => {
      if (a.status !== b.status)
        return a.status === "pending" ? -1 : 1;
      return a.estMinutes - b.estMinutes;
    });
  }
  getOverdueTasks(today) {
    return this.data.tasks.filter((t) => t.status === "pending" && t.dueDate < today).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }
  getCompletedForDate(date) {
    return this.data.tasks.filter((t) => t.status === "done" && (t.completedAt || "").startsWith(date));
  }
  describeTemplate(template) {
    if (template.frequency === "daily")
      return `daily | ${template.estMinutes}m`;
    if (template.frequency === "every_n_days")
      return `every ${template.interval} days | ${template.estMinutes}m`;
    if (template.frequency === "weekly") {
      const days = template.preferredDays.length > 0 ? template.preferredDays.map(dayCode).join(", ") : "any";
      return `weekly (${days}) | ${template.estMinutes}m`;
    }
    return `monthly day ${template.dayOfMonth} | ${template.estMinutes}m`;
  }
  openAddTemplateModal() {
    new AddChoreModal(this.app, async (template) => {
      this.data.templates.push(template);
      await this.savePluginData();
      await this.generateTodayPlan(false);
      await this.logEvent(`Added template: ${template.name}`);
      new import_obsidian.Notice(`Added "${template.name}"`);
    }).open();
  }
  openBodyDoubleModal() {
    new BodyDoubleModal(this.app, (minutes) => {
      void this.startBodyDoubleSession(minutes);
    }).open();
  }
  isBodyDoubleActive() {
    return this.getBodyDoubleRemainingMs() > 0;
  }
  getBodyDoubleRemainingMs() {
    const end = this.data.meta.bodyDoubleEndsAt;
    if (!end)
      return 0;
    const ms = new Date(end).getTime() - Date.now();
    return Math.max(0, ms);
  }
  getBodyDoubleRemainingLabel() {
    return formatRemainingMs(this.getBodyDoubleRemainingMs());
  }
  openBadgesModal() {
    new BadgesModal(this.app, this).open();
  }
  getUnlockedBadge(id) {
    return this.data.badges.find((b) => b.id === id) || null;
  }
  getBadgeCatalog() {
    const catalog = [...defaultBadgeCatalog()];
    const seen = new Set(catalog.map((c) => c.id));
    for (const unlocked of this.data.badges) {
      if (seen.has(unlocked.id))
        continue;
      if (unlocked.id.startsWith("level-")) {
        const level = parseInt(unlocked.id.replace("level-", ""), 10);
        if (Number.isFinite(level)) {
          catalog.push({
            id: unlocked.id,
            label: unlocked.label || `Level ${level}`,
            description: unlocked.description || `Reached level ${level}`,
            targetType: "level",
            targetValue: level
          });
        }
      }
    }
    catalog.sort((a, b) => {
      const wa = a.targetType === "quick" ? 0 : a.targetType === "tasks" ? 1 : a.targetType === "streak" ? 2 : 3;
      const wb = b.targetType === "quick" ? 0 : b.targetType === "tasks" ? 1 : b.targetType === "streak" ? 2 : 3;
      if (wa !== wb)
        return wa - wb;
      return a.targetValue - b.targetValue;
    });
    return catalog;
  }
  getBadgeProgress(item) {
    if (item.targetType === "level") {
      return { current: this.data.rewards.level, target: item.targetValue };
    }
    if (item.targetType === "tasks") {
      return { current: this.data.tasks.filter((t) => t.status === "done").length, target: item.targetValue };
    }
    if (item.targetType === "streak") {
      return { current: this.data.rewards.currentStreak, target: item.targetValue };
    }
    const hasQuick = this.data.badges.some((b) => b.id === "quick-win");
    return { current: hasQuick ? 1 : 0, target: 1 };
  }
  async startBodyDoubleSession(minutes) {
    if (this.bodyDoubleTimeoutId !== null) {
      window.clearTimeout(this.bodyDoubleTimeoutId);
      this.bodyDoubleTimeoutId = null;
    }
    const end = new Date(Date.now() + minutes * 60 * 1e3);
    this.data.meta.bodyDoubleEndsAt = end.toISOString();
    this.data.meta.bodyDoubleDurationMinutes = minutes;
    await this.savePluginData();
    this.startBodyDoubleDisplayTicker();
    this.scheduleBodyDoubleCompletion();
    new import_obsidian.Notice(`Body double started: ${minutes} minutes.`);
    await this.logEvent(`Started body double session (${minutes}m)`);
    this.refreshView();
  }
  async cancelBodyDoubleSession() {
    if (!this.data.meta.bodyDoubleEndsAt)
      return;
    if (this.bodyDoubleTimeoutId !== null) {
      window.clearTimeout(this.bodyDoubleTimeoutId);
      this.bodyDoubleTimeoutId = null;
    }
    this.data.meta.bodyDoubleEndsAt = "";
    this.data.meta.bodyDoubleDurationMinutes = 0;
    await this.savePluginData();
    this.stopBodyDoubleDisplayTicker();
    this.updateBodyDoubleStatus();
    await this.logEvent("Cancelled body double session");
    new import_obsidian.Notice("Body double cancelled.");
    this.refreshView();
  }
  async quickFocusMode() {
    const today = this.todayStr();
    if (this.getTasksForDate(today).length === 0)
      await this.generateTodayPlan(false);
    const tasks = this.getTasksForDate(today).filter((t) => t.status === "pending").sort((a, b) => a.estMinutes - b.estMinutes).slice(0, this.data.settings.focusTaskCount);
    if (tasks.length === 0) {
      new import_obsidian.Notice("Quick Focus: no pending chores right now.");
      return;
    }
    const list = tasks.map((t) => `- ${t.title} (${t.estMinutes}m)`).join("\n");
    new import_obsidian.Notice(`Quick Focus (${tasks.length}):
${list}`, 9e3);
    await this.logEvent(`Quick Focus suggested ${tasks.length} tasks`);
    this.refreshView();
  }
  async completeTask(taskId) {
    const task = this.data.tasks.find((t) => t.id === taskId);
    if (!task || task.status === "done")
      return;
    const levelBefore = this.data.rewards.level;
    task.status = "done";
    task.completedAt = (/* @__PURE__ */ new Date()).toISOString();
    const template = this.data.templates.find((t) => t.id === task.templateId);
    if (template)
      template.lastCompleted = this.todayStr();
    if (this.data.settings.enableRewards)
      this.applyRewards(task.points);
    await this.checkMilestones(task, levelBefore);
    await this.savePluginData();
    if (this.data.settings.syncDailyBlockOnPlan) {
      await this.syncDateToDailyNote(task.dueDate, false);
    }
    await this.logEvent(`Completed: ${task.title} (+${task.points} pts)`);
    this.refreshView();
    new import_obsidian.Notice(`Completed: ${task.title}`);
  }
  async snoozeTask(taskId, days = 1) {
    const task = this.data.tasks.find((t) => t.id === taskId);
    if (!task || task.status === "done")
      return;
    const oldDate = task.dueDate;
    task.dueDate = addDays(task.dueDate, days);
    await this.savePluginData();
    if (this.data.settings.syncDailyBlockOnPlan) {
      await this.syncDateToDailyNote(oldDate, false);
      await this.syncDateToDailyNote(task.dueDate, false);
    }
    await this.logEvent(`Snoozed: ${task.title} to ${task.dueDate}`);
    this.refreshView();
  }
  async generateTodayPlan(showNotice = true) {
    const today = this.todayStr();
    await this.generatePlanForDate(today);
    if (showNotice) {
      const count = this.getTasksForDate(today).filter((t) => t.status === "pending").length;
      new import_obsidian.Notice(`Planned ${count} chores for today.`);
    }
  }
  async runWeeklyReset(showNotice = true) {
    const today = this.todayStr();
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      weekDates.push(addDays(today, i));
    }
    const weekSet = new Set(weekDates);
    const pendingBefore = this.data.tasks.filter((t) => t.status === "pending" && weekSet.has(t.dueDate)).length;
    this.data.tasks = this.data.tasks.filter((t) => !(t.status === "pending" && weekSet.has(t.dueDate)));
    let pendingAfter = 0;
    for (const date of weekDates) {
      await this.generatePlanForDate(date, false);
      pendingAfter += this.data.tasks.filter((t) => t.status === "pending" && t.dueDate === date).length;
    }
    this.data.meta.lastWeeklyResetDate = today;
    await this.savePluginData();
    await this.logEvent("Ran weekly reset and rotation");
    this.refreshView();
    if (showNotice)
      new import_obsidian.Notice(`Weekly reset complete: ${pendingAfter} chores planned (replaced ${pendingBefore}).`);
  }
  async generatePlanForDate(date, writeLog = true) {
    if (this.data.settings.rolloverMissed && date === this.todayStr())
      this.rolloverMissedTasks(date);
    for (const template of this.data.templates.filter((t) => t.active)) {
      if (!this.shouldScheduleTemplateOnDate(template, date))
        continue;
      const exists = this.data.tasks.some((t) => t.templateId === template.id && t.dueDate === date);
      if (exists)
        continue;
      this.data.tasks.push({
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        templateId: template.id,
        title: template.name,
        room: template.room,
        dueDate: date,
        estMinutes: template.estMinutes,
        points: template.points,
        status: "pending"
      });
    }
    this.dedupeTasks();
    this.applyDailyCap(date);
    this.pruneHistory(date);
    this.data.meta.lastPlanDate = date;
    await this.savePluginData();
    if (this.data.settings.syncDailyBlockOnPlan) {
      await this.syncDateToDailyNote(date, false);
    }
    if (writeLog)
      await this.logEvent(`Auto-planned chores for ${date}`);
    this.refreshView();
  }
  shouldScheduleTemplateOnDate(template, date) {
    const day = parseDate(date);
    if (template.frequency === "daily")
      return true;
    if (template.frequency === "every_n_days") {
      if (template.lastCompleted) {
        return daysBetween(template.lastCompleted, date) >= Math.max(1, template.interval);
      }
      const anchor = template.anchorDate || template.createdAt || "2026-01-01";
      const diff = daysBetween(anchor, date);
      return diff >= 0 && diff % Math.max(1, template.interval) === 0;
    }
    if (template.frequency === "weekly") {
      const days = template.preferredDays.length > 0 ? template.preferredDays : [day.getDay()];
      if (!days.includes(day.getDay()))
        return false;
      const doneRecently = this.data.tasks.some((t) => {
        if (t.templateId !== template.id || t.status !== "done")
          return false;
        const completedDay = (t.completedAt || "").slice(0, 10);
        if (!completedDay)
          return false;
        return Math.abs(daysBetween(completedDay, date)) < 6;
      });
      return !doneRecently;
    }
    if (template.frequency === "monthly") {
      return day.getDate() === template.dayOfMonth;
    }
    return false;
  }
  rolloverMissedTasks(today) {
    const todayTemplateIds = new Set(this.data.tasks.filter((t) => t.status === "pending" && t.dueDate === today).map((t) => t.templateId));
    const overdue = this.data.tasks.filter((t) => t.status === "pending" && t.dueDate < today).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    for (const task of overdue) {
      if (todayTemplateIds.has(task.templateId))
        continue;
      task.dueDate = today;
      todayTemplateIds.add(task.templateId);
    }
  }
  applyDailyCap(date) {
    const pending = this.data.tasks.filter((t) => t.status === "pending" && t.dueDate === date).sort((a, b) => a.estMinutes - b.estMinutes);
    let total = 0;
    const keep = /* @__PURE__ */ new Set();
    for (const task of pending) {
      if (total + task.estMinutes <= this.data.settings.maxDailyMinutes || keep.size === 0) {
        total += task.estMinutes;
        keep.add(task.id);
      }
    }
    if (keep.size === pending.length)
      return;
    const nextDate = addDays(date, 1);
    for (const task of pending) {
      if (!keep.has(task.id))
        task.dueDate = nextDate;
    }
  }
  applyRewards(points) {
    const today = this.todayStr();
    const rewards = this.data.rewards;
    rewards.xp += Math.max(1, points);
    if (rewards.lastCompletionDate !== today) {
      const y = addDays(today, -1);
      rewards.currentStreak = rewards.lastCompletionDate === y ? rewards.currentStreak + 1 : 1;
      rewards.lastCompletionDate = today;
    }
    rewards.longestStreak = Math.max(rewards.longestStreak, rewards.currentStreak);
    rewards.level = Math.floor(Math.sqrt(rewards.xp / 100)) + 1;
  }
  dedupeTasks() {
    const grouped = /* @__PURE__ */ new Map();
    for (const task of this.data.tasks) {
      const key = `${task.templateId}|${task.dueDate}`;
      const arr = grouped.get(key) || [];
      arr.push(task);
      grouped.set(key, arr);
    }
    const deduped = [];
    for (const tasks of grouped.values()) {
      if (tasks.length === 1) {
        deduped.push(tasks[0]);
        continue;
      }
      const done = tasks.filter((t) => t.status === "done").sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""));
      if (done.length > 0) {
        deduped.push(done[0]);
        continue;
      }
      const pending = tasks.filter((t) => t.status === "pending").sort((a, b) => a.id.localeCompare(b.id));
      deduped.push(pending[0]);
    }
    deduped.sort((a, b) => {
      const dc = a.dueDate.localeCompare(b.dueDate);
      if (dc !== 0)
        return dc;
      if (a.status !== b.status)
        return a.status === "pending" ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
    this.data.tasks = deduped;
  }
  scheduleBodyDoubleCompletion() {
    if (this.bodyDoubleTimeoutId !== null) {
      window.clearTimeout(this.bodyDoubleTimeoutId);
      this.bodyDoubleTimeoutId = null;
    }
    const remaining = this.getBodyDoubleRemainingMs();
    if (remaining <= 0) {
      void this.completeBodyDoubleSession();
      return;
    }
    this.bodyDoubleTimeoutId = window.setTimeout(() => {
      void this.completeBodyDoubleSession();
    }, remaining);
  }
  async completeBodyDoubleSession() {
    if (!this.data.meta.bodyDoubleEndsAt)
      return;
    const minutes = this.data.meta.bodyDoubleDurationMinutes || 0;
    this.data.meta.bodyDoubleEndsAt = "";
    this.data.meta.bodyDoubleDurationMinutes = 0;
    await this.savePluginData();
    this.stopBodyDoubleDisplayTicker();
    this.updateBodyDoubleStatus();
    const pending = this.getTasksForDate(this.todayStr()).filter((t) => t.status === "pending").length;
    new import_obsidian.Notice(`Body double complete. ${pending} pending chores left.`);
    await this.logEvent(`Completed body double session (${minutes}m)`);
    this.refreshView();
  }
  restoreBodyDoubleSessionIfNeeded() {
    const remaining = this.getBodyDoubleRemainingMs();
    if (remaining <= 0) {
      if (this.data.meta.bodyDoubleEndsAt) {
        this.data.meta.bodyDoubleEndsAt = "";
        this.data.meta.bodyDoubleDurationMinutes = 0;
        void this.savePluginData();
      }
      this.updateBodyDoubleStatus();
      return;
    }
    this.startBodyDoubleDisplayTicker();
    this.scheduleBodyDoubleCompletion();
    this.updateBodyDoubleStatus();
  }
  startBodyDoubleDisplayTicker() {
    if (this.bodyDoubleDisplayTickId !== null) {
      window.clearInterval(this.bodyDoubleDisplayTickId);
      this.bodyDoubleDisplayTickId = null;
    }
    this.updateBodyDoubleStatus();
    this.bodyDoubleDisplayTickId = window.setInterval(() => {
      this.updateBodyDoubleStatus();
      this.updateVisibleTimerText();
      if (!this.isBodyDoubleActive()) {
        this.stopBodyDoubleDisplayTicker();
        this.refreshView();
      }
    }, 1e3);
  }
  stopBodyDoubleDisplayTicker() {
    if (this.bodyDoubleDisplayTickId !== null) {
      window.clearInterval(this.bodyDoubleDisplayTickId);
      this.bodyDoubleDisplayTickId = null;
    }
  }
  updateBodyDoubleStatus() {
    if (!this.bodyDoubleStatusEl)
      return;
    if (!this.isBodyDoubleActive()) {
      this.bodyDoubleStatusEl.setText("");
      return;
    }
    this.bodyDoubleStatusEl.setText(`Body Double ${this.getBodyDoubleRemainingLabel()}`);
  }
  updateVisibleTimerText() {
    const label = this.getBodyDoubleRemainingLabel();
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    for (const leaf of leaves) {
      const view = leaf.view;
      const root = view instanceof ADHDChoresView ? view.containerEl : null;
      if (!root)
        continue;
      root.querySelectorAll(".adhd-body-timer-value").forEach((el) => {
        el.textContent = label;
      });
    }
  }
  async checkMilestones(task, levelBefore) {
    const totalDone = this.data.tasks.filter((t) => t.status === "done").length;
    const streak = this.data.rewards.currentStreak;
    const levelNow = this.data.rewards.level;
    if (levelNow > levelBefore) {
      for (let lvl = levelBefore + 1; lvl <= levelNow; lvl++) {
        await this.unlockBadge(`level-${lvl}`, `Level ${lvl}`, `Reached level ${lvl}`);
      }
    }
    if (totalDone >= 10)
      await this.unlockBadge("tasks-10", "Momentum", "Completed 10 chores");
    if (totalDone >= 50)
      await this.unlockBadge("tasks-50", "Consistency", "Completed 50 chores");
    if (totalDone >= 100)
      await this.unlockBadge("tasks-100", "House Hero", "Completed 100 chores");
    if (streak >= 3)
      await this.unlockBadge("streak-3", "3-Day Streak", "Completed chores 3 days in a row");
    if (streak >= 7)
      await this.unlockBadge("streak-7", "7-Day Streak", "Completed chores 7 days in a row");
    if (streak >= 14)
      await this.unlockBadge("streak-14", "14-Day Streak", "Completed chores 14 days in a row");
    const quickWin = task.estMinutes <= 5;
    if (quickWin)
      await this.unlockBadge("quick-win", "Quick Win", "Completed a 5-minute or shorter chore");
  }
  async unlockBadge(id, label, description) {
    if (this.data.badges.some((b) => b.id === id))
      return;
    const unlockedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.data.badges.push({ id, label, description, unlockedAt });
    new import_obsidian.Notice(`Badge unlocked: ${label}`);
    await this.logEvent(`Badge unlocked: ${label} - ${description}`);
  }
  pruneHistory(today) {
    const cutoff = addDays(today, -120);
    this.data.tasks = this.data.tasks.filter((task) => {
      if (task.status !== "done")
        return true;
      const d = (task.completedAt || "").slice(0, 10);
      return !!d && d >= cutoff;
    });
  }
  startReminderTicker() {
    if (this.reminderTickId !== null)
      window.clearInterval(this.reminderTickId);
    this.reminderTickId = window.setInterval(() => {
      void this.checkReminders();
    }, 60 * 1e3);
  }
  async checkReminders() {
    if (!this.data.settings.remindersEnabled)
      return;
    const now = /* @__PURE__ */ new Date();
    const time = fmtTime(now);
    const today = fmtDate(now);
    const reminderTimes = parseReminderTimes(this.data.settings.reminderTimesCsv);
    if (!reminderTimes.includes(time))
      return;
    const key = `${today}|${time}`;
    if (this.notifiedReminderKeys.has(key))
      return;
    this.notifiedReminderKeys.add(key);
    const pending = this.getTasksForDate(today).filter((t) => t.status === "pending").length;
    if (pending > 0) {
      new import_obsidian.Notice(`Chore check-in: ${pending} pending tasks for today.`);
      await this.logEvent(`Reminder fired at ${time} (${pending} pending)`);
    }
  }
  migrateTemplateLibrary() {
    const existing = new Set(this.data.templates.map((t) => t.id));
    for (const template of standardTemplates()) {
      if (!existing.has(template.id))
        this.data.templates.push(template);
    }
  }
  async activateView() {
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE);
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
      if (leaf)
        await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    if (leaf) {
      workspace.revealLeaf(leaf);
      const view = leaf.view;
      if (view && typeof view.render === "function")
        await view.render();
    }
  }
  refreshView() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      const view = leaf.view;
      if (view && typeof view.render === "function")
        void view.render();
    }
  }
  async ensureFolderPath(path) {
    const parts = path.split("/").filter(Boolean);
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!this.app.vault.getAbstractFileByPath(current))
        await this.app.vault.createFolder(current);
    }
  }
  async getOrCreateLogFile() {
    const path = this.data.settings.logNotePath || "TaskNotes/Chore Log.md";
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof import_obsidian.TFile)
      return existing;
    const slash = path.lastIndexOf("/");
    if (slash > 0)
      await this.ensureFolderPath(path.slice(0, slash));
    return await this.app.vault.create(path, "# Chore Log\n\n");
  }
  async logEvent(message) {
    if (!this.data.settings.logToNote)
      return;
    try {
      const file = await this.getOrCreateLogFile();
      const now = /* @__PURE__ */ new Date();
      const line = `- ${fmtDate(now)} ${fmtTime(now)} - ${message}
`;
      const current = await this.app.vault.cachedRead(file);
      await this.app.vault.modify(file, `${current}${line}`);
    } catch {
    }
  }
  openLogNote() {
    void (async () => {
      const file = await this.getOrCreateLogFile();
      await this.app.workspace.getLeaf(false).openFile(file);
    })();
  }
  async createOrOpenChoreDashboard() {
    const tagRaw = this.data.settings.choreTaskTag?.trim() || "";
    const tag = !tagRaw ? "" : tagRaw.startsWith("#") ? tagRaw : `#${tagRaw}`;
    const path = (0, import_obsidian.normalizePath)("TaskNotes/Chore Dashboard.md");
    let file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof import_obsidian.TFile)) {
      await this.ensureFolderPath("TaskNotes");
      const content = [
        "# Chore Dashboard",
        "",
        `Tag: \`${tag || "(none)"}\``,
        "",
        "## Today",
        "```tasks",
        `not done`,
        ...tag ? [`tags include ${tag}`] : [],
        "due on today",
        "sort by priority",
        "```",
        "",
        "## Upcoming",
        "```tasks",
        "not done",
        ...tag ? [`tags include ${tag}`] : [],
        "due after today",
        "sort by due",
        "```",
        "",
        "## Overdue",
        "```tasks",
        "not done",
        ...tag ? [`tags include ${tag}`] : [],
        "due before today",
        "sort by due",
        "```",
        "",
        "## Completed (Last 14 days)",
        "```tasks",
        "done",
        ...tag ? [`tags include ${tag}`] : [],
        "done after 14 days ago",
        "sort by done reverse",
        "```",
        ""
      ].join("\n");
      file = await this.app.vault.create(path, content);
      new import_obsidian.Notice("Created Chore Dashboard note.");
    }
    if (file instanceof import_obsidian.TFile) {
      await this.app.workspace.getLeaf(false).openFile(file);
    }
  }
  getDailyNotesConfig() {
    const fallback = { folder: "", format: "YYYY-MM-DD" };
    const settings = this.data.settings;
    const folderOverride = settings.dailyNotesFolder?.trim();
    const formatOverride = settings.dailyNotesFormat?.trim();
    if (folderOverride || formatOverride) {
      return {
        folder: folderOverride || "",
        format: formatOverride || "YYYY-MM-DD"
      };
    }
    try {
      const appWithInternal = this.app;
      const internal = appWithInternal.internalPlugins;
      const daily = internal?.getPluginById?.("daily-notes") ?? internal?.plugins?.["daily-notes"] ?? null;
      const opts = daily?.instance?.options ?? daily?.options ?? null;
      return {
        folder: opts?.folder || "",
        format: opts?.format || "YYYY-MM-DD"
      };
    } catch {
      return fallback;
    }
  }
  buildDailyNotePath(date) {
    const cfg = this.getDailyNotesConfig();
    const fileName = `${(0, import_obsidian.moment)(date, "YYYY-MM-DD").format(cfg.format)}.md`;
    if (!cfg.folder)
      return (0, import_obsidian.normalizePath)(fileName);
    return (0, import_obsidian.normalizePath)(`${cfg.folder}/${fileName}`);
  }
  async openDailyNoteForDate(date) {
    if (!this.data.settings.dailyNotesIntegrationEnabled) {
      new import_obsidian.Notice("Daily Notes integration is disabled in settings.");
      return;
    }
    const path = this.buildDailyNotePath(date);
    let file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof import_obsidian.TFile)) {
      const slash = path.lastIndexOf("/");
      if (slash > 0) {
        await this.ensureFolderPath(path.slice(0, slash));
      }
      file = await this.app.vault.create(path, `# ${date}

`);
    }
    if (file instanceof import_obsidian.TFile) {
      await this.app.workspace.getLeaf(false).openFile(file);
    }
  }
  buildDailyChoreBlock(date) {
    const tasks = this.getTasksForDate(date);
    const emitTasks = this.data.settings.emitTasksPluginFormat;
    const rawTag = this.data.settings.choreTaskTag?.trim() || "";
    const tag = !rawTag ? "" : rawTag.startsWith("#") ? rawTag : `#${rawTag}`;
    const lines = [
      "<!-- ADHD_CHORES_START -->",
      "## Chores"
    ];
    if (tasks.length === 0) {
      lines.push("- [ ] No chores planned");
    } else {
      for (const task of tasks) {
        const check = task.status === "done" ? "x" : " ";
        if (emitTasks) {
          const due = `\u{1F4C5} ${task.dueDate}`;
          const doneStamp = task.status === "done" && task.completedAt ? ` \u2705 ${(task.completedAt || "").slice(0, 10)}` : "";
          const tagPart = tag ? ` ${tag}` : "";
          lines.push(`- [${check}] ${task.title} (${task.room}, ${task.estMinutes}m)${tagPart} ${due}${doneStamp}`.trim());
        } else {
          lines.push(`- [${check}] ${task.title} (${task.room}, ${task.estMinutes}m)`);
        }
      }
    }
    lines.push("<!-- ADHD_CHORES_END -->");
    return lines.join("\n");
  }
  async syncDateToDailyNote(date, showNotice = true) {
    if (!this.data.settings.dailyNotesIntegrationEnabled) {
      if (showNotice)
        new import_obsidian.Notice("Daily Notes integration is disabled in settings.");
      return;
    }
    const path = this.buildDailyNotePath(date);
    let file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof import_obsidian.TFile)) {
      const slash = path.lastIndexOf("/");
      if (slash > 0) {
        await this.ensureFolderPath(path.slice(0, slash));
      }
      file = await this.app.vault.create(path, `# ${date}

`);
    }
    if (!(file instanceof import_obsidian.TFile))
      return;
    const content = await this.app.vault.cachedRead(file);
    const block = this.buildDailyChoreBlock(date);
    const re = /<!-- ADHD_CHORES_START -->[\s\S]*?<!-- ADHD_CHORES_END -->/m;
    const next = re.test(content) ? content.replace(re, block) : `${content.trimEnd()}

${block}
`;
    await this.app.vault.modify(file, next);
    if (showNotice)
      new import_obsidian.Notice(`Synced chores to ${path}`);
  }
  async syncWeekToDailyNotes(showNotice = true) {
    if (!this.data.settings.dailyNotesIntegrationEnabled) {
      if (showNotice)
        new import_obsidian.Notice("Daily Notes integration is disabled in settings.");
      return;
    }
    const today = this.todayStr();
    const weekStart = getWeekStart(today);
    for (let i = 0; i < 7; i++) {
      await this.syncDateToDailyNote(addDays(weekStart, i), false);
    }
    if (showNotice)
      new import_obsidian.Notice("Synced this week to daily notes.");
  }
  async loadPluginData() {
    const loaded = await this.loadData();
    const base = cloneDefaults();
    this.data = {
      ...base,
      ...loaded,
      settings: { ...base.settings, ...loaded?.settings || {} },
      rewards: { ...base.rewards, ...loaded?.rewards || {} },
      meta: { ...base.meta, ...loaded?.meta || {} },
      templates: loaded?.templates || base.templates,
      tasks: loaded?.tasks || base.tasks,
      badges: loaded?.badges || base.badges
    };
    this.dedupeTasks();
  }
  async savePluginData() {
    await this.saveData(this.data);
  }
};
