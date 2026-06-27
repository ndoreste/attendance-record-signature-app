const form = document.querySelector('#recordForm');
const formMessage = document.querySelector('#formMessage');
const recordsTable = document.querySelector('#recordsTable');
const refreshButton = document.querySelector('#refreshRecords');
const canvases = ['employeeSignature', 'supervisorSignature'];
const signatureState = new Map();

function setupCanvas(id) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#0f172a';
  let drawing = false;
  signatureState.set(id, false);

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches?.[0];
    const source = touch || event;
    return {
      x: (source.clientX - rect.left) * (canvas.width / rect.width),
      y: (source.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function start(event) { drawing = true; signatureState.set(id, true); const p = point(event); ctx.beginPath(); ctx.moveTo(p.x, p.y); event.preventDefault(); }
  function move(event) { if (!drawing) return; const p = point(event); ctx.lineTo(p.x, p.y); ctx.stroke(); event.preventDefault(); }
  function end() { drawing = false; ctx.closePath(); }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', end);
  canvas.addEventListener('mouseleave', end);
  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);
}

canvases.forEach(setupCanvas);

document.querySelectorAll('[data-clear]').forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.clear;
    const canvas = document.getElementById(id);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    signatureState.set(id, false);
  });
});

function canvasData(id) {
  return document.getElementById(id).toDataURL('image/png');
}

async function loadRecords() {
  const response = await fetch('/api/records');
  const result = await response.json();
  recordsTable.innerHTML = '';
  if (!result.data?.length) {
    recordsTable.innerHTML = '<tr><td colspan="7">Todavía no hay registros.</td></tr>';
    return;
  }
  result.data.forEach((record) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${String(record.date).slice(0, 10)}</td>
      <td>${record.fullName}</td>
      <td>${record.scheduleStart} - ${record.scheduleEnd}</td>
      <td>${record.entryTime}</td>
      <td>${record.exitTime}</td>
      <td>${record.reason}<br><small>${record.observations || ''}</small></td>
      <td><span class="badge">2 firmas</span></td>
    `;
    recordsTable.appendChild(row);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formMessage.textContent = '';
  formMessage.className = '';
  if (!signatureState.get('employeeSignature') || !signatureState.get('supervisorSignature')) {
    formMessage.textContent = 'Debes dibujar ambas firmas antes de guardar.';
    formMessage.className = 'error';
    return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  data.employeeSignature = canvasData('employeeSignature');
  data.supervisorSignature = canvasData('supervisorSignature');

  const response = await fetch('/api/records', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const result = await response.json();
  if (!response.ok) {
    formMessage.textContent = result.message || 'No se pudo guardar el registro.';
    formMessage.className = 'error';
    return;
  }
  form.reset();
  document.querySelectorAll('[data-clear]').forEach((button) => button.click());
  formMessage.textContent = 'Registro guardado correctamente.';
  formMessage.className = 'ok';
  await loadRecords();
});

refreshButton.addEventListener('click', loadRecords);
loadRecords();
