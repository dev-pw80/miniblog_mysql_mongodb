console.log('Mini-Blog');

const aObj = document.getElementsByTagName('a');
const contentObj = document.getElementById('content');


const loadArtikel = async () => {

    aObj[0].classList.add('aktive');
    aObj[1].classList.remove('aktive');

    const res = await fetch('http://localhost:3000/blogposts');
    const data = await res.json();
    
    let artikel = ``;

    for(post of data) {
        let curDate = post.created;
        let date = curDate.slice(0,10);
        let time = curDate.slice(11,19);

     artikel += `
        
            <div class="artikel">
                <span>${time}  ${date}</span>
                <h2>#${post.id} ${post.titel}</h2>
                <p>${post.content}</p>
            </div>
        
    `

    contentObj.innerHTML = artikel;
}

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

        const inputObj = document.getElementsByTagName('input')[0];
        const textareaObj = document.getElementById('textarea');

        console.log(inputObj.value);
        console.log(textareaObj.value);

        if(!(inputObj.value.length > 0 && textareaObj.value.length > 0)) {
            alert('Bitte alle Felder ausfüllen!');
            return;
        }

        // const formData = new FormData();
        // formData.append('titel', inputObj.value);
        // formData.append('content', textareaObj.value);

        let body = {
            titel: inputObj.value,
            content: textareaObj.value
        }

        try{
            const response = await fetch('http://localhost:3000/blogposts',
            {   
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(body)
            });

            if(response.ok) {
                const responseJson = await response.json();
                const responseStr = JSON.stringify(responseJson);
                loadArtikel();
            }
        }
        catch (err) {
            console.log('Error: ' + err);
        }
    }

};