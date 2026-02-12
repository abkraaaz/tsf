# ⚡ QUICK START GUIDE

## 🎯 Get Started in 5 Minutes

### Without Firebase (Quick Test)
```
1. Open index.html in browser
2. Enjoy all animations & effects
3. Messages saved to browser only
```

### With Firebase (Full Features)
```
1. Get Firebase credentials (5 min)
2. Update firebase.js
3. Test locally
4. Push to GitHub
5. Enable GitHub Pages
```

---

## 📋 Step-by-Step: Firebase Setup

### 1️⃣ Firebase Credentials (5 minutes)
- Go: https://console.firebase.google.com/
- Create project → "taushif-birthday"
- Register web app
- Copy the config object

### 2️⃣ Update firebase.js
```javascript
// Find this section and replace YOUR values

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",           // Replace this
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3️⃣ Enable Firestore
- Firebase Console → Firestore Database
- Create Database (Production Mode)
- Go to Rules, paste:
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

### 4️⃣ Enable Realtime Database
- Firebase Console → Realtime Database
- Create Database (Production Mode)
- Go to Rules, paste:
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

---

## 🚀 GitHub Deployment

### Quick Version
```bash
# Terminal/Command Prompt

cd path/to/tsf-birthday
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOU/tsf-birthday.git
git push -u origin main
```

### Then Enable GitHub Pages
- Settings → Pages
- Source: main branch, /root folder
- Site will be at: https://YOU.github.io/tsf-birthday

---

## 🎨 Customization Quick Tips

### Change Name
**File:** index.html (Line 34)
```html
<!-- Change from: -->
<span class="name-glow">MD TaUsHiF Alam</span>

<!-- To: -->
<span class="name-glow">Your Name Here</span>
```

### Change Poll Questions
**File:** script.js (Line 23)
```javascript
const pollQuestions = [
    {
        question: "Your question here?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    },
    // Add more questions...
];
```

### Change Crush Names
**File:** script.js (Line 11)
```javascript
const crushNames = ['Name1', 'Name2', 'Name3', 'Name4', 'Name5', 'Name6'];
```

### Change Shayari
**File:** index.html (Lines 46-48)
```html
<span class="shayari-line-1">Your first line</span>
<span class="shayari-line-2">Your second line</span>
```

---

## 🧪 Testing Checklist

- [ ] All sections visible on scroll
- [ ] Gallery slides working (click buttons)
- [ ] Heart rain animation visible
- [ ] Firecracker explosions visible
- [ ] Message submission working
- [ ] Poll voting working
- [ ] Love calculator calculating
- [ ] FLAMES game working
- [ ] Spin wheel spinning
- [ ] Background music playing (click to start)
- [ ] Mobile responsive (test on phone)

---

## 🔗 Important Links

- **Firebase Console:** https://console.firebase.google.com/
- **GitHub:** https://github.com
- **Your Site:** https://yourusername.github.io/tsf-birthday

---

## 📞 Common Issues & Fixes

### Website loads but Firebase not working
✅ Check browser console (F12) for errors
✅ Verify API key in firebase.js
✅ Ensure Firestore rules are published

### Messages not saving
✅ Check if Firebase is enabled
✅ Test without Firebase (uses localStorage)
✅ Check browser console for errors

### GitHub Pages not showing website
✅ Wait 5 minutes after pushing
✅ Hard refresh: Ctrl+Shift+R
✅ Check Settings → Pages (branch = main)

### Nothing works locally
✅ Make sure index.html is in same folder as CSS/JS
✅ Open with `http://` not `file://`
✅ Check browser console for errors

---

## 📱 Mobile Testing

```bash
# Test on current device
1. Open http://localhost:8000 (local server)
2. Or use ngrok to expose to internet
3. Test on phone by scanning QR code
```

**Or just upload to GitHub and test on phone with the live URL**

---

## 🎉 You're Done!

Your Birthday Website is ready! 

### Final Checklist:
- [ ] Code on GitHub
- [ ] Firebase connected
- [ ] GitHub Pages enabled
- [ ] All features tested
- [ ] Mobile friendly
- [ ] Share the URL with everyone! 🎂

---

## 💡 Next Steps (Optional)

- Add real photos to gallery
- Add more poll questions
- Update social media links
- Add custom domain name
- Regular backups
- Monitor Firebase usage

---

**Need more help?** See DEPLOYMENT_GUIDE.md for detailed instructions!
