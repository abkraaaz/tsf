/* ============================================
   FIREBASE CONFIGURATION & SETUP
   ============================================ */

// Firebase Project: tsf-bday
// Configured: February 12, 2026

const firebaseConfig = {
    apiKey: "AIzaSyCQ7U9fsxE6CoUC9TBVPYGmZ02jac5Hzw0",
    authDomain: "tsf-bday.firebaseapp.com",
    projectId: "tsf-bday",
    storageBucket: "tsf-bday.firebasestorage.app",
    messagingSenderId: "639692480625",
    appId: "1:639692480625:web:76a7ed3fcc630a4fc5fbd0",
    measurementId: "G-FN3M7P9D8E"
};

// Initialize Firebase
let db = null;
let realtimeDb = null;

try {
    // Check if Firebase is loaded
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        realtimeDb = firebase.database();
        console.log('Firebase initialized successfully');
    } else {
        console.log('Firebase SDK not loaded - using localStorage fallback');
    }
} catch (error) {
    console.log('Firebase initialization error - using localStorage fallback', error);
}

/* ============================================
   FIRESTORE FUNCTIONS - MESSAGES
   ============================================ */

async function saveMessageToDatabase(messageData) {
    try {
        if (!db) {
            console.log('Firestore not available - saved to localStorage only');
            return;
        }

        await db.collection('messages').add({
            name: messageData.name,
            message: messageData.message,
            timestamp: new Date(messageData.timestamp),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('Message saved to Firestore');
        loadMessagesFromDatabase();
    } catch (error) {
        console.error('Error saving message:', error);
    }
}

async function loadMessagesFromDatabase() {
    try {
        if (!db) {
            console.log('Firestore not available - using localStorage');
            return;
        }

        const querySnapshot = await db.collection('messages')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        const messages = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({
                id: doc.id,
                name: data.name,
                message: data.message,
                timestamp: data.createdAt ? data.createdAt.toDate().getTime() : data.timestamp
            });
        });

        // Update localStorage
        localStorage.setItem('birthdayMessages', JSON.stringify(messages));

        // Update UI if function exists
        if (typeof displayMessages === 'function') {
            displayMessages(messages);
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        // Fall back to localStorage
        if (typeof loadMessagesFromFirebase === 'function') {
            loadMessagesFromFirebase();
        }
    }
}

async function deleteMessageFromDatabase(messageId) {
    try {
        if (!db) {
            console.log('Firestore not available');
            return false;
        }

        await db.collection('messages').doc(messageId).delete();
        console.log('Message deleted from Firestore');
        loadMessagesFromDatabase();
        return true;
    } catch (error) {
        console.error('Error deleting message:', error);
        return false;
    }
}

// Set up real-time listener for messages
function setupRealtimeMessageListener() {
    try {
        if (!db) {
            console.log('Firestore not available - real-time listener not set up');
            return;
        }

        db.collection('messages')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .onSnapshot((querySnapshot) => {
                const messages = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    messages.push({
                        id: doc.id,
                        name: data.name,
                        message: data.message,
                        timestamp: data.createdAt ? data.createdAt.toDate().getTime() : data.timestamp
                    });
                });

                // Update localStorage
                localStorage.setItem('birthdayMessages', JSON.stringify(messages));

                // Update UI if function exists
                if (typeof displayMessages === 'function') {
                    displayMessages(messages);
                }
            });

        console.log('Real-time message listener set up');
    } catch (error) {
        console.error('Error setting up real-time listener:', error);
    }
}

/* ============================================
   REALTIME DATABASE FUNCTIONS - POLLS
   ============================================ */

function savePollVoteToDatabase(questionIdx, optionIdx) {
    try {
        if (!realtimeDb) {
            console.log('Realtime Database not available - saved to localStorage only');
            return;
        }

        const voteRef = realtimeDb.ref(`polls/question_${questionIdx}/option_${optionIdx}`);
        
        voteRef.once('value', (snapshot) => {
            const currentVotes = snapshot.val() || 0;
            voteRef.set(currentVotes + 1);
        });

        console.log('Poll vote saved to Realtime Database');
    } catch (error) {
        console.error('Error saving poll vote:', error);
    }
}

async function loadPollDataFromDatabase() {
    try {
        if (!realtimeDb) {
            console.log('Realtime Database not available - using localStorage');
            return;
        }

        const snapshot = await realtimeDb.ref('polls').once('value');
        const pollData = snapshot.val();

        if (pollData) {
            // Convert Realtime Database format to localStorage format
            const votes = {};
            for (const [key, options] of Object.entries(pollData)) {
                const questionIdx = parseInt(key.split('_')[1]);
                votes[questionIdx] = options;
            }
            localStorage.setItem('pollVotes', JSON.stringify(votes));
            console.log('Poll data loaded from Realtime Database');
        }
    } catch (error) {
        console.error('Error loading poll data:', error);
    }
}

function setupRealtimePollListener() {
    try {
        if (!realtimeDb) {
            console.log('Realtime Database not available - real-time listener not set up');
            return;
        }

        realtimeDb.ref('polls').on('value', (snapshot) => {
            const pollData = snapshot.val();
            
            if (pollData && typeof displayPoll === 'function') {
                // Convert and update localStorage with latest data
                const votes = {};
                for (const [key, options] of Object.entries(pollData)) {
                    const questionIdx = parseInt(key.split('_')[1]);
                    votes[questionIdx] = options;
                }
                localStorage.setItem('pollVotes', JSON.stringify(votes));
                
                // Trigger UI update
                displayPoll();
            }
        });

        console.log('Real-time poll listener set up');
    } catch (error) {
        console.error('Error setting up real-time poll listener:', error);
    }
}

/* ============================================
   GAME ACTIVITY TRACKING - FIREBASE
   ============================================ */

async function saveGameActivityToDatabase(gameName, gameData) {
    try {
        if (!db) {
            console.log('Firestore not available - saved to localStorage only');
            return;
        }

        await db.collection('gameActivities').add({
            game: gameName,
            data: gameData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('Game activity saved to Firestore');
    } catch (error) {
        console.error('Error saving game activity:', error);
    }
}

async function loadGameActivitiesFromDatabase() {
    try {
        if (!db) {
            console.log('Firestore not available - using localStorage');
            return;
        }

        const querySnapshot = await db.collection('gameActivities')
            .orderBy('createdAt', 'desc')
            .limit(500)
            .get();

        const activities = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            activities.push({
                id: doc.id,
                game: data.game,
                data: data.data,
                timestamp: data.createdAt ? data.createdAt.toDate().getTime() : new Date().getTime()
            });
        });

        // Update localStorage
        localStorage.setItem('gameActivities', JSON.stringify(activities));
        console.log('Game activities loaded from Firestore');
    } catch (error) {
        console.error('Error loading game activities:', error);
    }
}

function setupGameActivityListener() {
    try {
        if (!db) {
            console.log('Firestore not available - game activity listener not set up');
            return;
        }

        db.collection('gameActivities')
            .orderBy('createdAt', 'desc')
            .limit(500)
            .onSnapshot((querySnapshot) => {
                const activities = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    activities.push({
                        id: doc.id,
                        game: data.game,
                        data: data.data,
                        timestamp: data.createdAt ? data.createdAt.toDate().getTime() : new Date().getTime()
                    });
                });

                // Update localStorage
                localStorage.setItem('gameActivities', JSON.stringify(activities));
            });

        console.log('Game activity real-time listener set up');
    } catch (error) {
        console.error('Error setting up game activity listener:', error);
    }
}

/* ============================================
   DATABASE INITIALIZATION
   ============================================ */

// Initialize listeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization to ensure Firebase is fully loaded
    setTimeout(() => {
        setupRealtimeMessageListener();
        setupRealtimePollListener();
        setupGameActivityListener();
        loadPollDataFromDatabase();
        loadGameActivitiesFromDatabase();
    }, 2000);
});

/* ============================================
   FIREBASE SECURITY RULES REFERENCE
   ============================================ */

/*
// Copy these rules to Firebase Console → Firestore → Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read: if true;
      allow create: if request.resource.data.name.size() > 0 && 
                       request.resource.data.message.size() > 0 &&
                       request.resource.data.message.size() <= 200;
      allow delete: if request.auth.uid != null; // Only authenticated users can delete
      allow update: if false;
    }
    
    match /gameActivities/{activityId} {
      allow read: if true;
      allow create: if true;
      allow update: if false;
      allow delete: if true;
    }
  }
}
*/

/*
// For Realtime Database Rules:

{
  "rules": {
    "polls": {
      ".read": true,
      ".write": true,
      "question_$index": {
        ".validate": "index.matches(/^[0-9]+$/)"
      }
    },
    "messages": {
      ".read": true,
      ".write": true
    }
  }
}

// Note: In production, set proper authentication rules
*/

/* ============================================
   HELPER FUNCTIONS
   ============================================ */

function isFirebaseInitialized() {
    return db !== null && realtimeDb !== null;
}

function getFirebaseStatus() {
    return {
        initialized: isFirebaseInitialized(),
        firestoreAvailable: db !== null,
        realtimeDatabaseAvailable: realtimeDb !== null
    };
}

// Log Firebase status
window.addEventListener('load', () => {
    console.log('Firebase Status:', getFirebaseStatus());
});

/* ============================================
   IMPORTANT: SETUP INSTRUCTIONS
   ============================================ */

/*

FIREBASE SETUP GUIDE:

1. Create Firebase Project:
   - Go to https://console.firebase.google.com/
   - Click "Add Project"
   - Enter project name
   - Enable Google Analytics (optional)

2. Get Configuration:
   - In Firebase Console, click on your project
   - Go to Settings → Project Settings
   - Copy the config object from Web app section
   - Replace the firebaseConfig object above

3. Enable Firestore:
   - In Firebase Console, go to Firestore Database
   - Click "Create Database"
   - Choose production mode
   - Select a location
   - Once created, go to Rules tab
   - Paste the security rules from the comment above

4. Enable Realtime Database (for polls):
   - In Firebase Console, go to Realtime Database
   - Click "Create Database"
   - Choose production mode
   - Select a location
   - Once created, go to Rules tab
   - Paste the security rules from the comment above

5. Disable Anonymous Authentication (Optional):
   - Go to Authentication → Sign-in methods
   - Anonymous should be disabled for security

6. Deploy to GitHub Pages:
   - Push code to GitHub repository
   - Go to Settings → Pages
   - Set source to "Deploy from a branch"
   - Select main branch
   - Site will be available at https://username.github.io/repo-name/

*/
