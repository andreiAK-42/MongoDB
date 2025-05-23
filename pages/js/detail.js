window.onload = function() {
    getReviews()
};


function getReviews() {
    var id = document.getElementsByClassName("_id");
    
    fetch('getFullArticle?id=' + id[0].innerText)
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
            const targetClass = document.querySelector('.review_container');
            
            data.reviews.forEach(element => {
                const htmlContent = `
            <div class="review">
                     <div class="reviwer_name">
                        <p>{name}</p>
                     </div>
                <div class="reviwer_score">
                    <p>Оценка {score}</p>
                </div>
                <div class="reviwer_text">
                    <p>{content}</p>
                </div>
            </div>`.replace("{name}", element.name).replace("{score}", element.score).replace("{content}", element.text);
            
            targetClass.innerHTML += htmlContent;
        });
    })
    .catch(error => {
         console.error('Ошибка:', error);
        alert('Не удалось загрузить данные с сервера.');
    });
}
