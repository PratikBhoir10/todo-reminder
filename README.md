# todo-reminder
# Todo Reminder App 

A simple Firebase-powered todo list with reminder functionality that syncs across devices in real-time.

![App Screenshot](https://i.imgur.com/JR5hZOl.png)

## Features 
- Add tasks with reminder timestamps
- Real-time Firestore synchronization
- Mobile-friendly responsive design
- Overdue task highlighting
- One-click task deletion

## Technologies Used 🛠
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Firebase Firestore (NoSQL database)
- **Icons**: Font Awesome

## Setup Instructions 

### 1. Firebase Configuration
1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** (start in test mode)
3. Copy your config from Project Settings → Web App → and paste into `firebase.js`

### 2. Run Locally
```bash
git clone https://github.com/YOUR-USERNAME/todo-reminder.git
cd todo-reminder
# Open index.html in browser
