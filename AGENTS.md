<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# 개발 및 협업 규칙 (Workflow Rules)

### 작업 프로세스 원칙
1. **작업 시작 전 (Planning & Checklist)**:
   - 모든 기능 개발, 수정, 설정 작업 전 반드시 **Implementation Plan** 아티팩트를 작성하고 사용자 승인(`RequestFeedback: true`)을 먼저 받을 것.
   - 사용자 승인 전에는 코드를 임의로 대량 수정하거나 실행하지 말 것.
   - 작업 시작 시 세부 작업 항목별 **진행 단계 체크리스트(Checklist)**를 반드시 수립하고, 작업 진행에 따라 완료 상태(`[x]`)를 갱신하여 가시성을 확보할 것.

2. **작업 진행 중 (Progress Tracking)**:
   - 체크리스트 항목을 순차적으로 수행하며 단계별 완료 여부를 사용자에게 투명하게 공유할 것.

3. **작업 완료 후 (Walkthrough)**:
   - 작업 완료 후 반드시 **Walkthrough** 아티팩트를 작성하여 변경 내역, 주요 결정 사항, 체크리스트 달성 결과, 검증/테스트 결과를 체계적으로 보고할 것.
