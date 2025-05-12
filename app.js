if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

if (document.getElementById('dataForm')) {
  const dbName = 'formDB';
  const dbRequest = indexedDB.open(dbName, 1);

  dbRequest.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore('form', { keyPath: 'email' });
  };

  dbRequest.onsuccess = (e) => {
    const db = e.target.result;
    document.getElementById('dataForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;

      const tx = db.transaction('form', 'readwrite');
      tx.objectStore('form').put({ name, email });
      tx.oncomplete = () => alert('Zapisano dane!');
    });

    const tx = db.transaction('form', 'readonly');
    const store = tx.objectStore('form');
    const request = store.getAll();
    request.onsuccess = () => {
      const div = document.getElementById('savedData');
      if (div) {
        div.innerHTML = request.result.map(r => `<p>${r.name} - ${r.email}</p>`).join('');
      }
    };
  };
}

if (document.getElementById('adviceData')) {
  fetch('https://api.adviceslip.com/advice')
    .then(res => res.json())
    .then(data => {
      document.getElementById('adviceData').textContent = `${data.slip.advice}`;
    })
    .catch(() => {
      document.getElementById('adviceData').textContent = 'Brak połączenia z api.';
    });
}
