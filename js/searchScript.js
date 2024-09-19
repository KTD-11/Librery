const mainParent = document.querySelector("main");
fetchCategories();

async function fetchData(url){
    try{
        let response = await fetch(url);

        if (!response.ok){
            return [null, response.status];
        }

        let data = await response.json();
    
        return [data, null];
    }

    catch(err){
        return [null, err];
    }
}



function display(){
    const bookContainer = document.createElement('div');

    let bookTitle = document.createElement('h1'),
        bookAuthor = document.createElement('p'),
            bookCover = document.createElement('img'),
                textContainer = document.createElement('div'),
                    beginningContainer = document.createElement('div')

    bookContainer.classList.add('bookContainer');

    return [bookContainer, bookTitle, bookAuthor, bookCover, textContainer, beginningContainer];
}

function displayError(error){

    const errContainer = document.createElement('div');
    let errMsg = document.createElement('h1');

    errMsg.innerText = `Couldn't fetch the book , error status : ${error}`;

    errContainer.appendChild(errMsg)

    return errContainer;
}

document.addEventListener('DOMContentLoaded', async ()=>{

    Loader.open()

    const params = new URLSearchParams(window.location.search);

    if (params.has('genre')||params.has('book')){
        const key = params.has('genre') ? params.get('genre') : params.get('book');
        const url = params.has('genre') ? `https://openlibrary.org/subjects/${key.toLowerCase()}.json` : `https://openlibrary.org/search.json?q=${key.toString().split(',').join('')}`;
        document.title = params.has('genre') ? key : key.toString().replace(/[+,]/g, ' ');
        const param = params.has('genre') ? 'works' : 'docs';
    
        try{
            const books = await fetchData(url)
            console.log(books)

            if(books[0] === null){
                mainParent.appendChild(displayError(books[1]));
            }
    
            else{
                
                books[0][param].forEach(book => {
                        
                        let bookFragments = display();
        
                        bookFragments[1].innerText = book.title;   
                            
                        const authors = params.has('genre') ? book.authors.map(author => author.name)?.join(', ') : book.author_name?.join(', ');

                        bookFragments[2].innerText = authors;
        
                        let coverImage;

                        if (book.cover_id) coverImage = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                        else if (book.oclc) coverImage = `https://covers.openlibrary.org/b/oclc/${book.oclc[0]}-M.jpg`;
                        else if (book.isbn) coverImage = `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`;
                        else coverImage = 'assets/imgs/coverPlaceholder.webp';

                        bookFragments[3].src = coverImage; 

                        bookFragments[3].onload = ()=>{
                            if (bookFragments[3].naturalWidth === 1 && bookFragments[3].naturalHeight === 1) {
                                bookFragments[3].src = 'assets/imgs/coverPlaceholder.webp'; // Use placeholder for 1x1 images
                            }
                        };

                        bookFragments[3].onerror = ()=>{    
                            bookFragments[3].src = 'assets/imgs/coverPlaceholder.webp'; // Fallback for failed loads
                        };

                        bookFragments[5].className = 'genreContainer';

                        book.subject?.forEach(genre => {
                            let genreTag = document.createElement('span');
                            genreTag.innerText = genre
                            bookFragments[5].appendChild(genreTag)                               
                        });
        
                        bookFragments[4].appendChild(bookFragments[1]);
                            bookFragments[4].appendChild(bookFragments[2]);
                                bookFragments[4].appendChild(bookFragments[5]);
                        
                        bookFragments[0].appendChild(bookFragments[3]);
                            bookFragments[0].appendChild(bookFragments[4]);
        
                        mainParent.appendChild(bookFragments[0]);

                        bookFragments[0].addEventListener('click', ()=>{
                            const bookID = params.has('genre') ? book.lending_edition : book.key.split('/')[2]

                            window.location.href = `book.html?id=${bookID}&author=${authors.split(',')[0]}`
                        });
                });
            }
        }
        
        catch(err){
            mainParent.appendChild(displayError(err));
            console.error(err)
        }
    
        finally{
            Loader.close();
        }
    }
});

