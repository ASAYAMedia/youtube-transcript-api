# TinyToolbox Corporation — Organization Chart

## Company Identity

**Company:** TinyToolbox Inc.  
**Domain:** https://tinytoolbox.co  
**Mission:** Build the world's largest collection of free, browser-native micro-tools. Generate revenue through affiliate partnerships and display advertising while providing genuine value to users.

**North Star Metrics:**
- Total tools: 431 → Target: 1,000 by EOY
- Monthly visitors: [TRACKING NEEDED]
- Affiliate revenue: [TRACKING NEEDED]
- PageSpeed scores: 95+ across all categories

---

## Organizational Hierarchy

```
                    +-------------+
                    |    BOARD    |
                    |   (Daniel)  |
                    +------+------+
                           |
                    +------+------+
                    |     CEO     |
                    |  (Supervisor|
                    |   Agent)    |
                    +------+------+
                           |
        +----------+-------+-------+----------+
        |          |       |       |          |
   +----+-----+ +---+----+ ++----+ ++------+ ++--------+
   |  Product | | Growth | Revenue|Ops     | Content|
   |    VP    | |   VP   |   VP   |  VP     |   VP   |
   +----+-----+ +---+----+ ++----+ ++------+ ++--------+
        |          |        |        |          |
   +----+----+  +---+----+ +--+---+ +---+----+  +---+----+
   | Tool    |  | SEO    | | Mon  | | Super  |  | Blog   |
   | Creator |  | Agent  | | Scout| | visor  |  | Writer |
   | (Daily) |  |(Weekly)| |(Daily)| |(Daily) |  |(Daily) |
   +---------+  +--------+ +------+ +--------+  +--------+
        |                |        |             |
   +----+----+       +---+----+   |        +----+----+
   | QA Maint|       | Social |   |        | News-  |
   |(2x/day)|       |Distrib |   |        | letter |
   +---------+       |(Daily) |   |        |(Weekly)|
                     +--------+   |        +--------+
                                  |             |
                            +----+----+    +----+
                            |Competitor|   |Trans-|
                            | Watch   |   | lation|
                            |(Weekly) |   | Audit|
                            +---------+   +------+
```

---

## Department Structure

### 1. Product Department
**Goal:** Ship 1 quality tool daily, maintain 99.9% uptime

| Agent | Schedule | Primary KPI | Escalation Trigger |
|-------|----------|-------------|-------------------|
| Tool Creator | Daily 9am | 1 tool shipped | Build fails, type errors |
| QA Maintenance | Daily 9am, 9pm | 0 critical bugs | Lighthouse <90, broken links |
| Performance | Daily 8am, 8pm | PageSpeed 95+ | Any metric drops below 90 |
| Newsletter | Weekly Fri 10am | Newsletter sent | >5% bounce rate |

---

### 2. Growth Department  
**Goal:** Increase organic traffic 20% month-over-month

| Agent | Schedule | Primary KPI | Escalation Trigger |
|-------|----------|-------------|-------------------|
| SEO Agent | Weekly Mon 10am | Ranking improvements | Any page drops >10 positions |
| Social Distribution | Daily 11am | 1 post/day | Account auth failures |
| Competitor Watch | Weekly Wed 2pm | Competitor intel report | Competitor launches major feature |
| Blog Writer | Daily 9am | 1 post published | No post 2 days in a row |

---

### 3. Revenue Department
**Goal:** Maximize affiliate revenue per visitor

| Agent | Schedule | Primary KPI | Escalation Trigger |
|-------|----------|-------------|-------------------|
| Monetization Scout | Daily 9am | New affiliate opportunities | Revenue drops >20% |

---

### 4. Operations Department
**Goal:** System runs flawlessly, all agents produce output

| Agent | Schedule | Primary KPI | Escalation Trigger |
|-------|----------|-------------|-------------------|
| CEO/Supervisor | Daily 6:30pm | 100% daily report delivery | Any agent fails 3 days straight |
| User Feedback | Daily 4pm | Brand mention tracking | Negative sentiment spike |
| Translation Audit | Hourly | i18n completeness | Missing translations >5% |

---

## KPI Tracking

Each department reports these metrics:

**Product:**
- toolsShipped (daily)
- buildStatus (pass/fail)
- lighthouseAverage (score)
- criticalBugsOpen (count)

**Growth:**
- searchRankings (keyword positions)
- socialPosts (daily count)
- competitorAlerts (weekly)

**Revenue:**
- affiliatePartners (total count)
- liveTrackers (working links)
- opportunitiesFound (daily)

**Operations:**
- agentsHealthy (count)
- reportsSubmitted (count)
- escalations (count)
- issuesResolved (count)

---

## Escalation Rules

### CEO Can Act Autonomously On:
- Fixing typos
- Updating broken links
- Adjusting agent schedules <2 hours
- Creating regression tests
- Routine dependency updates

### Requires Board (Daniel) Approval:
- New affiliate partnerships
- Site-wide design changes
- Adding/removing agents
- Revenue-impacting changes
- Any cost > $50/month
