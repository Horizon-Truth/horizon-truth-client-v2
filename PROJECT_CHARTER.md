# Horizon-Truth — Frontend Project Charter

## 1. Project Overview

**Project Name:** Horizon-Truth Frontend  
**Repository Type:** Open-Source  
**Primary Stack:** React / Next.js, TypeScript, Tailwind / CSS Modules

### Vision

To become the world's most trusted and transparent interface for information verification, empowering global communities to combat misinformation through data-driven insights.

### Mission

Horizon-Truth Frontend provides an accessible, high-performance, and intuitive platform for exploring public claims, visualizing misinformation trends, and accessing moderation tools. We aim to foster digital literacy and accountability by making complex data understandable for everyone.

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

## 9. Licensing Strategy

*   **Open Source First:** We use the MIT License to ensure maximum accessibility and encourage widespread adoption.
*   **Contributor Alignment:** All contributions are licensed under the same terms to maintain project integrity.
*   **Dependency Transparency:** We prioritize open-source libraries and maintain clear documentation of all third-party licenses.

## 10. Community Engagement

We are committed to building an open and inclusive ecosystem. We actively seek collaboration with researchers, fact-checkers, and the open-source community. Our engagement strategy includes:

*   **Open Dialogue:** Using GitHub Discussions and Issues for transparent planning and feedback.
*   **Collaborative Design:** Involving the community in UX/UI decisions to ensure the platform meets diverse user needs.
*   **Supportive Environment:** Maintaining a welcoming space for contributors of all skill levels, guided by our Code of Conduct.

## 11. Communication Channels

*   GitHub Issues & Discussions
*   Design review threads
*   Optional community UX feedback sessions

## 12. Amendments

Changes to this charter require:

1.  Maintainer proposal
2.  Maintainer approval
3.  Public change log
