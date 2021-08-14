import { getMovieById } from './fetch';
import movieTemplate from '../../src/templates/modal.hbs';
import { refs } from './refs';

const modalContentEl = document.querySelector('#modal-content');

const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];
const queueMovies = JSON.parse(localStorage.getItem('queueMovies')) || [];

export function controlModal() {
  const openModalBtnEl = document.querySelector('[data-modal-open]');
  const closeModalBtnEL = document.querySelector('[data-modal-close]');
  const modalEl = document.querySelector('[data-modal]');

  openModalBtnEl.addEventListener('click', onClickOpenModal);
  closeModalBtnEL.addEventListener('click', onClickCloseModal);

  function onClickOpenModal(event) {
    event.preventDefault();

    if (event.target.nodeName === 'UL') {
      return;
    }
    // openModal(modalEl);

    const listItem = event.target.closest('LI');
    if (!listItem) {
      return;
    }

    const movieId = Number(listItem.dataset.id);
    if (!movieId) {
      return;
    }

    let currentMovie = {};

    getMovieById(movieId)
      .then(movie => {
        currentMovie = movie;
        modalContentEl.innerHTML = movieTemplate(movie);
      })
      .then(() => {
        openModal(modalEl);
      })

      /* BUTTONS */
      .then(() => {
        const modalWatchedBtn = document.querySelector('#modal-watched-btn');
        const modalQueueBtn = document.querySelector('#modal-queue-btn');
        if (!modalWatchedBtn && !modalQueueBtn) {
          return;
        }

        controlBtnStyle({
          button: modalWatchedBtn,
          list: watchedMovies,
          movieId,
          listType: 'watched',
        });
        controlBtnStyle({ button: modalQueueBtn, list: queueMovies, movieId, listType: 'queue' });

        modalWatchedBtn.addEventListener('click', () => {
          let indexMovie = null;

          watchedMovies.forEach((item, idx) => {
            if (Number(item.id) === Number(movieId)) {
              indexMovie = idx;
            }
          });

          if (indexMovie !== null) {
            watchedMovies.splice(indexMovie, 1);
            localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
            controlBtnStyle({
              button: modalWatchedBtn,
              list: watchedMovies,
              movieId,
              listType: 'watched',
            });
            return;
          }
          watchedMovies.push(currentMovie);
          localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
          controlBtnStyle({
            button: modalWatchedBtn,
            list: watchedMovies,
            movieId,
            listType: 'watched',
          });
        });

        modalQueueBtn.addEventListener('click', () => {
          let indexMovie = null;

          queueMovies.forEach((item, idx) => {
            if (Number(item.id) === Number(movieId)) {
              indexMovie = idx;
            }
          });

          if (indexMovie !== null) {
            queueMovies.splice(indexMovie, 1);
            localStorage.setItem('queueMovies', JSON.stringify(queueMovies));
            controlBtnStyle({
              button: modalQueueBtn,
              list: queueMovies,
              movieId,
              listType: 'queue',
            });
            return;
          }
          queueMovies.push(currentMovie);
          localStorage.setItem('queueMovies', JSON.stringify(queueMovies));
          controlBtnStyle({ button: modalQueueBtn, list: queueMovies, movieId, listType: 'queue' });
        });
      });

    /* BUTTONS */
  }

  function openModal(modalEl) {
    modalEl.classList.remove('backdrop__hidden');
    document.body.style.overflow = 'hidden';
    document.body.style.width = 'calc(100% - 15px)';
  }

  function onClickCloseModal(event) {
    modalEl.classList.add('backdrop__hidden');
    modalContentEl.innerHTML = '';
    document.body.style.overflow = 'auto';
    document.body.style.width = '100%';
  }

  function controlBtnStyle({ button, list, movieId, listType }) {
    let indexMovie = null;

    list.forEach((item, idx) => {
      if (Number(item.id) === Number(movieId)) {
        indexMovie = idx;
      }
    });

    if (indexMovie !== null) {
      button.classList.add('in-list');
      button.textContent = listType === 'watched' ? 'REMOVE FROM WATCHED' : 'REMOVE FROM QUEUE';
      return;
    }

    button.classList.remove('in-list');
    button.textContent = listType === 'watched' ? 'ADD TO WATCHED' : 'ADD TO QUEUE';
  }
}