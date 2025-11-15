/**
 * LEXORA - Streak Page JavaScript
 * Load and display user's streak statistics from backend
 */

// API Base URL
const API_BASE = 'https://lexora-54ms.onrender.com';

// DOM Elements
const navStreakCount = document.getElementById('navStreakCount');
const streakNumber = document.getElementById('streakNumber');
const totalWordsElement = document.getElementById('totalWords');
const longestStreakElement = document.getElementById('longestStreak');
const todayWordsElement = document.getElementById('todayWords');

// ============== INITIALIZATION ==============
document.addEventListener('DOMContentLoaded', () => {
    loadStreakData();
});

// ============== LOAD STREAK DATA FROM BACKEND ==============
async function loadStreakData() {
    try {
        const response = await fetch(`${API_BASE}/api/streak`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Streak data loaded:', data);
        
        // Update all streak displays
        updateStreakDisplay(data);
        
    } catch (error) {
        console.error('Error loading streak data:', error);
        showError('Failed to load streak data. Please refresh the page.');
    }
}

// ============== UPDATE DISPLAY ==============
function updateStreakDisplay(data) {
    // Navbar streak badge
    if (navStreakCount) {
        navStreakCount.textContent = data.current || 0;
    }
    
    // Main streak number (big display)
    if (streakNumber) {
        streakNumber.textContent = data.current || 0;
        
        // Add animation when streak changes
        streakNumber.style.animation = 'none';
        setTimeout(() => {
            streakNumber.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    }
    
    // Total words stat
    if (totalWordsElement) {
        totalWordsElement.textContent = data.total_words || 0;
    }
    
    // Longest streak stat
    if (longestStreakElement) {
        longestStreakElement.textContent = data.longest || 0;
    }
    
    // Today's words stat
    if (todayWordsElement) {
        todayWordsElement.textContent = data.today_words || 0;
    }
}

// ============== ERROR HANDLING ==============
function showError(message) {
    const pageContainer = document.querySelector('.page-container');
    if (pageContainer) {
        pageContainer.innerHTML = `
            <div style="
                text-align: center;
                padding: 60px 20px;
                background: rgba(255, 59, 48, 0.1);
                border: 1px solid rgba(255, 59, 48, 0.3);
                color: #ff3b30;
                border-radius: 16px;
                margin: 40px auto;
                max-width: 600px;
            ">
                <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                <h3 style="margin-bottom: 8px;">${message}</h3>
                <button 
                    onclick="location.reload()" 
                    style="
                        margin-top: 20px;
                        padding: 12px 24px;
                        background: #ff3b30;
                        border: none;
                        border-radius: 8px;
                        color: white;
                        font-weight: 600;
                        cursor: pointer;
                    "
                >
                    Retry
                </button>
            </div>
        `;
    }
}

// ============== EXPORT ==============
console.log('Streak JS loaded successfully');