// ============================================================
// QUIZ RESULT SAVING INTEGRATION
// Hook hasil quiz ke Firestore setelah selesai
// ============================================================

/**
 * Modified quiz completion - save to Firestore
 */
async function completeQuizWithSave(resultData) {
  // resultData should contain: personality, planets, answers
  
  const user = firebase.auth().currentUser;
  
  if (user) {
    // Save to Firestore for logged-in users
    const saved = await saveQuizProgressToFirestore(resultData);
    if (saved) {
      console.log('✓ Quiz progress saved to Firestore');
    }
  } else {
    console.log('ℹ User not logged in - results saved locally only');
  }

  // Show result page regardless of save status
  showResultPage(resultData);
}

/**
 * Show quiz completion with option to save/login
 */
function showQuizCompletionPrompt(resultData) {
  const user = firebase.auth().currentUser;
  
  if (user) {
    // Auto-save for logged-in users
    completeQuizWithSave(resultData);
  } else {
    // Show prompt for non-logged-in users
    const modal = document.createElement('div');
    modal.className = 'quiz-save-prompt';
    modal.innerHTML = `
      <div class="qsp-content">
        <i class="ti ti-star" style="font-size: 32px; color: var(--orange); margin-bottom: 12px; display: block;"></i>
        <h2>Simpan Hasil Kamu?</h2>
        <p>Login untuk menyimpan progress dan result quiz kamu, sehingga bisa diakses kapan saja!</p>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button class="btn-full" style="flex: 1; background: var(--blue);" onclick="this.parentElement.parentElement.parentElement.remove(); showLoginPage(); return false;">Login & Simpan</button>
          <button class="btn-full" style="flex: 1; background: var(--ink3);" onclick="this.parentElement.parentElement.parentElement.remove(); showResultPage(${JSON.stringify(resultData)});">Lihat Hasil Dulu</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

/**
 * Load user's previous results in profile
 */
async function loadUserQuizResults() {
  const resultsContainer = document.getElementById('user-quiz-results');
  if (!resultsContainer) return;

  const history = await fetchUserQuizHistory();
  
  if (history.length === 0) {
    resultsContainer.innerHTML = `
      <p style="text-align: center; color: var(--ink3);">Belum ada quiz yang diselesaikan</p>
    `;
    return;
  }

  resultsContainer.innerHTML = `
    <div style="max-height: 300px; overflow-y: auto;">
      ${history.map((result, idx) => `
        <div class="quiz-result-item" style="padding: 12px; border-bottom: 1px solid var(--surf3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong>#${idx + 1}: ${result.personality?.name || 'Unknown'}</strong>
            <small style="color: var(--ink3);">${new Date(result.timestamp.toDate()).toLocaleDateString()}</small>
          </div>
          <small style="color: var(--ink3);">Score: ${result.personality?.score || 'N/A'}</small>
        </div>
      `).join('')}
    </div>
  `;
}
