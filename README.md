# 🚀 TaskFlow Frontend

A modern, responsive task management web app built with **React.js**.

## 🌐 Live Demo

https://task-flow-frontend-alpha.vercel.app/

---

## ✨ Features

* 🔐 Authentication (Signup/Login)
* 📋 Task Management (CRUD)
* 🎯 Priority & Status handling
* 🔔 Toast Notifications
* 🎨 Theme support
* ⚡ API integration with backend

---

## 🛠️ Tech Stack

* React.js (Hooks)
* CSS
* Fetch API
* JWT Authentication
* Vercel (Deployment)

---

# ⚙️ RUN LOCALLY

## 1️⃣ Clone Repo

```bash
git clone https://github.com/your-username/taskflow-frontend.git
cd taskflow-frontend
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ IMPORTANT CHANGE (VERY IMPORTANT)

Your frontend is currently using deployed backend:

```js
const BASE_URL = "https://taskflow-backend-t0g7.onrender.com";
```

---

### 👉 If running locally, change it to:

```js
const BASE_URL = "http://localhost:3000";
```

---

## 4️⃣ Run App

```bash
npm start
```

---

## 🌍 App runs on:

```text
http://localhost:3000
```

---

# ⚠️ IMPORTANT NOTES

* Backend must be running locally for API to work
* If backend not running → login/signup will fail
* Check CORS settings if errors occur

---

# 🔧 Common Issues

### ❌ CORS Error

→ Fix backend CORS config

### ❌ Failed to fetch

→ Backend not running OR wrong BASE_URL

---

# 🚀 Future Improvements

* 📱 Full mobile responsiveness
* 📊 Dashboard analytics
* 🔔 Email reminders
* ⚡ Performance optimization

---

# 👨‍💻 Author

Bharat Choudhary





# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
