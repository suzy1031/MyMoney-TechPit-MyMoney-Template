//第4章：収支のデータをデータベースに記録
const dbName = 'kakeiboDB';
const storeName = 'kakeiboStore';
const dbVersion = 1;

let database = indexedDB.open(dbName, dbVersion);

database.onupgradeneeded = function (event) {
  let db = event.target.result;
  db.createObjectStore(storeName, { keyPath: 'id' });
  console.log('データベースを作成しました');
};

database.onsuccess = function (event) {
  let db = event.target.result;
  db.close();
  console.log('データベースに接続できました');
};

database.onerror = function (event) {
  console.log('データベースに接続できませんでした');
};

function regist() {
  if (inputCheck() === false) {
    return;
  }

  let radio = document.getElementsByName('balance');
  let balance;
  for (let i = 0; i < radio.length; i++) {
    if (radio[i].checked === true) {
      balance = radio[i].value;
      break;
    }
  }

  let date = document.getElementById('date').value;
  let amount = document.getElementById('amount').value;
  let memo = document.getElementById('memo').value;
  let category = document.getElementById('category').value;
  if (balance === '収入') {
    category = '収入';
  }

  insertData(balance, date, category, amount, memo);

  createList();
}

function insertData(balance, date, category, amount, memo) {
  let uniqueID = new Date().getTime().toString();
  console.log(uniqueID);

  let data = {
    id: uniqueID,
    balance: balance,
    date: String(date),
    category: category,
    amount: amount,
    memo: memo,
  };

  let database = indexedDB.open(dbName, dbVersion);

  database.onerror = function (event) {
    console.log('データベースに接続できませんでした');
  };

  database.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(storeName, 'readwrite');
    transaction.complete = function (event) {
      console.log('トランザクション完了');
    };
    transaction.onerror = function (event) {
      console.log('トランザクションエラー');
    };

    let store = transaction.objectStore(storeName);
    let addData = store.add(data);
    addData.onsuccess = function () {
      console.log('データが登録できました');
      alert('登録しました');
    };
    addData.onerror = function () {
      console.log('データが登録できませんでした');
    };
    db.close();
  };
}

function createList() {
  let database = indexedDB.open(dbName);
  database.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(storeName, 'readonly');
    let store = transaction.objectStore(storeName);
    store.getAll().onsuccess = function (data) {
      console.log(data);
      let rows = data.target.result;

      let section = document.getElementById('list');
      let table = `
      <table>
        <tr>
          <th>日付</th>
          <th>収支</th>
          <th>カテゴリ</th>
          <th>金額</th>
          <th>メモ</th>
          <th>削除</th>
        </tr>
      `;
      rows.forEach((element) => {
        console.log(element);
        table += `
          <tr>
            <td>${element.date}</td>
            <td>${element.balance}</td>
            <td>${element.category}</td>
            <td>${element.amount}</td>
            <td>${element.memo}</td>
            <td>
              <button onclick="deleteData('${element.id}')">
                ×
              </button>
            </td>
          </tr>
        `;
      });
      table += `</table>`;
      section.innerHTML = table;

      createPieChart(rows);
    };
  };
}

function deleteData(id) {
  let database = indexedDB.open(dbName, dbVersion);
  database.onupgradeneeded = function (event) {
    let db = event.target.result;
  };

  database.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(storeName, 'readwrite');
    transaction.oncomplete = function (event) {
      console.log('トランザクション完了');
    };
    transaction.onerror = function (event) {
      console.log('トランザクションエラー');
    };
    let store = transaction.objectStore(storeName);

    let deleteData = store.delete(id);
    deleteData.onsuccess = function (event) {
      console.log('削除成功');
      createList();
    };
    deleteData.onerror = function (event) {
      console.log('削除失敗');
    };
    db.close();
  };

  database.onerror = function (event) {
    console.log('データベースに接続できませんでした');
  };
}
