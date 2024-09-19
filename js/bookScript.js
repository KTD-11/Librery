fetchData();
displayError();
const body = document.querySelector('body')

function createBookElements(bookNameP, authorNameP, bookDescriptionP){
    const bHeader = document.createElement('header'),
        bSection = document.createElement('section'),
            bFooter = document.createElement('footer'),
    imgContainer = document.createElement('div'),
        descriptionContainer = document.createElement('div'),
            alphaContainer = document.createElement('div')

    let bookTitle = document.createElement('h1'),
        authorName = document.createElement('p'),
            bookDescription = document.createElement('p'),
    imageCover = document.createElement('img'),
        downloadButton = document.createElement('button'),
            subjectContainer = document.createElement('div');

    authorName.innerText = `by : ${authorNameP}`;
        bookTitle.innerText = bookNameP;
            bookDescription.innerText = bookDescriptionP;
    downloadButton.innerHTML = `Preview`;
        downloadButton.className = `downloadButton`;
            subjectContainer.className = `subjectContainer`;
    bookTitle.className = 'bookTitle';

    alphaContainer.className = 'alphaContainer';

    bHeader.appendChild(bookTitle);
        bHeader.appendChild(authorName);

    descriptionContainer.appendChild(bookDescription);

    return [
        bHeader, bSection, bFooter, imgContainer, 
        descriptionContainer, imageCover, alphaContainer,
        downloadButton, subjectContainer
    ];
}

document.addEventListener('DOMContentLoaded', async ()=>{
    Loader.open();

    const params = new URLSearchParams(window.location.search),
        author = params.get('author');
            id = params.get('id');

    try{
        const bookData = await fetchData(`https://openlibrary.org${id}.json`, {
            mode: 'no-cors',
        });

        if(bookData[0] === null){
            displayError(bookData[2]);
        }

        else{

            let actualDescription;
            
            if(bookData[0].description){
                actualDescription = (typeof bookData[0].description === 'object' && bookData[0].description !== null) ? bookData[0].description.value : bookData[0].description;                
            }
            else{
                actualDescription = `Couldn't find a description for this book`
            }
            
            const bookFragments = createBookElements(
                bookData[0].title,
                author,
                actualDescription
            );
            console.log(bookData);

            bookFragments[5].src = bookData[0].covers ? `https://covers.openlibrary.org/b/id/${bookData[0].covers[0]}-M.jpg` : 'assets/imgs/coverPlaceholder.webp';

            bookFragments[5].onload = ()=>{
                if (bookFragments[5].naturalWidth === 1 && bookFragments[5].naturalHeight === 1) {
                    bookFragments[5].src = 'assets/imgs/coverPlaceholder.webp'; // Use placeholder for 1x1 images
                }
            };

            bookFragments[5].onerror = ()=>{    
                bookFragments[5].src = 'assets/imgs/coverPlaceholder.webp'; // Fallback for failed loads
            };

            bookData[0].subjects.forEach(subject => {
                let bookSubject = document.createElement('span');

                bookSubject.innerText = subject

                bookFragments[8].appendChild(bookSubject)
            });

            bookFragments[3].appendChild(bookFragments[5]);

            bookFragments[4].appendChild(bookFragments[8])

            bookFragments[1].appendChild(bookFragments[3]);
                bookFragments[1].appendChild(bookFragments[4]);

            bookFragments[2].appendChild(bookFragments[7]);

            bookFragments[6].appendChild(bookFragments[0]);
                bookFragments[6].appendChild(bookFragments[1]);
                    bookFragments[6].appendChild(bookFragments[2]);

            body.appendChild(bookFragments[6]);

            bookFragments[7].addEventListener('click', ()=>{
                window.location.href = `https://openlibrary.org/${id}`
            });
        }
    }

    catch(err){
        displayError(err);
    }

    finally{
        Loader.close();
    }
});
