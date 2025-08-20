📊 Reddtive — Reddit User Analyzer

Reddtive is a Next.js web application that lets you explore and analyze your Reddit activity in a fun and visual way.
From interactive heatmaps to saved item organization, Reddtive provides a modern dashboard to understand your Reddit habits.

✨ Features

🏠 Landing Page

Clean & modern design with glassmorphism.
Quick CTA to log in with Reddit.

🔐 Login Page

Secure authentication via Reddit OAuth.
No passwords are stored or asked — we only read Reddit data.

📊 Dashboard (after authentication)

Overview → Highlights of user activity.
Subscribed Communities → Visual chart of top subreddits.
Quick Stats → User details like karma, account age, trophies.

📈 Analytics Page

Contains 8+ modern charts & graphs, built using Recharts + Framer Motion animations.
Subreddit comment distribution.
Karma by subreddit.
Activity over time.
Custom-built GitHub-style heatmap (fully responsive, advanced drilldown popup on click).
Word cloud of most used words.
Controversial comments detector.
Trophy timeline.
More detailed graphs to explore user activity patterns.

⚙️ Settings Page

Toggle what features are enabled.
Manage personalization options.

💾 Saved Items Page

Shows saved posts (t3) and comments (t1).
Advanced filters (by subreddit, type, keywords).
Thumbnail previews for posts.

📝 Submitted Posts Page

Displays user’s submitted posts.
Advanced filters to sort & search.
Infinite scroll with lazy loading.

👤 About Page

Information about the developer (Akash S.) and the project.
“Buy Me a Coffee” ☕ support link.

🚪 Logout

Logout option appears inside profile dropdown.
Confirmation modal before logging out.

🔔 Notifications System

Custom-built stacked notifications (inspired by Sonner, but fully made from scratch).
Minimal design → expands on hover.
Advanced notifications panel in menu bar:
Shows all past notifications with detailed data.

🛠️ Tech Stack

Framework: Next.js
Styling: Tailwind CSS + glassmorphism
Animations: Framer Motion
Auth: NextAuth.js (Reddit provider)
Charts: Recharts + Custom-built Heatmap
Notifications: Own custom React notification system
Deployment: Vercel (fully serverless, responsive)

🎯 Motive

This project is built as a fun personal project:
No user credentials are stored.
No passwords are collected.
We only read public Reddit data with user’s consent.
Main aim → learn, build, and showcase advanced frontend + data visualization skills.