# ✅ Morning deploy checklist

## 🎯 Scope

A short ordered plan for a calm release. Nest levels on purpose so hierarchy stays obvious while markers alternate.

## 🪜 Steps

- Confirm the release branch
  - Diff against `main`
    - commits
    - config
  - Note owners
    - backend
    - frontend
- Choose a pacing for the rollout
  - spike
  - canary
    - regional
    - full
- Mix list kinds
  1. Ordered under unordered
  2. Second ordered child
     - Back to bullets
- [ ] Warm caches
- [ ] Watch error rate
- [x] Draft the rollback note

## 🔢 Ordered path

1. Freeze merges with **notice**
2. Run smoke with _staging_
   1. Auth paths
   2. Billing paths
      1. Refund edge
3. Open traffic with `canary`

## 🏁 Close

Finish with **green** checks and a _written_ rollback owner in `RUNBOOK.md`.
