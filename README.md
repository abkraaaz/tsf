# 🎂 MD TaUsHiF Alam - Birthday Wishes Website

A fully responsive, modern, animated Birthday Celebration Website with Firebase backend integration and GitHub Pages hosting capability.

## 🎉 Features

### ✨ Intro Section
- 🎆 Firecracker explosion animation (Diwali theme)
- 💔 Continuous heart-shape rain effect (infinite loop)
- ✨ Sparkle effects on mouse click
- 🌈 Romantic gradient background (pink, purple, dark blue)
- 🎯 Glowing neon animated name with floating effect
- 🎭 Romantic shayari with fade-in and typing animation

### 📸 Gallery Section
- 🎬 Auto-sliding infinite loop gallery
- 🎯 Smooth sliding animation
- 💐 Heart + flower particle effects over images
- 🖱️ Click & hold to pause and see fullscreen
- 📱 Mobile swipe support
- 🔊 Sound effect on slide changes (can be added)

### 💌 Birthday Message Wall
- 📝 Submit name + message
- 💌 Messages display in sliding card format
- ❤️ Heart animation effects
- 🔄 Real-time updates across devices (Firebase)
- 💾 Persistent storage after page refresh
- 🗑️ Admin delete option
- 🚫 Spam filter (max 200 characters)

### ❤️ Valentine Section

#### 1️⃣ Love Calculator
- 💕 Two name input boxes
- 🎯 Special matching: "Taushif" + "Najiya/Naziya" = 1000%
- "Taushif" alone = 99%
- 💥 Animated heart explosion result display

#### 2️⃣ FLAMES Game
- 🔥 Calculate FLAMES compatibility
- ✨ Default: Taushif + Najiya/Naziya = "Marriage"
- 🎨 Animated result wheel display

#### 3️⃣ Crush Match Spin Game
- 🎡 Spin wheel for random match
- 🎯 Pre-configured crush names array
- ⭐ Taushif always gets Najiya as top match

### 📊 Question Polls Section
- 🗳️ Multiple-choice poll questions
- 📊 Four options per question
- 📈 Live poll percentage display
- 📊 Animated bar graphs
- 💾 Results stored in Firebase Realtime Database

### 🎵 Background Music
- 🎶 Auto-play background music (low volume)
- 🔄 Loop forever
- 🔊 Volume control
- 📉 Automatic volume reduction when modals open

### 📱 Social Section
- 📷 Instagram link with glowing icon
- 👻 Snapchat link with glowing icon
- 🎨 Hover animations
- 💫 Floating effects

### 🌧️ Global Effects
- 💧 Continuous heart rain (slow, infinite)
- ✨ Sparkle effect on every click
- 💥 Double-tap floating heart animation
- 📏 Fully mobile responsive
- ⚡ Performance optimized
- ✅ Smooth scroll animations

## 📁 Project Structure

```
tsf/
├── index.html      # Main HTML structure
├── style.css       # All CSS styles and animations
├── script.js       # JavaScript functionality and interactions
├── firebase.js     # Firebase configuration and database functions
└── README.md       # This file
```

## 🚀 Quick Start

### 1. Clone or Download Files
```bash
git clone https://github.com/yourusername/tsf-birthday.git
cd tsf-birthday/tsf
```

### 2. Open Locally (without Firebase)
Simply open `index.html` in your browser. Most features work without Firebase:
- All animations and effects
- Gallery and message wall (localStorage only, no sync)
- Valentine games
- Polls (localStorage only)

### 3. Firebase Setup (Optional for Live Features)

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project"
3. Enter project name: `taushif-birthday`
4. Enable Google Analytics (optional)
5. Click "Create Project"

#### Step 2: Get Firebase Credentials
1. In Firebase Console, click your project
2. Click the web icon `</>` to register a web app
3. Copy the Firebase config:
```javascript
{
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}
```

#### Step 3: Update Firebase Config
Edit `firebase.js` and replace the `firebaseConfig` object with your credentials:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

#### Step 4: Enable Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click "Create Database"
3. Select **Production Mode**
4. Choose location (e.g., us-central1)
5. Go to **Rules** tab
6. Replace rules with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read: if true;
      allow create: if request.resource.data.name.size() > 0 && 
                       request.resource.data.message.size() > 0 &&
                       request.resource.data.message.size() <= 200;
      allow delete: if true;
      allow update: if false;
    }
  }
}
```
7. Click "Publish"

#### Step 5: Enable Realtime Database (for Polls)
1. In Firebase Console, go to **Realtime Database**
2. Click "Create Database"
3. Select **Production Mode**
4. Choose location
5. Go to **Rules** tab
6. Replace rules with:
```json
{
  "rules": {
    "polls": {
      ".read": true,
      ".write": true,
      "question_$index": {
        ".validate": "index.matches(/^[0-9]+$/)"
      }
    }
  }
}
```
7. Click "Publish"

## 🎨 Customization

### Change Birthday Person Name
Edit `index.html` line ~34:
```html
<span class="name-glow">MD TaUsHiF Alam</span>
```

### Change Shayari Text
Edit `index.html` lines ~46-48:
```html
<span class="shayari-line-1">Your first line here</span>
<span class="shayari-line-2">Your second line here</span>
```

### Add Gallery Images
Edit `index.html` gallery slides to include actual images:
```html
<div class="gallery-slide" style="background-image: url('image.jpg')">
    <!-- content -->
</div>
```

### Update Poll Questions
Edit `script.js` line ~23:
```javascript
const pollQuestions = [
    {
        question: "Your question?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    },
    // Add more questions
];
```

### Add Crush Names for Spin Game
Edit `script.js` line ~11:
```javascript
const crushNames = ['Name 1', 'Name 2', 'Name 3', 'Name 4', 'Name 5', 'Name 6'];
```

### Update Social Links
Edit `script.js` in `setupSocialButtons()` function:
```javascript
const username = prompt('Enter Instagram username:', 'your_username');
```

### Change Background Music
Edit `index.html` line ~159:
```html
<source src="https://your-music-url.mp3" type="audio/mpeg">
```

## 📱 Mobile Responsiveness

The website is fully responsive with breakpoints for:
- 📱 Mobile: < 480px
- 📱 Tablet: < 768px
- 💻 Desktop: > 768px

All animations and effects work smoothly on mobile devices with optimized performance.

## 🌐 Deploy on GitHub Pages

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Create new repository: `tsf-birthday` (or any name)
3. Make it public

### Step 2: Push Code to GitHub
```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Birthday wishes website"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/tsf-birthday.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Under "Source", select **Deploy from a branch**
4. Select **main** branch
5. Select **/root** folder
6. Click **Save**

### Step 4: Access Your Website
Your website will be available at:
```
https://yourusername.github.io/tsf-birthday
```

Wait 2-3 minutes for GitHub Pages to deploy.

### Update Website Content
To update:
1. Make changes to local files
2. Commit and push to GitHub
3. Changes will be live in 2-3 minutes

```bash
git add .
git commit -m "Update content"
git push
```

## 🔧 Troubleshooting

### Website not loading?
- Check browser console for errors (F12)
- Ensure all files are in the same directory
- Clear browser cache (Ctrl+Shift+Delete)

### Firebase not working?
- Verify API key is correct in `firebase.js`
- Check Firebase Console for any errors
- Ensure Firestore and Realtime Database are enabled
- Check security rules are properly set

### Messages not saving?
- Without Firebase: Saved to browser's localStorage (data lost if cleared)
- With Firebase: Check Firestore database and security rules
- Try opening in incognito mode

### Music autoplay not working?
- Browsers require user interaction before autoplay
- Click anywhere on the page to resume music
- Some browsers have strict autoplay policies

### Gallery not sliding?
- Check if JavaScript is enabled
- Ensure `script.js` is loaded
- Check browser console for errors

## 📊 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Security Notes

- **Firebase Rules**: Set proper rules in Firebase Console
- **Data Privacy**: Messages are public by default - configure rules for privacy
- **Authentication**: Current setup allows anonymous access - add auth if needed
- **Rate Limiting**: Consider adding rate limiting for production

## 📝 Front Matter Notes

- All CSS is in `style.css` for easy modification
- All JavaScript logic is modular and commented
- Firebase functions have fallback to localStorage
- No external heavy libraries (except Firebase SDK)
- Optimized for performance and mobile devices

## 🎯 Future Enhancements

- [ ] User authentication
- [ ] Message likes/reactions
- [ ] Image upload for gallery
- [ ] Custom background music upload
- [ ] Guest book with comments
- [ ] Birthday countdown timer
- [ ] Video messages
- [ ] Animations library integration

## 📞 Support

For issues or questions:
1. Check browser console (F12) for errors
2. Review Firebase setup instructions
3. Verify all API keys are correct
4. Clear cache and reload

## 📄 License

Free to use and modify for personal use.

## 🎉 Credits

Built with ❤️ for celebrating special moments!

---

**Enjoy your Birthday Celebration Website! 🎂✨**
