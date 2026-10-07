import { getUserIds, getData, setData, clearData } from './storage.js';

import { fields, validateField, resetFieldErrors } from './validation.js';

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
  const options = USERS.map((user, index) => {
    const option = document.createElement('option');
    option.value = userIds[index];
    option.textContent = user;
    return option;
  });
  userSelect.append(...options);
}

populateDropdown();

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const formattedDateTime = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return `Date published: ${formattedDateTime}`;
}

function updateBookmark(userId, bookmarkId) {
  const bookmarks = getData(userId);
  const bookmark = bookmarks.find((item) => item.id === bookmarkId);

  if (!bookmark) return;

  bookmark.likes++;

  setData(userId, bookmarks);
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
  resetFieldErrors();
  form.classList.add('hidden');

  const userId = userSelect.selectedOptions[0].value;
  const userName = userSelect.selectedOptions[0].textContent;
  if (!userId) {
    bookmarkInfo.classList.add('hidden');
    userMessage.textContent = '';
    bookmarkList.replaceChildren();
    return;
  }

  const userData = getData(userId) ?? [];
  bookmarkInfo.classList.remove('hidden');
  userDetails.classList.remove('hidden');
  displayBookmarkCount(userName, userData);
  renderBookmarks(userData);
}

function handleBookmarkDeletions() {
  const userId = userSelect.selectedOptions[0].value;
  const userName = userSelect.selectedOptions[0].textContent;

  clearData(userId);

  bookmarkList.replaceChildren();
  displayBookmarkCount(userName, []);

  resetFieldErrors();
}

function displayBookmarkCount(userName, bookmarks) {
  if (bookmarks.length === 0) {
    userMessage.textContent = `${userName} currently has no bookmarks`;
    return;
  }
  userMessage.textContent = `${userName} has ${bookmarks.length} bookmark(s)`;
}

function saveBookmark(userId, bookmark) {
  form.classList.add('hidden');

  const bookmarks = getData(userId) ?? [];
  bookmarks.push(bookmark);

  displayBookmarkCount(bookmark.userName, bookmarks);
  setData(userId, bookmarks);
  renderBookmarks(bookmarks);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const allFieldsValid = fields.map(validateField).every(Boolean);

  if (!allFieldsValid) {
    fields
      .find((field) => field.input.getAttribute('aria-invalid') === 'true')
      .input.focus();
    return;
  }

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
  form.reset();
  resetFieldErrors();
}

fields.forEach((field) => {
  field.input.addEventListener('blur', () => validateField(field));

  field.input.addEventListener('input', () => {
    if (field.input.getAttribute('aria-invalid') === 'true') {
      validateField(field);
    }
  });
});

// event listeners
userSelect.addEventListener('change', handleUserChange);
addBookmarkButton.addEventListener('click', () => {
  form.classList.remove('hidden');
});
deleteBookmarksButton.addEventListener('click', handleBookmarkDeletions);
form.addEventListener('submit', handleFormSubmit);

// toast to confirm url has been copied
let toastTimeout;

function showToast(message) {
  clearTimeout(toastTimeout);

  toast.textContent = message;
  toast.classList.add('is-visible');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3000);
}
