document.getElementById('btn_add').addEventListener('click', function (e) {

    fetch('getFile?fileName=articles.json')
        .then(response => {
            if (response.status == 304) {
                alert('Данные уже были добавлены раннее.');
                return null;
            } else if (!response.ok) {
                throw new Error('Ошибка загрузки файла: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                renderTable(data);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить данные с сервера.');
        });
});

document.getElementById('btn_listArticles').addEventListener('click', function (e) {

    fetch('getActualArticlesState')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки файла: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            renderTable(data);
            renderAuthors(data);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить данные с сервера.');
        });
});


document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.search-box');
    const table = document.querySelector('.articles');
    const tableBody = table.querySelector('tbody');

    searchInput.addEventListener('input', function () {
        const searchText = searchInput.value.toLowerCase();
        const rows = Array.from(tableBody.querySelectorAll('tr'));

        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const textContent = cells.map(cell => cell.textContent.toLowerCase()).join(' ');

            if (textContent.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});

function renderAuthors(data) {
    const authorDropdown = document.querySelector('#authorDropdown');
    authorDropdown.innerHTML = '';

    if (Array.isArray(data)) {

        const unique = data.filter((obj, idx, arr) =>
            idx === arr.findIndex((t) => t.author === obj.author));

        unique.forEach(item => {
            const a = document.createElement('a');
            a.href = "#";
            a.textContent = item.author; 
            
            a.addEventListener('click', function (event) {
                event.preventDefault(); 
                const authorName = this.textContent;
                handleAuthorClick(authorName);
            });

            authorDropdown.appendChild(a);
        });
    } else {
        console.error('Данные об авторах должны быть массивом.');
    }
}


function handleAuthorClick(authorName) {
    const searchInput = document.querySelector('.search-box');
    const table = document.querySelector('.articles');
    const tableBody = table.querySelector('tbody');

    const searchText = authorName.toLowerCase();
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        const textContent = cells.map(cell => cell.textContent.toLowerCase()).join(' ');

        if (textContent.includes(searchText)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
};


function renderTable(data) {
    const tableBody = document.querySelector('#articles tbody');
    tableBody.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach(item => {
            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            const tdAuthor = document.createElement('td');
            const tdDatePublic = document.createElement('td');
            const tdContent = document.createElement('td');

            tdName.textContent = item.name || 'Нет данных';
            tdAuthor.textContent = item.author || 'Нет данных';
            tdDatePublic.textContent = item.date_public || 'Нет данных';
            tdContent.textContent = item.content || 'Нет данных';

            tr.appendChild(tdName);
            tr.appendChild(tdAuthor);
            tr.appendChild(tdDatePublic);
            tr.appendChild(tdContent);
            tableBody.appendChild(tr);
        });
    } else {
        alert('JSON-файл должен содержать массив объектов.');
    }
}

function myFunction() {
    document.getElementById("authorDropdown").classList.toggle("show");
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
  }