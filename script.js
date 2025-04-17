const areas = [
    { name: 'Downtown', bins: 3 },
    { name: 'Suburb', bins: 2 },
    { name: 'Industrial Zone', bins: 3 },
    { name: 'Residential Area', bins: 2 }
  ];
  
  const container = document.getElementById('areas-container');
  let isConnected = false;
  let autoRefreshEnabled = true;
  
  document.getElementById('autoRefresh').addEventListener('change', function () {
    autoRefreshEnabled = this.checked;
  });
  
  function getStatus(level) {
    if (level < 30) return { text: 'Empty', class: 'status-empty', color: 'bg-success' };
    if (level < 70) return { text: 'Half Full', class: 'status-half', color: 'bg-warning' };
    return { text: 'Full', class: 'status-full', color: 'bg-danger' };
  }
  
  function generateBins() {
    let html = '';
  
    areas.forEach((area, aIndex) => {
      html += `
        <div class="col-12">
          <div class="area-title">📍 ${area.name}</div>
          <div class="row g-4" id="area-${aIndex}">
          </div>
        </div>
      `;
  
      setTimeout(() => {
        const areaRow = document.getElementById(`area-${aIndex}`);
        for (let i = 0; i < area.bins; i++) {
          const level = Math.floor(Math.random() * 101);
          const status = getStatus(level);
  
          areaRow.innerHTML += `
            <div class="col-md-4">
              <div class="card p-3">
                <h5 class="text-center mb-2">Bin ${i + 1}</h5>
                <div class="text-center bin-status ${status.class}" id="status-${aIndex}-${i}">
                  ${status.text} (${level}%)
                </div>
                <div class="progress">
                  <div class="progress-bar ${status.color}" id="bar-${aIndex}-${i}" role="progressbar"
                    style="width: ${level}%;" aria-valuenow="${level}" aria-valuemin="0" aria-valuemax="100">
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      }, 100);
    });
  
    container.innerHTML = html;
  }
  
  function updateLevels() {
    areas.forEach((area, aIndex) => {
      for (let i = 0; i < area.bins; i++) {
        const level = Math.floor(Math.random() * 101);
        const status = getStatus(level);
  
        const statusElem = document.getElementById(`status-${aIndex}-${i}`);
        const barElem = document.getElementById(`bar-${aIndex}-${i}`);
  
        if (statusElem && barElem) {
          statusElem.className = `bin-status ${status.class}`;
          statusElem.textContent = `${status.text} (${level}%)`;
          barElem.className = `progress-bar ${status.color}`;
          barElem.style.width = `${level}%`;
          barElem.setAttribute('aria-valuenow', level);
        }
      }
    });
  }
  
  function toggleConnection() {
    isConnected = !isConnected;
    const status = document.getElementById('connection-status');
    const optionsPanel = document.getElementById('extra-options');
  
    if (isConnected) {
      status.classList.remove('bg-secondary');
      status.classList.add('bg-success');
      status.innerHTML = '🟢 Connected';
      optionsPanel.classList.remove('d-none');
    } else {
      status.classList.remove('bg-success');
      status.classList.add('bg-secondary');
      status.innerHTML = '🔴 Disconnected';
      optionsPanel.classList.add('d-none');
    }
  }
  
  function manualSync() {
    if (isConnected) updateLevels();
  }
  
  function triggerSmartAlerts() {
    areas.forEach((area, aIndex) => {
      for (let i = 0; i < area.bins; i++) {
        const level = parseInt(document.getElementById(`bar-${aIndex}-${i}`).getAttribute('aria-valuenow'));
        if (level >= 90) {
          alert(`⚠️ Bin ${i + 1} in ${area.name} is almost FULL (${level}%)`);
        }
      }
    });
  }
  
  setInterval(() => {
    if (isConnected && autoRefreshEnabled) {
      updateLevels();
      if (document.getElementById('notifications').checked) {
        triggerSmartAlerts();
      }
    }
  }, 5000);
  
  generateBins();
  