/**
 * Timed Drop Timer JavaScript
 * Handles countdown functionality for timed product drops
 */

class TimedDropTimer {
  constructor() {
    this.timers = [];
    this.init();
  }

  init() {
    // Find all drop timers on the page
    const dropTimers = document.querySelectorAll('.timed-drop-timer');
    
    dropTimers.forEach(timer => {
      const dropTime = timer.dataset.dropTime;
      const productId = timer.dataset.productId;
      
      if (dropTime) {
        this.timers.push({
          element: timer,
          dropTime: new Date(dropTime).getTime(),
          productId: productId
        });
      }
    });

    // Start the countdown
    this.startCountdown();
  }

  startCountdown() {
    if (this.timers.length === 0) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      
      this.timers.forEach(timer => {
        const timeLeft = timer.dropTime - now;
        
        if (timeLeft > 0) {
          // Update countdown display
          this.updateCountdownDisplay(timer.element, timeLeft);
        } else {
          // Drop is now active
          this.handleDropActive(timer.element);
        }
      });
    };

    // Update immediately
    updateTimer();
    
    // Update every second
    setInterval(updateTimer, 1000);
  }

  updateCountdownDisplay(element, timeLeft) {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Get product ID from element
    const productId = element.dataset.productId;
    
    // Update display elements
    const daysEl = element.querySelector(`#days-${productId}`);
    const hoursEl = element.querySelector(`#hours-${productId}`);
    const minutesEl = element.querySelector(`#minutes-${productId}`);
    const secondsEl = element.querySelector(`#seconds-${productId}`);

    if (daysEl) {
      this.updateTimerUnit(daysEl, days);
    }
    if (hoursEl) {
      this.updateTimerUnit(hoursEl, hours);
    }
    if (minutesEl) {
      this.updateTimerUnit(minutesEl, minutes);
    }
    if (secondsEl) {
      this.updateTimerUnit(secondsEl, seconds);
    }
  }

  updateTimerUnit(element, value) {
    const newValue = value.toString().padStart(2, '0');
    
    if (element.textContent !== newValue) {
      element.classList.add('updating');
      element.textContent = newValue;
      
      setTimeout(() => {
        element.classList.remove('updating');
      }, 300);
    }
  }

  handleDropActive(element) {
    // Remove countdown and show drop is active
    const container = element.querySelector('.drop-timer-container');
    if (container) {
      container.innerHTML = `
        <div class="drop-timer-header">
          <h3 class="drop-timer-title">🎉 Drop is Now Live!</h3>
          <p class="drop-timer-subtitle">This product is now available for purchase</p>
        </div>
      `;
    }
    
    // Add active class
    element.classList.add('drop-active');
    
    // Refresh the page to update product availability
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  // Utility method to check if drop is active
  static isDropActive(dropTime) {
    const now = new Date().getTime();
    const dropTimestamp = new Date(dropTime).getTime();
    return now >= dropTimestamp;
  }

  // Utility method to get time remaining
  static getTimeRemaining(dropTime) {
    const now = new Date().getTime();
    const dropTimestamp = new Date(dropTime).getTime();
    return Math.max(0, dropTimestamp - now);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  new TimedDropTimer();
});

// Also initialize if script loads after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    new TimedDropTimer();
  });
} else {
  new TimedDropTimer();
}

// Export for use in other scripts
window.TimedDropTimer = TimedDropTimer;
