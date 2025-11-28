/**
 * LEXORA - Library Page JavaScript
 * Load and display user's vocabulary library
 */

// API Base URL
const API_BASE = 'http://127.0.0.1:5000';

// DOM Elements
const wordsGrid = document.getElementById('wordsGrid');
const totalWordsElement = document.getElementById('totalWords');
const streakCountElement = document.getElementById('streakCount');

// ============== INITIALIZATION ==============
document.addEventListener('DOMContentLoaded', () => {
    loadLibrary();
    loadInitialStreak();
});

// ============== LOAD INITIAL STREAK ==============
async function loadInitialStreak() {
    try {
        const response = await fetch(`${API_BASE}/api/streak`);
        if (response.ok) {
            const data = await response.json();
            
            // Update navbar streak badge
            const streakCount = document.getElementById('streakCount');
            if (streakCount) {
                streakCount.textContent = data.current || 0;
            }
        }
    } catch (error) {
        console.error('Error loading initial streak:', error);
    }
}

// ============== LOAD LIBRARY FROM BACKEND ==============
async function loadLibrary() {
    try {
        const response = await fetch(`${API_BASE}/api/library`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Global değişkene kaydet
        wordsData = data.words || [];
        
        // Update streak in navbar
        if (streakCountElement && data.streak !== undefined) {
            streakCountElement.textContent = data.streak;
        }
        
        // Update total words count
        if (totalWordsElement) {
            totalWordsElement.textContent = wordsData.length;
        }
        
        // Display words
        displayWords(wordsData);
        
    } catch (error) {
        console.error('Error loading library:', error);
        showError('Failed to load library. Please refresh the page.');
    }
}

// ============== DISPLAY WORDS ==============
function displayWords(words) {
    if (!words || words.length === 0) {
        wordsGrid.innerHTML = `
            <div class="empty-library">
                <div class="icon">📚</div>
                <h3>No words saved yet</h3>
                <p style="margin-top: 8px; color: #888;">Start searching words in the Dictionary!</p>
            </div>
        `;
        return;
    }
    
    wordsGrid.innerHTML = words.map((wordData, index) => {
        const synonymsHTML = wordData.synonyms && wordData.synonyms.length > 0
            ? wordData.synonyms.map(syn => `<span class="synonym-tag">${syn}</span>`).join('')
            : '<span style="color: #666;">No synonyms available</span>';
        
        return `
        <div class="word-card" data-word="${wordData.word}">
            <div class="card-word">${wordData.word}</div>
            
            <div class="card-section">
                <div class="card-label">Meaning</div>
                <div class="card-definition">
                    ${wordData.meaning || 'No meaning available'}
                </div>
            </div>
            
            <div class="card-section">
                <div class="card-label">Synonyms</div>
                <div class="card-synonyms">
                    ${synonymsHTML}
                </div>
            </div>
            
            <div class="card-footer">
                <button class="card-delete-btn" data-word="${wordData.word}">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `}).join('');
    
    // ✅ DELETE BUTONLARINA EVENT LISTENER EKLE
    document.querySelectorAll('.card-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Kartın click eventi tetiklenmesin
            const word = btn.dataset.word;
            deleteWord(word);
        });
    });
    
    // Kartlara tıklama event'i ekle (büyütme için)
    document.querySelectorAll('.word-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Delete butonuna tıklanmadıysa
            if (!e.target.closest('.card-delete-btn')) {
                expandCard(card);
            }
        });
    });
}

// ============== DELETE WORD ==============
async function deleteWord(word) {
    if (!confirm(`Delete "${word}" from your library?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/delete-word`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: word })  // ✅ word → text
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Reload library after deletion
        loadLibrary();
        
    } catch (error) {
        console.error('Error deleting word:', error);
        alert('Failed to delete word. Please try again.');
    }
}

// ============== EXPAND CARD (MODAL) ==============
let currentCardIndex = 0;

function expandCard(cardElement) {
    const word = cardElement.dataset.word;
    currentCardIndex = wordsData.findIndex(w => w.word === word);
    
    if (currentCardIndex === -1) return;
    
    showCardModal(currentCardIndex);
}

function showCardModal(index) {
    const wordData = wordsData[index];
    
    if (!wordData) return;
    
    // ✅ Mevcut modal varsa sadece içeriği güncelle
    const existingModal = document.querySelector('.word-modal');
    
    if (existingModal) {
        // Sadece içeriği güncelle, modal'ı kapatma
        updateModalContent(existingModal, index, wordData);
        return;
    }
    
    // İlk açılış - yeni modal oluştur
    createNewModal(index, wordData);
}

// ✅ Yeni fonksiyon: Sadece içeriği güncelle
function updateModalContent(modal, index, wordData) {
    const modalContent = modal.querySelector('.modal-content');
    const hasPrev = index > 0;
    const hasNext = index < wordsData.length - 1;
    
    // Fade animasyonu
    modalContent.style.transition = 'opacity 0.15s ease';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        // Ok butonlarını güncelle
        updateNavigationButtons(modal, hasPrev, hasNext);
        
        // İçeriği güncelle
        modalContent.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✕</button>
            
            <div class="modal-counter">${index + 1} / ${wordsData.length}</div>
            
            <h2 class="modal-word">${wordData.word}</h2>
            
            <div class="modal-section">
                <h3 class="modal-section-title">📖 Meaning</h3>
                <p class="modal-text">${wordData.meaning || 'No meaning available'}</p>
            </div>
            
            ${wordData.synonyms && wordData.synonyms.length > 0 ? `
            <div class="modal-section">
                <h3 class="modal-section-title">🔤 Synonyms</h3>
                <div class="modal-synonyms">
                    ${wordData.synonyms.map(syn => `<span class="synonym-tag">${syn}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${wordData.examples && wordData.examples.length > 0 ? `
            <div class="modal-section">
                <h3 class="modal-section-title">💬 Examples</h3>
                ${wordData.examples.map(ex => `<div class="example-item">${ex}</div>`).join('')}
            </div>
            ` : ''}
            
            <div class="modal-footer">
                <button class="modal-delete-btn" data-word="${wordData.word}">
                    🗑️ Delete Word
                </button>
            </div>
        `;
        
        // Delete butonuna event listener
        const deleteBtn = modalContent.querySelector('.modal-delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                deleteWordFromModal(deleteBtn.dataset.word);
            });
        }
        
        // Fade in
        modalContent.style.opacity = '1';
    }, 150);
}

// ✅ Ok butonlarını güncelle
function updateNavigationButtons(modal, hasPrev, hasNext) {
    // Önceki butonları kaldır
    const oldPrev = modal.querySelector('.modal-prev');
    const oldNext = modal.querySelector('.modal-next');
    if (oldPrev) oldPrev.remove();
    if (oldNext) oldNext.remove();
    
    const modalContent = modal.querySelector('.modal-content');
    const overlay = modal.querySelector('.modal-overlay');
    
    // Yeni butonları ekle
    if (hasPrev) {
        const btn = document.createElement('button');
        btn.className = 'modal-nav modal-prev';
        btn.onclick = () => navigateCard(-1);
        btn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        modal.insertBefore(btn, modalContent);
    }
    
    if (hasNext) {
        const btn = document.createElement('button');
        btn.className = 'modal-nav modal-next';
        btn.onclick = () => navigateCard(1);
        btn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        modal.insertBefore(btn, modalContent);
    }
}

// ✅ İlk modal oluştur
function createNewModal(index, wordData) {
    const hasPrev = index > 0;
    const hasNext = index < wordsData.length - 1;
    
    const modal = document.createElement('div');
    modal.className = 'word-modal';
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        
        ${hasPrev ? `
        <button class="modal-nav modal-prev" onclick="navigateCard(-1)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        ` : ''}
        
        ${hasNext ? `
        <button class="modal-nav modal-next" onclick="navigateCard(1)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        ` : ''}
        
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">✕</button>
            
            <div class="modal-counter">${index + 1} / ${wordsData.length}</div>
            
            <h2 class="modal-word">${wordData.word}</h2>
            
            <div class="modal-section">
                <h3 class="modal-section-title">📖 Meaning</h3>
                <p class="modal-text">${wordData.meaning || 'No meaning available'}</p>
            </div>
            
            ${wordData.synonyms && wordData.synonyms.length > 0 ? `
            <div class="modal-section">
                <h3 class="modal-section-title">🔤 Synonyms</h3>
                <div class="modal-synonyms">
                    ${wordData.synonyms.map(syn => `<span class="synonym-tag">${syn}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${wordData.examples && wordData.examples.length > 0 ? `
            <div class="modal-section">
                <h3 class="modal-section-title">💬 Examples</h3>
                ${wordData.examples.map(ex => `<div class="example-item">${ex}</div>`).join('')}
            </div>
            ` : ''}
            
            <div class="modal-footer">
                <button class="modal-delete-btn" data-word="${wordData.word}">
                    🗑️ Delete Word
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    const deleteBtn = modal.querySelector('.modal-delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            deleteWordFromModal(deleteBtn.dataset.word);
        });
    }
    
    document.addEventListener('keydown', handleKeyNavigation);
}

function navigateCard(direction) {
    const newIndex = currentCardIndex + direction;
    
    if (newIndex >= 0 && newIndex < wordsData.length) {
        const modalContent = document.querySelector('.modal-content');
        
        // ✅ Fade out
        modalContent.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
        modalContent.style.opacity = '0';
        modalContent.style.transform = direction > 0 ? 'translateX(20px)' : 'translateX(-20px)';
        
        setTimeout(() => {
            currentCardIndex = newIndex;
            showCardModal(currentCardIndex);
        }, 150);
    }
}

function handleKeyNavigation(e) {
    if (e.key === 'ArrowLeft') {
        navigateCard(-1);
    } else if (e.key === 'ArrowRight') {
        navigateCard(1);
    } else if (e.key === 'Escape') {
        closeModal();
    }
}

function closeModal() {
    const modal = document.querySelector('.word-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
        document.removeEventListener('keydown', handleKeyNavigation);
    }
}

// Delete from modal
async function deleteWordFromModal(word) {
    console.log("🔍 Deleting word:", word);  // ✅ EKLE
    
    if (!confirm(`Delete "${word}" from your library?`)) {
        return;
    }
    
    try {
        const requestBody = { text: word };
        console.log("📤 Request body:", requestBody);  // ✅ EKLE
        
        const response = await fetch(`${API_BASE}/api/delete-word`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log("📥 Response status:", response.status);  // ✅ EKLE
        
        if (!response.ok) {
            const errorData = await response.json();
            console.log("❌ Error data:", errorData);  // ✅ EKLE
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        closeModal();
        loadLibrary();
        
    } catch (error) {
        console.error('Error deleting word:', error);
        alert('Failed to delete word. Please try again.');
    }
}

// Global değişken - wordsData'yı sakla
let wordsData = [];

// ============== UTILITY FUNCTIONS ==============
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showError(message) {
    wordsGrid.innerHTML = `
        <div style="
            grid-column: 1 / -1;
            background: rgba(255, 59, 48, 0.1);
            border: 1px solid rgba(255, 59, 48, 0.3);
            color: #ff3b30;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
        ">
            ⚠️ ${message}
        </div>
    `;
}

// ============== GLOBAL SCOPE ==============
window.deleteWord = deleteWord;
window.deleteWordFromModal = deleteWordFromModal;
window.closeModal = closeModal;
window.navigateCard = navigateCard;

// ============== EXPORT ==============
console.log('Library JS loaded successfully');