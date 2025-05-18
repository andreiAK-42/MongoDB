const button = document.getElementById('btn_add');
button.addEventListener('click', function (e) {
    console.log('button was clicked');

    fetch('getFile?fileName=articles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки файла: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            renderTable(data);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить данные с сервера.');
        });
});

function renderTable(data) {
    const tableBody = document.querySelector('#raspisaniye tbody');
    tableBody.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach(item => {
            const tr = document.createElement('tr');
            const tdTime = document.createElement('td');
            const tdSubject = document.createElement('td');
            const tdPlace = document.createElement('td');
            const tdPlace2 = document.createElement('td');

            tdTime.textContent = item.name || 'Нет данных';
            tdSubject.textContent = item.author || 'Нет данных';
            tdPlace.textContent = item.date_public || 'Нет данных';
            tdPlace2.textContent = item.content || 'Нет данных';

            tr.appendChild(tdTime);
            tr.appendChild(tdSubject);
            tr.appendChild(tdPlace);
            tr.appendChild(tdPlace2);
            tableBody.appendChild(tr);
        });
    } else {
        alert('JSON-файл должен содержать массив объектов.');
    }
}