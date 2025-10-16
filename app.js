// app.js

// ===========================
// UTILITY FUNCTIONS
// ===========================

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

// ===========================
// 1.1 BASIC INPUTS
// ===========================

// Select dropdown output
const selectCountry = $('[data-testid="select-country"]');
const selectCountryOutput = $('[data-testid="select-country-output"]');

if (selectCountry && selectCountryOutput) {
    selectCountry.addEventListener('change', (e) => {
        const selectedText = e.target.options[e.target.selectedIndex].text;
        selectCountryOutput.textContent = selectedText === '-- Select --' ? 'None' : selectedText;
    });
}

// ===========================
// 1.2 NAVIGATION - MENU
// ===========================

const menuBtn = $('[data-testid="menu-btn-advanced"]');
const submenu = $('[data-testid="submenu-advanced"]');

if (menuBtn && submenu) {
    menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        submenu.hidden = isExpanded;
    });

    // Keyboard support
    menuBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            menuBtn.setAttribute('aria-expanded', 'true');
            submenu.hidden = false;
            submenu.querySelector('a')?.focus();
        } else if (e.key === 'Escape') {
            menuBtn.setAttribute('aria-expanded', 'false');
            submenu.hidden = true;
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !submenu.contains(e.target)) {
            menuBtn.setAttribute('aria-expanded', 'false');
            submenu.hidden = true;
        }
    });
}

// ===========================
// 1.2 NAVIGATION - TABS
// ===========================

const tabs = $$('[role="tab"]');
const panels = $$('[role="tabpanel"]');

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        // Deselect all tabs
        tabs.forEach((t) => {
            t.setAttribute('aria-selected', 'false');
        });

        // Hide all panels
        panels.forEach((p) => {
            p.hidden = true;
        });

        // Select clicked tab
        tab.setAttribute('aria-selected', 'true');

        // Show corresponding panel
        const panelId = tab.getAttribute('aria-controls');
        const panel = $(`#${panelId}`);
        if (panel) {
            panel.hidden = false;
        }
    });

    // Keyboard navigation
    tab.addEventListener('keydown', (e) => {
        let index = Array.from(tabs).indexOf(tab);

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            index = (index + 1) % tabs.length;
            tabs[index].focus();
            tabs[index].click();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            index = (index - 1 + tabs.length) % tabs.length;
            tabs[index].focus();
            tabs[index].click();
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tab.click();
        }
    });
});

// ===========================
// 1.2 NAVIGATION - ACCORDION
// ===========================

const accordionTriggers = $$('.accordion-trigger');

accordionTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', !isExpanded);

        const contentId = trigger.getAttribute('aria-controls');
        const content = $(`#${contentId}`);
        if (content) {
            content.hidden = isExpanded;
        }
    });

    // Keyboard support
    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trigger.click();
        }
    });
});

// ===========================
// 1.2 NAVIGATION - MODAL
// ===========================

const btnOpenModal = $('[data-testid="btn-open-modal"]');
const modal = $('[data-testid="modal-root"]');
const btnCloseModal = $('[data-testid="btn-close-modal"]');
const btnConfirmModal = $('[data-testid="btn-confirm-modal"]');

let lastFocusedElement = null;

if (btnOpenModal && modal) {
    btnOpenModal.addEventListener('click', () => {
        lastFocusedElement = document.activeElement;
        modal.hidden = false;
        btnConfirmModal?.focus();
    });

    const closeModal = () => {
        modal.hidden = true;
        lastFocusedElement?.focus();
    };

    btnCloseModal?.addEventListener('click', closeModal);
    btnConfirmModal?.addEventListener('click', closeModal);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) {
            closeModal();
        }
    });

    // Focus trap
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// ===========================
// 1.3 DATA - FORM VALIDATION
// ===========================

const formLogin = $('[data-testid="form-login"]');
const spinner = $('[data-testid="spinner"]');
const alertSuccess = $('[data-testid="alert-success"]');
const alertError = $('[data-testid="alert-error"]');

if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = $('[data-testid="input-login-username"]').value;
        const password = $('[data-testid="input-login-password"]').value;

        // Hide previous alerts
        alertSuccess.hidden = true;
        alertError.hidden = true;

        // Show spinner (fixed 1200ms)
        spinner.hidden = false;

        setTimeout(() => {
            spinner.hidden = true;

            // Simple validation
            if (username && password.length >= 6) {
                alertSuccess.hidden = false;
            } else {
                alertError.hidden = false;
            }
        }, 1200);
    });
}

// ===========================
// 1.4 ADVANCED - DATE PICKER (Method A)
// ===========================

const dateInput = $('[data-testid="date-input"]');
const dateInputFeedback = $('[data-testid="date-input-feedback"]');

if (dateInput && dateInputFeedback) {
    dateInput.addEventListener('blur', () => {
        const value = dateInput.value;
        const regex = /^\d{4}-\d{2}-\d{2}$/;

        if (value && !regex.test(value)) {
            dateInputFeedback.textContent = 'Invalid format. Use YYYY-MM-DD';
            dateInputFeedback.style.color = '#000';
        } else if (value) {
            dateInputFeedback.textContent = 'Valid date format';
            dateInputFeedback.style.color = '#000';
        } else {
            dateInputFeedback.textContent = '';
        }
    });
}

// ===========================
// 1.4 ADVANCED - DATE PICKER (Method B)
// ===========================

const btnDateOpen = $('[data-testid="date-open"]');
const datePicker = $('[data-testid="date-picker"]');
const datePickerGrid = $('[data-testid="date-picker-grid"]');
const dateMonthYear = $('[data-testid="date-month-year"]');
const btnDatePrev = $('[data-testid="date-prev"]');
const btnDateNext = $('[data-testid="date-next"]');
const dateSelectedOutput = $('[data-testid="date-selected-output"]');

let currentDate = new Date(2025, 9, 16); // October 16, 2025 (deterministic)

function renderDatePicker() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    dateMonthYear.textContent = `${monthNames[month]} ${year}`;

    // Clear grid
    datePickerGrid.innerHTML = '';

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        datePickerGrid.appendChild(emptyCell);
    }

    // Add day buttons
    for (let day = 1; day <= daysInMonth; day++) {
        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        dayBtn.textContent = day;
        dayBtn.setAttribute('data-day', day);
        dayBtn.setAttribute('data-testid', `date-day-${day}`);

        dayBtn.addEventListener('click', () => {
            const selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dateSelectedOutput.textContent = selectedDate;
            datePicker.hidden = true;
        });

        datePickerGrid.appendChild(dayBtn);
    }
}

if (btnDateOpen && datePicker) {
    btnDateOpen.addEventListener('click', () => {
        datePicker.hidden = false;
        renderDatePicker();
    });

    btnDatePrev?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderDatePicker();
    });

    btnDateNext?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderDatePicker();
    });
}

// ===========================
// 1.4 ADVANCED - SLIDER
// ===========================

const sliderVolume = $('[data-testid="slider-volume"]');
const sliderVolumeOutput = $('[data-testid="slider-volume-output"]');

if (sliderVolume && sliderVolumeOutput) {
    sliderVolume.addEventListener('input', (e) => {
        sliderVolumeOutput.textContent = e.target.value;
    });
}

// ===========================
// 1.4 ADVANCED - DRAG & DROP
// ===========================

const dragSourceList = $('[data-testid="drag-source-list"]');
const dropTargetList = $('[data-testid="drop-target-list"]');
const btnMoveSelected = $('[data-testid="btn-move-selected"]');

let draggedItem = null;
let selectedItem = null;

if (dragSourceList && dropTargetList) {
    // Drag events
    dragSourceList.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'LI') {
            draggedItem = e.target;
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    dropTargetList.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        dropTargetList.classList.add('drag-over');
    });

    dropTargetList.addEventListener('dragleave', () => {
        dropTargetList.classList.remove('drag-over');
    });

    dropTargetList.addEventListener('drop', (e) => {
        e.preventDefault();
        dropTargetList.classList.remove('drag-over');

        if (draggedItem) {
            dropTargetList.appendChild(draggedItem);
            draggedItem = null;
        }
    });

    // Keyboard fallback - click to select
    dragSourceList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            // Remove previous selection
            $$('[data-testid^="drag-source-item-"]').forEach((item) => {
                item.style.backgroundColor = '';
                item.style.color = '';
            });

            selectedItem = e.target;
            selectedItem.style.backgroundColor = '#000';
            selectedItem.style.color = '#fff';
        }
    });

    btnMoveSelected?.addEventListener('click', () => {
        if (selectedItem) {
            selectedItem.style.backgroundColor = '';
            selectedItem.style.color = '';
            dropTargetList.appendChild(selectedItem);
            selectedItem = null;
        }
    });
}

// ===========================
// 1.5 FILE HANDLING
// ===========================

const fileInputVisible = $('[data-testid="file-input-visible"]');
const fileVisibleOutput = $('[data-testid="file-visible-output"]');

if (fileInputVisible && fileVisibleOutput) {
    fileInputVisible.addEventListener('change', (e) => {
        const fileName = e.target.files[0]?.name || 'No file selected';
        fileVisibleOutput.textContent = fileName;
    });
}

const btnUpload = $('[data-testid="btn-upload"]');
const fileInputHidden = $('[data-testid="file-input-hidden"]');
const fileHiddenOutput = $('[data-testid="file-hidden-output"]');

if (btnUpload && fileInputHidden) {
    btnUpload.addEventListener('click', () => {
        fileInputHidden.click();
    });

    fileInputHidden.addEventListener('change', (e) => {
        const fileName = e.target.files[0]?.name || 'No file selected';
        fileHiddenOutput.textContent = fileName;
    });
}

// ===========================
// 2.2 SHADOW DOM
// ===========================

class ShadowLoginCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    border: 1px solid #000;
                    padding: 1rem;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
                label {
                    display: block;
                    font-weight: bold;
                    margin-bottom: 0.25rem;
                }
                input {
                    font-family: inherit;
                    font-size: 1rem;
                    padding: 0.5rem;
                    border: 1px solid #000;
                    background-color: #fff;
                    color: #000;
                    width: 100%;
                    max-width: 300px;
                    margin-bottom: 0.75rem;
                }
                button {
                    font-family: inherit;
                    font-size: 1rem;
                    padding: 0.5rem 1rem;
                    border: 2px solid #000;
                    background-color: #fff;
                    color: #000;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #000;
                    color: #fff;
                }
            </style>
            <div>
                <h4>Shadow Login Card</h4>
                <label for="shadow-username">Username:</label>
                <input type="text" id="shadow-username" data-testid="shadow-username" placeholder="Enter username">
                
                <label for="shadow-password">Password:</label>
                <input type="password" id="shadow-password" data-testid="shadow-password" placeholder="Enter password">
                
                <button type="button" data-testid="shadow-login">Login</button>
            </div>
        `;

        const btn = this.shadowRoot.querySelector('[data-testid="shadow-login"]');
        btn.addEventListener('click', () => {
            const username = this.shadowRoot.querySelector('[data-testid="shadow-username"]').value;
            const resultOutput = document.querySelector('[data-testid="shadow-result-output"]');
            if (resultOutput) {
                resultOutput.textContent = username ? `Logged in as: ${username}` : 'Please enter username';
            }
        });
    }
}

customElements.define('shadow-login-card', ShadowLoginCard);

// ===========================
// 2.3 CANVAS
// ===========================

const canvas = $('[data-testid="canvas-chart"]');
const canvasClickOutput = $('[data-testid="canvas-click-output"]');
const btnCanvasSnapshot = $('[data-testid="btn-canvas-snapshot"]');
const canvasDiffOutput = $('[data-testid="canvas-diff-output"]');
const baselineImg = $('[data-testid="baseline-img"]');

if (canvas) {
    const ctx = canvas.getContext('2d');

    // Draw bar chart (deterministic)
    const bars = [
        { x: 50, y: 150, width: 60, height: 100, value: 100, label: 'A' },
        { x: 150, y: 100, width: 60, height: 150, value: 150, label: 'B' },
        { x: 250, y: 120, width: 60, height: 130, value: 130, label: 'C' }
    ];

    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bars
        bars.forEach((bar) => {
            ctx.fillStyle = '#000';
            ctx.fillRect(bar.x, canvas.height - bar.height - 20, bar.width, bar.height);

            // Draw label
            ctx.fillStyle = '#000';
            ctx.font = '14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(bar.label, bar.x + bar.width / 2, canvas.height - 5);
        });
    }

    drawChart();

    // Click detection
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let clicked = null;
        bars.forEach((bar) => {
            if (x >= bar.x && x <= bar.x + bar.width &&
                y >= canvas.height - bar.height - 20 && y <= canvas.height - 20) {
                clicked = bar;
            }
        });

        if (clicked) {
            canvasClickOutput.textContent = `Clicked bar ${clicked.label}: value ${clicked.value}`;
        } else {
            canvasClickOutput.textContent = 'Click a bar to see its value';
        }
    });

    // Visual regression check
    if (btnCanvasSnapshot && baselineImg && canvasDiffOutput) {
        btnCanvasSnapshot.addEventListener('click', () => {
            // Create a temporary canvas for baseline
            const baselineCanvas = document.createElement('canvas');
            baselineCanvas.width = canvas.width;
            baselineCanvas.height = canvas.height;
            const baselineCtx = baselineCanvas.getContext('2d');

            // Wait for baseline image to load
            if (baselineImg.complete) {
                compareImages();
            } else {
                baselineImg.onload = compareImages;
            }

            function compareImages() {
                baselineCtx.drawImage(baselineImg, 0, 0);

                const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const baselineData = baselineCtx.getImageData(0, 0, canvas.width, canvas.height);

                let diffPixels = 0;
                const totalPixels = currentData.data.length / 4;

                for (let i = 0; i < currentData.data.length; i += 4) {
                    const rDiff = Math.abs(currentData.data[i] - baselineData.data[i]);
                    const gDiff = Math.abs(currentData.data[i + 1] - baselineData.data[i + 1]);
                    const bDiff = Math.abs(currentData.data[i + 2] - baselineData.data[i + 2]);

                    if (rDiff > 10 || gDiff > 10 || bDiff > 10) {
                        diffPixels++;
                    }
                }

                const diffPercentage = ((diffPixels / totalPixels) * 100).toFixed(2);
                const tolerance = 5; // 5% tolerance

                if (diffPercentage <= tolerance) {
                    canvasDiffOutput.textContent = `✓ Visual check passed. Difference: ${diffPercentage}% (tolerance: ${tolerance}%)`;
                } else {
                    canvasDiffOutput.textContent = `✗ Visual check failed. Difference: ${diffPercentage}% (tolerance: ${tolerance}%)`;
                }
            }
        });
    }
}

// ===========================
// 3.2 SYNCHRONIZATION - ASYNC ACTION
// ===========================

const btnTriggerAsync = $('[data-testid="btn-trigger-async"]');
const asyncSpinner = $('[data-testid="async-spinner"]');
const asyncResult = $('[data-testid="async-result"]');

if (btnTriggerAsync && asyncSpinner && asyncResult) {
    btnTriggerAsync.addEventListener('click', () => {
        asyncResult.hidden = true;
        asyncSpinner.hidden = false;

        setTimeout(() => {
            asyncSpinner.hidden = true;
            asyncResult.hidden = false;
        }, 1200);
    });
}

// ===========================
// 3.2 SYNCHRONIZATION - SPA CONTENT
// ===========================

const btnLoadContent = $('[data-testid="btn-load-content"]');
const spaContent = $('[data-testid="spa-content"]');

if (btnLoadContent && spaContent) {
    btnLoadContent.addEventListener('click', () => {
        // Simulate async load (800ms fixed)
        setTimeout(() => {
            spaContent.hidden = false;
        }, 800);
    });
}

// ===========================
// 3.3 FLAKINESS - RETRY DEMO
// ===========================

const btnFlakyAction = $('[data-testid="btn-flaky-action"]');
const flakySpinner = $('[data-testid="flaky-spinner"]');
const flakyError = $('[data-testid="flaky-error"]');
const flakySuccess = $('[data-testid="flaky-success"]');
const flakyAttemptCount = $('[data-testid="flaky-attempt-count"]');

let attemptCount = 0;

if (btnFlakyAction) {
    btnFlakyAction.addEventListener('click', () => {
        attemptCount++;
        flakyAttemptCount.textContent = `Attempts: ${attemptCount}`;

        flakyError.hidden = true;
        flakySuccess.hidden = true;
        flakySpinner.hidden = false;

        setTimeout(() => {
            flakySpinner.hidden = true;

            // First attempt fails, subsequent succeed
            if (attemptCount === 1) {
                flakyError.hidden = false;
            } else {
                flakySuccess.hidden = false;
            }
        }, 600);
    });
}

// ===========================
// INITIALIZATION COMPLETE
// ===========================

console.log('The Modern Web Automation Tester\'s Handbook - Interactive Demos loaded successfully');
