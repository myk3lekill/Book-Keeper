//DOM
const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

//create array to implement localstorage
let bookmarks = {};

//Show Modal, Focus, Input
function showModal() {
    console.log('shownmodal')
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

//Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false))

//Validate Form for URL
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;//Regex validation for URL
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue) {
        alert('Please submit values for both fields.')
        return false;
    }
    if(!urlValue.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }
    //Valid
    return true;
}

//Build Bookmarks DOM
function buildBookmarks() {
    //Remove all bookmark elements
    bookmarksContainer.textContent = '';
    //Build items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        //Populate the html: add Item class
        const item = document.createElement('div');
        item.classList.add('item');
        //Add Close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        //Favicon and Link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `http://www.google.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        //Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        //Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

//Fetch bookmark from local storage
function fetchBookmarks() {
    //Get bookmarks from local storage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));//Use JSON.parse() method
    } else {
        //Create bookmarks array in local storage
        bookmarks = [
            {
                name: 'Jacinto Design',
                url: 'https://jacinto.design'
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    //console.log(bookmarks)
    buildBookmarks();
}

//Delete Bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    //Update bookmarks array to localstorage, re populate the DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

//Handle data from form
function storeBookmark(e) {
    e.preventDefault();
    //console.log(e);//console log the event on submit
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`
    }
    //console.log(nameValue, urlValue);
    if(!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue
    };
    bookmarks.push(bookmark);
    //console.log(bookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));//save array in local storage with setITem method. using JSON.stringify to avoid object objec problem
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

//Event Listener
bookmarkForm.addEventListener('submit', storeBookmark)//Remember: a form refresh at submit so we have to add a preventDefault method to event connect to the function storeBookmark

//On Load
fetchBookmarks();