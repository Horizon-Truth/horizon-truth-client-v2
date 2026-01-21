# Horizon-Truth — Frontend Project Charter

## 1. Project Overview

**Project Name:** Horizon-Truth Frontend  
**Repository Type:** Open-Source  
**Primary Stack:** React / Next.js, TypeScript, Tailwind / CSS Modules

### Mission

Horizon-Truth Frontend delivers an accessible, intuitive, and transparent user interface for exploring misinformation data, analytics, and moderation tools powered by the Horizon-Truth platform.

### Objectives

*   Provide a user-friendly interface for diverse users
*   Ensure accessibility and performance
*   Visualize complex data clearly
*   Remain backend-agnostic via APIs

## 2. Scope & Non-Goals

### In Scope

*   UI components and layouts
*   State management and API consumption
*   Data visualization
*   Accessibility (WCAG-aligned)
*   Frontend performance optimization

### Out of Scope (Non-Goals)

*   Backend business logic
*   Database management
*   AI model training
*   Authentication implementation details (handled by backend)

## 3. Governance Model

The frontend follows the same **Maintainer-Led Consensus Model** as the backend to ensure alignment across the ecosystem.

*   UI/UX decisions are collaborative
*   Design changes require review
*   Consistency with backend APIs is mandatory

## 4. Roles & Responsibilities

### Frontend Project Lead

*   Oversees UI architecture
*   Maintains design consistency
*   Coordinates with backend maintainers

### Maintainers

*   Review PRs
*   Maintain component standards
*   Manage releases

### Contributors

*   Improve UI components
*   Fix bugs and accessibility issues
*   Propose UX improvements

## 5. Contribution Model

*   All UI changes require screenshots or previews
*   Accessibility checks encouraged
*   API contracts must not be broken
*   Follow `CONTRIBUTING.md` and style guidelines

## 6. Design & UX Principles

*   Clarity over complexity
*   Accessibility by default
*   Performance-first rendering
*   Minimal but extensible design system

## 7. Release & Versioning Strategy

*   **Semantic Versioning**
*   UI breaking changes documented clearly
*   Coordinated releases with backend when needed

## 8. Security & Privacy

*   No sensitive logic in client
*   Secure handling of tokens
*   Avoid storing private data in local storage
*   Follow best frontend security practices

## 9. Licensing & IP

*   Same open-source license as defined in `LICENSE`
*   Contributions licensed uniformly
*   Design assets included under project license

## 10. Communication Channels

*   GitHub Issues & Discussions
*   Design review threads
*   Optional community UX feedback sessions

## 11. Amendments

Changes to this charter require:

1.  Maintainer proposal
2.  Maintainer approval
3.  Public change log