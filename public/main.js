console.log('Mini-Blog');

const aObj = document.getElementsByTagName('a');
const contentObj = document.getElementById('content');

const mysqlBtnObj = document.getElementById('mysqlBtn');
const mongodbBtnObj = document.getElementById('mongodbBtn');


const loadArtikel = async () => {

    const loadingSpinner = '<img class="spinner" src="/loading.gif">';
    contentObj.innerHTML = loadingSpinner;

    aObj[0].classList.add('aktive');
    aObj[1].classList.remove('aktive');

    const res = await fetch('http://localhost:3000/blogposts');
    const data = await res.json();
    // const dataMysql = data.mysql;
    // const dataMongodb = data.mongodb;

    let artikel = ``;

    if (mongodbBtnObj.checked) {

        for (post of data.mongodb) {
            let date = new Date(post.created);
            let day = date.getDate(post.created);
            let month = date.getMonth(post.created);
            let year = date.getFullYear(post.created);
            let hour = date.getHours(post.created);
            let minutes = date.getMinutes(post.created);
            let seconds = date.getSeconds(post.created);
            let datum = `${day}-${month}-${year}  ${hour}:${minutes}:${seconds}`

            artikel += `
        
            <div class="artikel">
                <span>${datum}</span>
                <h2>#${post._id} ${post.titel}</h2>
                <p>${post.content}</p>
            </div>
        
            `
        }
    } else {
        for (post of data.mysql) {
            let date = new Date(post.created);
            let day = date.getDate(post.created);
            let month = date.getMonth(post.created);
            let year = date.getFullYear(post.created);
            let hour = date.getHours(post.created);
            let minutes = date.getMinutes(post.created);
            let seconds = date.getSeconds(post.created);
            let datum = `${day}-${month}-${year}  ${hour}:${minutes}:${seconds}`

            artikel += `
            
                <div class="artikel">
                    <span>${datum}</span>
                    <h2>#${post.id} ${post.titel}</h2>
                    <p>${post.content}</p>
                </div>
            
                `
        }
    }

    contentObj.innerHTML = artikel;

};

loadArtikel();

const loadPost = async () => {

    aObj[0].classList.remove('aktive');
    aObj[1].classList.add('aktive');

    let postContent = `
    <input type="text" placeholder="Hier Titel eingeben">
    <textarea id="textarea" cols="30" rows="10" placeholder="Hier Text eingeben"></textarea>
    <button>Artikel erstellen</button>
    `
    contentObj.innerHTML = postContent;

    const buttonObj = document.getElementsByTagName('button')[0];

    buttonObj.onclick = async () => {

        const inputObj = document.getElementsByTagName('input')[2];
        const textareaObj = document.getElementById('textarea');

        console.log(inputObj.value);
        console.log(textareaObj.value);

        if (!(inputObj.value.length > 0 && textareaObj.value.length > 0)) {
            alert('Bitte alle Felder ausfüllen!');
            return;
        }

        let body = {
            titel: inputObj.value,
            content: textareaObj.value
        }

        try {
            const response = await fetch('http://localhost:3000/blogposts', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const responseJson = await response.json();
                const responseStr = JSON.stringify(responseJson);
                loadArtikel();
            }
        } catch (err) {
            console.log('Error: ' + err);
        }
    }

};