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
});

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
        // Synonyms varsa göster, yoksa boş
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
                <button class="card-delete-btn" onclick="deleteWord('${wordData.word}')">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `}).join('');
    
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
            body: JSON.stringify({ word: word })
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
function expandCard(cardElement) {
    const word = cardElement.dataset.word;
    const wordData = wordsData.find(w => w.word === word);
    
    if (!wordData) return;
    
    // Modal oluştur
    const modal = document.createElement('div');
    modal.className = 'word-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">✕</button>
            
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
                <button class="modal-delete-btn" onclick="deleteWord('${word}'); closeModal();">
                    🗑️ Delete Word
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animation için timeout
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal() {
    const modal = document.querySelector('.word-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
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

// ============== EXPORT ==============
console.log('Library JS loaded successfully');