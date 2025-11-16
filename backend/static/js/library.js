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
        
        // Update streak in navbar
        if (streakCountElement && data.streak !== undefined) {
            streakCountElement.textContent = data.streak;
        }
        
        // Update total words count
        if (totalWordsElement) {
            totalWordsElement.textContent = data.words ? data.words.length : 0;
        }
        
        // Display words
        displayWords(data.words || []);
        
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
                <h3>No words found</h3>
                <p style="margin-top: 8px; color: #888;">Dictionary is empty.</p>
            </div>
        `;
        return;
    }
    
    wordsGrid.innerHTML = words.map((wordData) => `
        <div class="word-card">
            <div class="card-word">${wordData.word}</div>

            <div class="card-definition">
                ${wordData.meaning 
                    ? wordData.meaning.substring(0, 120) + "..."
                    : "No meaning available"}
            </div>

            <div class="card-footer">
                <div class="card-date">
                    Synonyms: ${wordData.synonyms?.length || 0}
                </div>
            </div>
        </div>
    `).join('');
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