function addNewArticle() {
    var articleText = document.getElementById('articleHeader').value;
    var articleAuthor = document.getElementById('articleHeader').value;
    var articleContent = document.getElementById('articleContent').value;

    fetch(`addNewArticle?head=${articleText}&content=${articleContent}&author=${articleAuthor}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка загрузки файла: ' + response.statusText);
        } else {
            window.location.href = "http://127.0.0.1:3000/";
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить данные с сервера.');
    });
}

function back() {
    window.location.href = "http://127.0.0.1:3000/";
}