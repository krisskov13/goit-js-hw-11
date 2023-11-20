import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createGalleryCards } from './gallery-cards.js';
import { getPhotos } from './pixabay-api.js';

const form = document.querySelector('.search-form');
const galleryBox = document.querySelector('.gallery');
const input = document.querySelector('input');
const loadMoreButton = document.querySelector('.load-more');
let userInput;
let perPage = 40;
let page;
let totalAmountOfPhoto = 0;
let arrOfPhotos = [];

loadMoreButton.classList.add('is-hidden');

async function getData(userInput, page, perPage) {
  try {
    const response = await getPhotos(userInput, page, perPage);
    totalAmountOfPhoto = response.totalHits;
      arrOfPhotos = response.hits;
      const lastPage = Math.ceil(totalAmountOfPhoto / perPage);
      if (lastPage === page) {
          Notiflix.Notify.info(
              `We're sorry, but you've reached the end of search results.`
          );
          loadMoreButton.classList.add('is-hidden');
      }
    galleryBox.insertAdjacentHTML('beforeend', createGalleryCards(arrOfPhotos));
    const lightbox = new SimpleLightbox('.gallery a', {
      captions: true,
      captionPosition: 'bottom',
      captionDelay: 250,
      captionsData: 'alt',
    });
  } catch (error) {
    console.log(error);
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  page = 1;
  galleryBox.innerHTML = '';
  userInput = input.value.trim();
  if (!userInput) {
    Notiflix.Notify.failure(
      'Sorry, you can`t submit the empty query. Please type the text.'
    );
    return;
  }
  await getData(userInput, page, perPage);
  console.log(arrOfPhotos.length);
  if (arrOfPhotos.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
      loadMoreButton.classList.add('is-hidden');
    return;
  }
  if (arrOfPhotos.length < perPage) {
      Notiflix.Notify.success(`Hooray! We found ${totalAmountOfPhoto} images.`);
      loadMoreButton.classList.add('is-hidden');
  } else {
    Notiflix.Notify.success(`Hooray! We found ${totalAmountOfPhoto} images.`);
    loadMoreButton.classList.remove('is-hidden');
  }
});

loadMoreButton.addEventListener('click', async () => {
    page += 1;
    await getData(userInput, page, perPage);
});

