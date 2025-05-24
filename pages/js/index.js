window.onload = () => {
    document.getElementById("container_left").style.display = 'none';
};

document.getElementById('btn_add').addEventListener('click', function (e) {

    fetch('getFile?fileName=articles.json')
        .then(response => {
            console.log(response.status)
            console.log(response)
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
    const form = document.querySelector('.search-wrapper form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
    });

    searchInput.addEventListener('input', function () {
        const searchText = searchInput.value.toLowerCase();
        const rows = Array.from(tableBody.querySelectorAll('tr'));

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const firstCell = row.querySelector('td:first-child');
            if (firstCell && (firstCell.textContent == "Название" || firstCell.textContent == "Авторы")) {
                continue;
            }

            const nameCell = row.querySelector('td:nth-child(1)'); 
            const authorCell = row.querySelector('td:nth-child(2)'); 

            let textContent = '';
            if (nameCell) {
                textContent += nameCell.textContent.toLowerCase();
            }
            if (authorCell) {
                textContent += authorCell.textContent.toLowerCase();
            }

            if (textContent.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
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

function handleDetailArticleClick(_id) {
    window.location.href = "http://127.0.0.1:3000/detail?id=" + _id;
}


function handleDeleteArticleClick(_id) {
    fetch('deleteArticle?id=' + _id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки файла: ' + response.statusText);
            } else {
                const element = document.getElementById(_id); 
                element.remove();
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить данные с сервера.');
        });
}

function dateSearch() {
    var startDate = new Date(document.getElementById("dateStart").value).getTime();
    var endDate = new Date(document.getElementById("dateEnd").value).getTime(); 
    const searchInput = document.querySelector('.search-box');
    const table = document.querySelector('.articles');
    const tableBody = table.querySelector('tbody');
    const form = document.querySelector('.search-wrapper form');


        const rows = Array.from(tableBody.querySelectorAll('tr'));

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const firstCell = row.querySelector('td:first-child');
            if (firstCell && firstCell.textContent == "Дата размещения" ) {
                continue;
            }

            const dateCell = row.querySelector('td:nth-child(3)');

            if (dateCell) {
                let dateString = dateCell.textContent;

                try {
                    const publicDate = new Date(dateString).getTime();

                    if (publicDate >= startDate && publicDate <= endDate) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                } catch (error) {
                    console.warn("Некорректный формат даты:", dateString, error);
                    row.style.display = 'none'; 
                }
            } else {
                console.warn("Ячейка с датой не найдена в строке");
                row.style.display = 'none';
            }
        }
}

function getMiddleScore(item) {

    if (item) {
        var middleScore = 0;
        var counterI = 0;
        item.reviews.forEach(review => {
            middleScore += review.score;
            counterI += 1;
        });

        return Math.ceil(middleScore / counterI);
    }
    else {
        return 0;
    }
}

function renderTopArticles(data) {
    const targetClass = document.querySelector('.top_articles_table');
    if (Array.isArray(data)) {

        data.sort(function (a, b) {

            avgScoreA = getMiddleScore(a);
            avgScoreB = getMiddleScore(b);
            
            if (avgScoreA !== avgScoreB) {
                return avgScoreB - avgScoreA; 
            }
            return a.reviews.length - b.reviews.length;
        });

        data.forEach(item => {
            if (item) {
                const htmlContent = `
                <div id="${item._id}" class="top_article">
                    <p>${item.name}</p>
                    <p>${item.reviews.length}</p>
                    <p>${getMiddleScore(item)}</p>
                </div>`;

                targetClass.innerHTML += htmlContent;
            }

        });
    }
}


function renderTable(data) {
    const tableBody = document.querySelector('#articles tbody');
    tableBody.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.id = item._id;
            const tdName = document.createElement('td');
            const tdAuthor = document.createElement('td');
            const tdDatePublic = document.createElement('td');
            const tdContent = document.createElement('td');

            tdName.textContent = item.name || 'Нет данных';
            tdAuthor.textContent = item.author || 'Нет данных';
            tdDatePublic.textContent = item.date_public || 'Нет данных';
            tdContent.textContent = item.content || 'Нет данных';

            const btn_detail = document.createElement('button'); 
            btn_detail.innerHTML = '🛈';
            btn_detail.className = "btn_detail";

            btn_detail.addEventListener('click', function (event) {
                event.preventDefault(); 
                handleDetailArticleClick(item._id);
            });

            const btn_delete = document.createElement('button'); 
            btn_delete.innerHTML = 'X';
            btn_delete.className = "btn_delete";

            btn_delete.addEventListener('click', function (event) {
                event.preventDefault(); 
                handleDeleteArticleClick(item._id);
            });

            tr.appendChild(tdName);
            tr.appendChild(tdAuthor);
            tr.appendChild(tdDatePublic);
            tr.appendChild(tdContent);
            tr.appendChild(btn_detail);
            tr.appendChild(btn_delete);

            tableBody.appendChild(tr);
        });
        document.getElementById("container_left").style.display = "";
        renderTopArticles(data);
    } else {
        alert('JSON-файл должен содержать массив объектов.');
    }
}

function myFunction() {
    document.getElementById("authorDropdown").classList.toggle("show");
}

function addNewArticle() {
    window.location.href = "http://127.0.0.1:3000/addNew";
}

function articleListReset() {
    const table = document.querySelector('.articles');
    const tableBody = table.querySelector('tbody');
    
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach(row => {
        row.style.display = '';    
    });
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