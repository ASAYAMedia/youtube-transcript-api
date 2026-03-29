# TinyToolbox Escalation Rules & Approval Gates

## Agent Decision Matrix

| Action | CEO Can Do | Requires Board | Notes |
|--------|------------|----------------|-------|
| Fix typos | YES | No | Autonomous |
| Update broken links | YES | No | Log the change |
| Adjust agent schedule <2hrs | YES | No | Notify in report |
| Create regression tests | YES | No | Standard QA |
| Update dependencies | YES | No | If tests pass |
| Add new tool | YES | No | Standard build process |
| Fix build errors | YES | No | Standard QA |
| Add affiliate partner | AUTO-COLLECT | YES | Generate report, wait approval |
| Change site design | NO | YES | Visual changes |
| Add/remove agents | NO | YES | Org changes |
| Spend >$50/month | NO | YES | Budget gate |
| Revenue-impacting changes | NO | YES | A/B tests, pricing |
| New integrations | NO | YES | X/Twitter, LinkedIn |

---

## Escalation Triggers

### Level 1: Department Head
- Agent fails to run
- Build fails
- Lighthouse <90
- Broken links detected
- Missing translations >5%

### Level 2: CEO/Supervisor
- Same agent fails 3 days in a row
- Multiple departments reporting issues
- Revenue drop >20%
- Site outage >1 hour

### Level 3: Board (Daniel)
- CEO escalation not resolved in 1 day
- New strategic opportunities
- Budget requests >$50/month

---

## Approval Queue System

Items pending board approval are stored in:
`/home/workspace/TinyToolbox-Corp/APPROVAL-QUEUE.md`

Format:
```markdown
# Approval Queue

## PENDING

### 2026-03-29 — New Affiliate Partnership
- **Type:** Revenue
- **Request:** Add Canva affiliate partnership
- **Risk:** Low
- **Reward:** $20-100/sale
- **CEO Recommendation:** APPROVE
- **Status:** PENDING
- **Board Decision:** ___________

## APPROVED
[Nothing yet]

## DENIED
[Nothing yet]
```

---

## Auto-Action Log

Actions CEO took autonomously:
- Timestamp — Action — Result — Files Changed
