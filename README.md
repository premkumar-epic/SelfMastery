# SelfMastery - Your Path to Personal Growth

## Project Overview

SelfMastery is a cross-platform productivity application designed to empower you on your journey to self-improvement and achieving your goals. Built with React/Next.js for the web and React Native for mobile, SelfMastery provides a suite of tools to help you organize your time, manage your tasks, and cultivate positive habits.

## Key Features

* **Core Productivity Tools:**

    * **Calendar Integration:** Stay on top of your schedule with seamless calendar integration.
    * **To-Do List Management:** Organize your tasks, prioritize effectively, and track your progress.
    * **Basic Timer:** Utilize a simple timer to boost focus and manage your time.

* **Advanced Features for Self-Mastery:**
    * **Productivity Time Suggestions:** Receive intelligent suggestions for optimal productivity periods.
    * **Advanced Timer Features:**
        * **Pomodoro Technique:** Enhance focus with structured work intervals.
        * **Task Association:** Link timer sessions to specific tasks for better tracking.
        * **Time Logging:** Record time spent on activities for analysis and improvement.
    * **Task Organization & Management:**
        * **Enhanced Calendar and Task Management:** Manage recurring events, reminders, prioritization, categories, and sub-tasks.
        * **Task Dependencies:** Define task relationships to ensure efficient workflow.
        * **Batch Task Editing:** Streamline your workflow by editing multiple tasks at once.
        * **Brain Dump Area:** Quickly capture fleeting thoughts and organize them later.
        * **Progressive Task Breakdown:** Break down large tasks into smaller, manageable steps as you work.
        * **Customizable Task Views:** Visualize your tasks in a way that suits you best.
    * **Goal Setting & Habit Tracking:**
        * **Goal Setting:** Define your objectives and track your progress towards self-mastery.
        * **Habit Tracking:** Cultivate positive habits and monitor your consistency.
    * **Smart Features & Integrations:**
        * **AI-Powered Smart Reminders:** Receive intelligent reminders to stay on track.
        * **Contextual Task Suggestions:** Get relevant task suggestions based on your schedule and context.
        * **Integration with Learning Platforms:** Seamlessly incorporate learning resources into your workflow.
        * **Basic Note-Taking:** Create and link notes to tasks and events.
        * **Integration with Communication Tools:** Connect with your communication platforms (carefully considered to maintain focus).
    * **User Experience & Personalization:**
        * **Quick Add Functionality:** Quickly add tasks and events without interrupting your flow.
        * **Customizable Widgets/Home Screen Shortcuts (Mobile):** Access key information and actions directly from your device's home screen.
        * **Gamification:** Stay motivated and engaged with gamified elements.
        * **Review and Reflection Prompts:** Promote self-awareness and continuous improvement.
        * **Customizable Themes:** Personalize the app's appearance to match your style.
        * **Export Data:** Export your data for analysis or backup.

## Tech Stack

SelfMastery is built using the following technologies:

* **Website:**
    * Framework:  React with Next.js
    * Language:  JavaScript
* **Mobile Apps (Android & iOS):**
    * Framework: React Native
    * Language: JavaScript
* **Backend:**
    * Platform: Firebase
    * Services:
        * Authentication
        * Firestore (NoSQL Database)
        * Cloud Functions

## Development Setup

1.  **Prerequisites:**

    * Node.js and npm installed.
    * Firebase account and project set up.
    * React Native development environment set up for mobile (Android/iOS).

2.  **Installation:**

    * **Clone the repository:**
        ```bash
        git clone [https://github.com/your-username/SelfMastery.git](https://github.com/your-username/SelfMastery.git)
        cd SelfMastery
        ```
    * **Install web dependencies:**
        ```bash
        cd web
        npm install
        ```
     * **Install mobile dependencies:**
        ```bash
        cd mobile
        npm install
        ```

3.  **Configuration:**

    * **Firebase Configuration:**
        * Obtain your Firebase project configuration (firebaseConfig).
        * Create a `firebase.js` file in the `web/src` directory and configure Firebase.
        * Create a `firebase.js` file in the `mobile/src` directory and configure Firebase.

    * **Environment Variables:**
        * Create a `.env` file in the root directory for shared environment variables.
        * Create a `.env.web` file in the `web/` directory for web-specific environment variables.
        * Create a `.env.mobile` file in the `mobile/` directory for mobile-specific environment variables.
        * Add any necessary API keys or configuration settings.

4. **Running the Application**
    * **Web:**
        ```bash
        cd web
        npm run dev
        ```
    * **Mobile (Android):**
        ```bash
        cd mobile
        npx react-native run-android
        ```
    * **Mobile (iOS):**
        ```bash
        cd mobile
        npx react-native run-ios
        ```

##  Project Structure
SelfMastery/├── .github/                  # GitHub configuration files├── .vscode/                   # VSCode configuration files (optional)├── mobile/                 # React Native mobile application│   ├── App.js                # Main application component│   ├── index.js              # Entry point for React Native│   ├── android/              # Android-specific files│   ├── ios/                  # iOS-specific files│   ├── src/                  # Source code│   │   ├── components/       # Reusable components│   │   ├── screens/          # Application screens│   │   ├── navigation/       # Navigation setup│   │   ├── firebase.js       # Firebase configuration│   │   └── ...│   ├── .env.mobile           # Mobile Environment variables├── web/                    # React.js web application│   ├── pages/                # Next.js pages│   ├── public/               # Static assets│   ├── src/                  # Source code│   │   ├── components/       # Reusable components│   │   ├── styles/           # Styles (CSS, Sass, etc.)│   │   ├── firebase.js       # Firebase configuration│   │   └── ...│   ├── .env.web              # Web Environment Variables├── README.md               # Project README├── .gitignore                # Specifies intentionally untracked files└── package.json              # Project dependencies
## Contributing

Contributions are welcome!  Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main branch.

## License

[Specify the license for your project, e.g., MIT]
