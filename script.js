import { getUserIds, getData, setData, clearData } from './storage.js';

const userSelect = document.getElementById('users');
const userDetails = document.querySelector('.user-details');
const userMessage = document.querySelector('.message');
const addBookmarkButton = document.getElementById('add-bookmark');
const deleteBookmarksButton = document.getElementById('delete-bookmarks');
const form = document.getElementById('bookmark-form');
const bookmarkInfo = document.querySelector('.bookmark-info');
const bookmarkList = document.getElementById('user-bookmark');
const toast = document.getElementById('toast');

const USERS = [
  'Jason Brown',
  'Jorvan White',
  'Betty Smith',
  'Tom Cane',
  'Mary Johnson',
];

function populateDropdown() {
  const userIds = getUserIds();
  USERS.forEach((user, index) => {
    const option = document.createElement('option');
    option.value = userIds[index];
    option.textContent = user;
    userSelect.appendChild(option);
  });
}

populateDropdown();

function formatTimestamp(timestamp) {
  // set timestamp in new Date
  const date = new Date(timestamp);
  // format using toLocaleDateString - gb - day, month, year, hour, minute
  const formattedDateTime = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  // return formatted date
  return `Date published: ${formattedDateTime}`;
}

function updateBookmark(userId, bookmarkId) {
  // get userId and bookmarkId
  // get user bookmarks from local storage
  // find the relevant bookmark and update the like count. set updated bookmark in local storage
  // if no bookmark return
}

function createBookmarkCard(bookmark) {
  const card = document
    .getElementById('bookmark-template')
    .content.cloneNode(true);

  const titleLink = card.querySelector('h2 a');
  titleLink.textContent = bookmark.title;
  titleLink.href = bookmark.url;

  card.querySelector('.description').textContent =
    `Description: ${bookmark.description}`;

  card.querySelector('.timestamp').textContent = formatTimestamp(
    bookmark.timestamp
  );

  const likeButton = card.querySelector('.like');
  const likeCount = card.querySelector('.like-count');

  bookmark.likes = Number(bookmark.likes) || 0;
  likeCount.textContent = `Likes: ${bookmark.likes}`;

  likeButton.addEventListener('click', () => {
    bookmark.likes += 1;
    likeCount.textContent = `Likes: ${bookmark.likes}`;
    updateBookmark(bookmark.userId, bookmark.id);
  });

  const copyButton = card.querySelector('.copy');
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(bookmark.url);
      showToast('URL copied to clipboard');
    } catch {
      showToast('Unable to copy URL to clipboard');
    }
  });

  return card;
}

function renderBookmarks(bookmarks) {
  const sortedBookmarks = [...bookmarks].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  const cards = sortedBookmarks.map(createBookmarkCard);
  bookmarkList.replaceChildren(...cards);
  bookmarkList.classList.remove('hidden');
}

function handleUserChange() {
  // remove any errors that are showing
  // hide form
  // get userId and userName from select
  const userId = userSelect.selectedOptions[0].value;
  const userName = userSelect.selectedOptions[0].textContent;
  if (!userId) {
    // if userId is blank hide bookmark info, and make sure bookmarklist is empty
    bookmarkInfo.classList.add('hidden');
    userMessage.textContent = '';
    bookmarkList.replaceChildren();
    return;
  }

  // if there is a userId get the user data from local storage
  // if user has no data set it to empty array and show information regarding bookmark status
  // if user has bookmarks display them on the bookmarklist
  const userData = getData(userId) ?? [];
  bookmarkInfo.classList.remove('hidden');
  userDetails.classList.remove('hidden');
  displayBookmarkCount(userName, userData);
  renderBookmarks(userData);
}

function handleBookmarkClick() {
  // show form if user clicks on add bookmark button
  form.classList.remove('hidden');
}

function handleBookmarkDeletions() {
  // get userId and userName from select
  // clearData in local storage
  // clear bookmarklist and show message stating user has no bookmarks
}

function displayBookmarkCount(userName, bookmarks) {
  // display message showing how many bookmarks the user has
  if (bookmarks.length === 0) {
    userMessage.textContent = `${userName} currently has no bookmarks`;
    return;
  }
  userMessage.textContent = `${userName} has ${bookmarks.length} bookmark(s)`;
}

function saveBookmark(userId, bookmark) {
  // hide form
  form.classList.add('hidden');
  // get userbookmarks from local storage or return empty array
  const bookmarks = getData(userId) ?? [];
  // push the current bookmark into the array and save it in local storage
  bookmarks.push(bookmark);
  displayBookmarkCount(bookmark.userName, bookmarks);
  setData(userId, bookmarks);
  // render current bookmarks on the page
  renderBookmarks(bookmarks);
}

function handleFormSubmit(e) {
  e.preventDefault();
  // check all fields are valid before completing bookmark and saving it to local storage

  // user FormData to get the information entered
  const formData = new FormData(form);
  const bookmark = {
    id: crypto.randomUUID(),
    userId: userSelect.selectedOptions[0].value,
    userName: userSelect.selectedOptions[0].textContent,
    title: formData.get('title').trim(),
    description: formData.get('description').trim(),
    url: formData.get('url').trim(),
    likes: 0,
    timestamp: new Date().toISOString(),
  };
  saveBookmark(bookmark.userId, bookmark);
  // reset form
  form.reset();

  // clear all input field errors
}
// field validation - loop through all fields and check if all are valid

// event listeners
// event listener for userSelect change
userSelect.addEventListener('change', handleUserChange);
// event listener for adding bookmark
addBookmarkButton.addEventListener('click', handleBookmarkClick);
// event listener for deleting bookmark
deleteBookmarksButton.addEventListener('click', handleBookmarkDeletions);
// event listener for form submission
form.addEventListener('submit', handleFormSubmit);
