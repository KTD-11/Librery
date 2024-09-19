const parent = document.querySelector('div.dropdown-content')

//handling the categories
document.addEventListener('DOMContentLoaded', async()=>{
    let categoriesJson = await fetchCategories()

    categoriesJson.forEach(element => {
        
        const li = document.createElement('li');

        li.innerText = element

        parent.appendChild(li)

        li.addEventListener('click', ()=>{
            const genreParameter = element.split(' ').map((word, index) => (index === (element.split(' ').length - 1)) ? word : `${word}_`);
            
            window.location.href = `search.html?genre=${encodeURIComponent(genreParameter.join(''))}`;
        });
    });
});


async function fetchCategories() {
    try{
        const categories = await fetch(`js/categories.json`);

        if(!categories.ok){
            return [null, response.status];
        }

        return await categories.json();
    }

    catch(err){
        return [null, err];
    }
}

function redirectToBookSearch(name){
    const book = name.split(' ').map((word, index) => (index === (name.split(' ').length - 1)) ? word : `${word}+`);

    window.location.href = `search.html?book=${encodeURIComponent(book)}`;
}

function preRedirect(val){
    if(val === ""){
        Swal.fire({
            title: "Error",
            text: "You Can't leave The SearchBox Empty",
            icon: "error"
        });
    }
    else{
        redirectToBookSearch(val)
    }
}

document.querySelector('button').addEventListener('click', ()=>{preRedirect(document.querySelector('input').value)});
document.querySelector('input').addEventListener('keyup', (e)=>{
    if(e.key === 'Enter'){
        preRedirect(document.querySelector('input').value)
    }
});