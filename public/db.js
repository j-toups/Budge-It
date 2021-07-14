const request = indexedDB.open('budget', 1);

request.onupgradeneeded = () => {
  var db = request.result;
  db.createObjectStore('pending', { autoIncrement: true });
};

request.onsuccess = event => {
  console.log(`${event.type}`);

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = event => console.log(event.target.errorCode);

saveRecord = record => {
  const db = request.result;
  const transaction = db.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore('pending');

  store.add(record);
}

checkDatabase = () => {
  const db = request.result
  const transaction = db.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore('pending');
  const getAll = store.getAll();

  getAll.onsuccess = () =>  {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          const transaction = db.transaction(['pending'], 'readwrite');
          const store = transaction.objectStore('pending');
          store.clear();
        });
    }
  };
}

window.addEventListener('online', checkDatabase);