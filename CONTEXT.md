# CONTEXT.md - SISU Snail Racing Betting App

## Project Context
This is a take-home full-stack challenge for SISU Technologies. 7 calendar days, ~6-8 hours expected work. Incomplete submissions accepted with clear documentation of what's done/pending.

## Tech Stack Constraints (Mandatory)
- **Frontend**: React + TypeScript
- **Backend**: Express + TypeScript
- **Storage**: localStorage only (user, session, balance)
- **No database**, no real payment gateway

## Repository Requirements
- Public GitHub repo named: `[first-name]-[4-digit-random]` (e.g., `ana-1234`)
- No company identifiers in repo/code
- Must include: run instructions, test instructions, SnailPay test card docs

## Deliverables
1. **PDF Response** (max 4 pages, Arial 10pt, standard line spacing)
   - Process summary
   - Key decisions
   - Tools/libraries/templates used
   - AI usage documentation
   - Tests implemented + rationale
   - Completed features list
   - Incomplete features/known issues
   - Time invested
   - Repo link
2. **Working app** (register → login → dashboard → logout → reload works)
3. **SnailPay reproducibility** docs

## Evaluation Focus
- Requirements fulfillment
- Auth flow clarity
- Dashboard usability
- SnailPay integration correctness
- Error/timeout handling
- Persistence correctness
- TypeScript + React + Express usage
- Code organization/quality
- Security practices
- Test strategy
- UX/presentation
- PDF clarity
- AI usage transparency
- Ability to explain/modify code

## Optional Bonuses (Extra PDF Page Each)
1. **Deployed App**: Public URL + platform + implementation notes
2. **Database Proposal**: Tables, relationships, tech choice, migration plan (no implementation)

## AI Usage Policy
Allowed for: analysis, design, code gen, testing, docs, research, debugging
Must document: tools used, purpose, parts assisted, workflow

## Hard Constraints (Invalid if Missing)
1. Register with email/password
2. Logout
3. Login with registered credentials
4. Access post-login screen

## Simulated Data Requirements
- **Donut chart**: Won/lost bet counts (mock)
- **Bar chart**: 6 named snails, 6 races/day, victory counts (mock but consistent)

## SnailPay Specifics
- Card number + CVV in responses (masked/fake)
- Card number + CVV saved to localStorage (fake only)
- Clear user feedback for all 3 outcomes