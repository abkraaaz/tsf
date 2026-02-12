# 🚀 DEPLOYMENT GUIDE - Birthday Website

Complete step-by-step guide to deploy your Birthday Wishes Website.

---

## 📋 Table of Contents
1. [Firebase Setup](#firebase-setup)
2. [GitHub Upload](#github-upload)
3. [GitHub Pages Deployment](#github-pages-deployment)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Troubleshooting](#troubleshooting)

---

## 🔥 Firebase Setup

### Prerequisites
- Google account
- Internet connection
- Text editor for updating code

### Step 1: Create Firebase Project

1. **Open Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with Google account
   - Click **"Create Project"**

2. **Project Details**
   - Project name: `taushif-birthday` (or any name)
   - Disable Google Analytics (optional)
   - Click **"Create Project"**
   - Wait for project to be created (2-3 minutes)

### Step 2: Register Web App

1. In Firebase Console, click **"Project Settings"** (gear icon)
2. Go to **"General"** tab
3. Under "Your apps", click **"</>  Web"** icon
4. Enter app name: `Birthday Website`
5. Click **"Register app"**
6. Copy the Firebase configuration (you'll use this next)

### Step 3: Update firebase.js

1. Open `firebase.js` in your text editor
2. Find the `firebaseConfig` object at the top
3. Replace with your copied configuration:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDxxx...",
    authDomain: "project-name.firebaseapp.com",
    projectId: "project-name",
    storageBucket: "project-name.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcd1234"
};
```

4. Save the file

### Step 4: Setup Firestore Database

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create Database"**
3. Choose **"Production Mode"** (not test mode)
4. Select location: `us-central1` (or closest to users)
5. Click "Create"

**Wait for creation to complete (takes ~1 minute)**

6. Go to **"Rules"** tab
7. Replace all rules with:

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

8. Click **"Publish"**

### Step 5: Setup Realtime Database

1. In Firebase Console, go to **"Realtime Database"**
2. Click **"Create Database"**
3. Choose **"Production Mode"**
4. Select location (same as Firestore)
5. Click "Create"

**Wait for creation (~1 minute)**

6. Go to **"Rules"** tab
7. Replace with:

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

8. Click **"Publish"**

---

## 📤 GitHub Upload

### Prerequisites
- GitHub account (free at https://github.com)
- Git installed on computer (optional - can use GitHub web interface)

### Option A: Using Git Command Line (Recommended)

#### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `tsf-birthday` (or any name)
3. Description: "Birthday Wishes Website"
4. Choose **"Public"** (to use GitHub Pages)
5. **Don't** initialize with README (we have one)
6. Click **"Create repository"**

#### Step 2: Upload Files Using Git

1. **Open Terminal/Command Prompt**
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Use Terminal app
   - Linux: Use any terminal

2. **Navigate to your project folder**
   ```bash
   cd path/to/tsf-birthday
   ```

3. **Initialize Git Repository**
   ```bash
   git init
   ```

4. **Add Files**
   ```bash
   git add .
   ```

5. **Create Initial Commit**
   ```bash
   git commit -m "Initial commit: Birthday website with animations and Firebase"
   ```

6. **Add Remote Repository**
   ```bash
   # Replace with YOUR GitHub username and repository name
   git remote add origin https://github.com/yourusername/tsf-birthday.git
   ```

7. **Rename Main Branch** (if needed)
   ```bash
   git branch -M main
   ```

8. **Push to GitHub**
   ```bash
   git push -u origin main
   ```

**Done!** Your code is now on GitHub.

### Option B: Using GitHub Web Interface (No Git Required)

1. Go to your newly created repository
2. Click **"Add file"** → **"Upload files"**
3. Drag and drop all files from `tsf/` folder
4. You can select multiple files at once
5. Add commit message at bottom
6. Click **"Commit changes"**

---

## 🌐 GitHub Pages Deployment

### Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** (top right)
3. Scroll to **"Pages"** section (left sidebar)
4. Under "Source", select **"Deploy from a branch"**
5. Select branch: **"main"**
6. Select folder: **"/ (root)"**
7. Click **"Save"**

**Wait 2-3 minutes... Your site will appear at:**
```
https://yourusername.github.io/tsf-birthday
```

### Verify Deployment

1. Scroll back to "Pages" section
2. You should see green checkmark and live URL
3. Copy the URL and test it in browser
4. Share with everyone! 🎉

---

## 🔧 Custom Domain Setup (Optional)

### Add Custom Domain

1. Buy a domain (GoDaddy, Namecheap, etc.)
2. In GitHub Settings → Pages
3. Under "Custom domain", enter your domain name
4. Click **"Save"**
5. Check box for "Enforce HTTPS"

### Configure Domain DNS

Contact your domain provider to configure DNS:
- **A Records**: Point to GitHub IP addresses
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

OR use **CNAME record**:
- Point to: `yourusername.github.io`

**Wait 24 hours for DNS propagation**

---

## 📝 Making Updates

### Update Website Content

1. **Edit files locally** in your text editor
2. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Update message/content"
   git push
   ```
3. **Wait 2-3 minutes** - changes go live automatically!

### Example Updates

**Update Birthday Person Name in HTML:**
```bash
git add index.html
git commit -m "Update: Change birthday person name"
git push
```

**Add New Gallery Images:**
```bash
git add index.html
git commit -m "Add new gallery slides"
git push
```

**Fix Bugs or Animations:**
```bash
git add script.js style.css
git commit -m "Fix: Animation performance issues"
git push
```

---

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Firebase config updated in `firebase.js`
- [ ] Firestore database enabled and rules set
- [ ] Realtime Database enabled and rules set
- [ ] GitHub repository created
- [ ] All files pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Website accessible at `https://yourusername.github.io/tsf-birthday`
- [ ] Messages can be submitted and viewed
- [ ] Polls are working
- [ ] Gallery slides working
- [ ] All animations visible

---

## 🐛 Troubleshooting

### Website Shows 404 Error

**Problem:** "Page not found"

**Solutions:**
1. Wait 5 minutes for GitHub Pages to deploy
2. Go to Settings → Pages, verify "main" branch is selected
3. Verify repository is **Public** (not private)
4. Check GitHub Pages isn't disabled

### Firebase Not Working

**Problem:** Messages not saving

**Solutions:**
1. Check Firebase config in `firebase.js` is correct
2. Verify Firestore database is created (not in test mode)
3. Check browser console (F12) for error messages
4. Verify security rules are published
5. Try using incognito/private browser window

### Repository Shows Old Code

**Problem:** Code not updating on website

**Solutions:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear entire browser cache
3. Check "git push" completed successfully
4. Wait 5 minutes for GitHub Pages to rebuild

### Music Won't Play Automatically

**Problem:** Background music doesn't auto-play

**Reasons:**
- Browser autoplay policy - requires user interaction first
- Mobile browsers are stricter
- Some browsers disable autoplay for security

**Solution:** Music will start after user clicks anywhere on page

### Message History Lost

**Problem:** Can't see old messages after refresh

**Causes:**
1. Using localStorage without Firebase (browser data)
2. Firebase database rules preventing read access
3. Different browser/device (each has separate storage)

**Solutions:**
1. Ensure Firebase is properly configured
2. Check Firestore rules allow `read: true`
3. Use same browser/device
4. Cloud backup via Firebase (if configured)

---

## 🎓 Advanced Tips

### Backup Code

Keep a local backup:
```bash
git branch backup
git push -u origin backup
```

### Rollback to Previous Version

```bash
# See all commits
git log

# Go back to specific commit
git checkout commit-hash

# Or go back one commit
git revert HEAD
git push
```

### Debug Firebase

In browser console (F12):
```javascript
// Check Firebase status
console.log(firebase.apps);
console.log(db);
console.log(realtimeDb);
```

### Monitor GitHub Pages Deployment

1. Go to repository
2. Click **"Actions"** tab
3. See deployment status and logs

---

## 📞 Getting Help

**Firebase Questions:**
- Firebase Docs: https://firebase.google.com/docs
- Stack Overflow: #firebase tag

**GitHub Questions:**
- GitHub Help: https://docs.github.com
- GitHub Community: https://github.community

**This Project Issues:**
- Check browser console (F12) for errors
- Verify all files are present
- Ensure API keys are correct
- Review this guide again

---

## 🎉 Success!

Your Birthday Wishes Website is now live! 

**Share the URL:**
```
https://yourusername.github.io/tsf-birthday
```

**Don't forget to:**
- ✅ Test all features
- ✅ Share with friends
- ✅ Make backups
- ✅ Keep Firebase config secure

---

**Enjoy celebrating! 🎂✨**
