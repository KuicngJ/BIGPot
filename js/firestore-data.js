// ============================================================
// FIRESTORE DATA MANAGEMENT
// Menangani penyimpanan dan pengambilan data dari Firestore
// ============================================================

/**
 * Save user's quiz progress & personality results to Firestore
 * @param {Object} data - { personality, planets, answers }
 */
async function saveQuizProgressToFirestore(data) {
  if (!firebase.auth().currentUser) {
    showToast('Silakan login terlebih dahulu', 'warning');
    return false;
  }

  const userId = firebase.auth().currentUser.uid;
  const db = firebase.firestore();

  try {
    const quizData = {
      userId: userId,
      personality: data.personality || {},
      planets: data.planets || [],
      answers: data.answers || [],
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      completedAt: new Date().toISOString()
    };

    // Save to users/{userId}/quizProgress
    await db.collection('users').doc(userId).collection('quizProgress').add(quizData);

    // Also update user's latest result
    await db.collection('users').doc(userId).update({
      latestPersonality: data.personality,
      latestPlanets: data.planets,
      lastQuizCompletedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    showToast('Progress tersimpan ke akun Anda', 'success');
    return true;
  } catch (error) {
    console.error('Error saving quiz progress:', error);
    showToast('Gagal menyimpan progress', 'error');
    return false;
  }
}

/**
 * Fetch user's quiz history from Firestore
 */
async function fetchUserQuizHistory() {
  if (!firebase.auth().currentUser) return [];

  const userId = firebase.auth().currentUser.uid;
  const db = firebase.firestore();

  try {
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('quizProgress')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    return [];
  }
}

/**
 * Fetch latest quiz result for display
 */
async function fetchLatestQuizResult() {
  if (!firebase.auth().currentUser) return null;

  const userId = firebase.auth().currentUser.uid;
  const db = firebase.firestore();

  try {
    const doc = await db.collection('users').doc(userId).get();
    if (doc.exists) {
      return {
        personality: doc.data().latestPersonality,
        planets: doc.data().latestPlanets,
        completedAt: doc.data().lastQuizCompletedAt
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching latest result:', error);
    return null;
  }
}

// ============================================================
// ADMIN / PANITIA FUNCTIONS
// ============================================================

/**
 * Check if current user is panitia/admin
 */
async function isUserPanitia() {
  if (!firebase.auth().currentUser) return false;

  const userId = firebase.auth().currentUser.uid;
  const db = firebase.firestore();

  try {
    const doc = await db.collection('users').doc(userId).get();
    return doc.exists && (doc.data().role === 'panitia' || doc.data().role === 'admin');
  } catch (error) {
    console.error('Error checking panitia status:', error);
    return false;
  }
}

/**
 * Get all events (lombas) from Firestore
 */
async function fetchAllEvents() {
  const db = firebase.firestore();

  try {
    const snapshot = await db
      .collection('events')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

/**
 * Create new event (for panitia)
 */
async function createEvent(eventData) {
  if (!await isUserPanitia()) {
    showToast('Anda tidak memiliki akses untuk membuat event', 'error');
    return null;
  }

  const db = firebase.firestore();
  const userId = firebase.auth().currentUser.uid;

  try {
    const newEvent = {
      title: eventData.title,
      description: eventData.description,
      category: eventData.category,
      icon: eventData.icon,
      color: eventData.color,
      prize: eventData.prize,
      deadline: eventData.deadline,
      link: eventData.link,
      waContact: eventData.waContact,
      createdBy: userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'active'
    };

    const docRef = await db.collection('events').add(newEvent);
    showToast('Event berhasil dibuat', 'success');
    return { id: docRef.id, ...newEvent };
  } catch (error) {
    console.error('Error creating event:', error);
    showToast('Gagal membuat event', 'error');
    return null;
  }
}

/**
 * Update existing event (for panitia)
 */
async function updateEvent(eventId, eventData) {
  if (!await isUserPanitia()) {
    showToast('Anda tidak memiliki akses untuk mengubah event', 'error');
    return false;
  }

  const db = firebase.firestore();

  try {
    await db.collection('events').doc(eventId).update({
      ...eventData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    showToast('Event berhasil diperbarui', 'success');
    return true;
  } catch (error) {
    console.error('Error updating event:', error);
    showToast('Gagal memperbarui event', 'error');
    return false;
  }
}

/**
 * Delete event (for panitia)
 */
async function deleteEvent(eventId) {
  if (!await isUserPanitia()) {
    showToast('Anda tidak memiliki akses untuk menghapus event', 'error');
    return false;
  }

  const db = firebase.firestore();

  try {
    await db.collection('events').doc(eventId).delete();
    showToast('Event berhasil dihapus', 'success');
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    showToast('Gagal menghapus event', 'error');
    return false;
  }
}

/**
 * Get panitia dashboard stats
 */
async function getPanitiaStats() {
  if (!await isUserPanitia()) return null;

  const db = firebase.firestore();
  const userId = firebase.auth().currentUser.uid;

  try {
    // Get events created by this panitia
    const eventsSnapshot = await db
      .collection('events')
      .where('createdBy', '==', userId)
      .get();

    // Get total event views/interactions
    const allEvents = await fetchAllEvents();

    return {
      totalEvents: eventsSnapshot.size,
      allEvents: allEvents.length,
      myEvents: eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };
  } catch (error) {
    console.error('Error getting panitia stats:', error);
    return null;
  }
}
