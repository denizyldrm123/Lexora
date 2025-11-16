/**
 * LEXORA - Dictionary Page JavaScript
 * API Integration for meaning, synonyms, and examples
 */

// Base API URL
const API_BASE = window.location.origin;
// DOM Elements
const wordInput = document.getElementById('wordInput');
const meaningBtn = document.getElementById('meaningBtn');
const synonymBtn = document.getElementById('synonymBtn');
const exampleBtn = document.getElementById('exampleBtn');
const clearBtn = document.getElementById('clearBtn');
const resultBox = document.getElementById('resultBox');

// Current word being searched
let currentWord = '';

// ============== EVENT LISTENERS ==============
if (meaningBtn) meaningBtn.addEventListener('click', () => getMeaning());
if (synonymBtn) synonymBtn.addEventListener('click', () => getSynonyms());
if (exampleBtn) exampleBtn.addEventListener('click', () => getExamples());
if (clearBtn) clearBtn.addEventListener('click', () => clearResults());

// Enter key support
if (wordInput) {
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            getMeaning();
        }
    });
}

// ============== API CALL 1: GET MEANING ==============
async function getMeaning() {
    const word = wordInput.value.trim();
    
    if (!word) {
        showError('Please enter a word!');
        return;
    }
    
    currentWord = word;
    setLoading(meaningBtn, true);
    
    try {
        const response = await fetch(`${API_BASE}/api/meaning`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: word })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayMeaning(word, data.meaning);
        
    } catch (error) {
        console.error('Error fetching meaning:', error);
        showError('Failed to fetch meaning. Please try again.');
    } finally {
        setLoading(meaningBtn, false);
    }
}

function displayMeaning(word, meaning) {
    resultBox.innerHTML = `
        <div class="result-header">${word}</div>
        <div class="result-section">
            <div class="result-label">Definition</div>
            <div class="result-content">${meaning}</div>
        </div>
    `;
}

// ============== API CALL 2: GET SYNONYMS ==============
async function getSynonyms() {
    const word = wordInput.value.trim();
    
    if (!word) {
        showError('Please enter a word!');
        return;
    }
    
    currentWord = word;
    setLoading(synonymBtn, true);
    
    try {
        const response = await fetch(`${API_BASE}/api/synonyms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: word })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // 🔥 Backend returns ARRAY, not string
        // Ensure it's array
        const synonymsArray = Array.isArray(data.synonyms)
            ? data.synonyms
            : String(data.synonyms).split(',').map(s => s.trim());

        displaySynonyms(word, synonymsArray);
        
    } catch (error) {
        console.error('Error fetching synonyms:', error);
        showError('Failed to fetch synonyms. Please try again.');
    } finally {
        setLoading(synonymBtn, false);
    }
}



function displaySynonyms(word, synonyms) {

    // Empty control
    if (!synonyms || synonyms.length === 0) {
        resultBox.innerHTML = `
            <div class="result-header">${word}</div>
            <div class="result-section">
                <div class="result-label">Synonyms & Related Words</div>
                <div class="result-content">No synonyms found.</div>
            </div>
        `;
        return;
    }

    // Create tags
    const synonymTags = synonyms.map(syn => 
        `<span class="synonym-tag">${syn}</span>`
    ).join('');

    resultBox.innerHTML = `
        <div class="result-header">${word}</div>
        <div class="result-section">
            <div class="result-label">Synonyms & Related Words</div>
            <div class="result-content">
                ${synonymTags}
            </div>
        </div>
    `;
}


// ============== API CALL 3: GET EXAMPLES ==============
async function getExamples() {
    const word = wordInput.value.trim();
    
    if (!word) {
        showError('Please enter a word!');
        return;
    }
    
    currentWord = word;
    setLoading(exampleBtn, true);
    
    try {
        const response = await fetch(`${API_BASE}/api/examples`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: word })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Backend returns string like "Example 1.\nExample 2."
        // Convert to array
        const examplesArray = data.examples
            .split('\n')
            .map(ex => ex.trim())
            .filter(ex => ex.length > 0);
        
        displayExamples(word, examplesArray);
        
    } catch (error) {
        console.error('Error fetching examples:', error);
        showError('Failed to fetch examples. Please try again.');
    } finally {
        setLoading(exampleBtn, false);
    }
}

function displayExamples(word, examples) {
    const exampleItems = examples.map(ex => 
        `<div class="example-item">${ex}</div>`
    ).join('');
    
    resultBox.innerHTML = `
        <div class="result-header">${word}</div>
        <div class="result-section">
            <div class="result-label">Example Sentences</div>
            <div class="result-content">
                ${exampleItems}
            </div>
        </div>
    `;
}

// ============== UTILITY FUNCTIONS ==============
function clearResults() {
    resultBox.innerHTML = '<p style="color: #666; font-style: italic;">Results will appear here...</p>';
    wordInput.value = '';
    currentWord = '';
}

function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function showError(message) {
    resultBox.innerHTML = `
        <div style="
            background: rgba(255, 59, 48, 0.1);
            border: 1px solid rgba(255, 59, 48, 0.3);
            color: #ff3b30;
            padding: 16px;
            border-radius: 8px;
        ">
            ⚠️ ${message}
        </div>
    `;
}

// ============== INITIALIZATION ==============
console.log('Dictionary JS loaded successfully');