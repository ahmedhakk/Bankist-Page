'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault(); // Because our open model is a link with href = '#' - So it will reload the page with searching #, page don't jump to the top
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Btn Scrolling 
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////////////////
/* ================================================== */
// V : 192 Event Delegation_Implementing Page Navigation
// == Page Navigation ==
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', e => {
//     e.preventDefault(); // to make links not takes us to the sectioin by the id

//     const id = el.getAttribute('href'); // #section--1
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); // we will get section
//   })
// });

// == Event Delegation ==  -> It is better
// 1. Add event listener to common parent element
// 2. Determine what element originated أنشأ the event = where the clicks happened
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target); // <a class="nav__link" href="#section--1">Features</a>
  e.preventDefault(); // to make links not takes us to the sectioin by the id

  // Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); // #section--1
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
/* ================================================== */
// V : 194 - Building a Tabbed Component
// Tabbed Components

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return; // !null = true
  // Remove active class
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  // Activate Tab
  clicked.classList.add('operations__tab--active');
  // Activate content area
  tabsContent.forEach(tabCon => tabCon.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});
/* ================================================== */
// V : 195 - Passing Arguments to Event Handlers
// Menu fade animation

const handleHover = function (e) {
  // console.log(this); // 1 , 0.5 -> opacity
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// Passing "arrgument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5)); // so when we use this fun - this = 0.5
// To undo what we did 
nav.addEventListener('mouseout', handleHover.bind(1));
/* ================================================== */
// V : 196 - Implementing a Sticky Navigation the Scroll Event
// Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top)
//     nav.classList.add('sticky');
//   else
//     nav.classList.remove('sticky');
// });
/* ================================================== */
// V : 197 - A Better Way the Intersection Observer API - مراقب التقاطع - like offsite man
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight); // DOMRect {x: 30, y: -248.75, width: 1123.75, height: 90, top: -248.75, …}

const stickyNav = function (entries) {
  // console.log(entries); // [IntersectionObserverEntry]
  const [entry] = entries; // entry - مدخل // [IntersectionObserverEntry] = entries
  // console.log(entry);
  if (!entry.isIntersecting) // متقاطعة
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // be visible if the header be 0% in the page
  rootMargin: `-${navHeight}px` // if the target is gone with out the last 90px of it
});
headerObserver.observe(header);
/* ================================================== */
// V : 198 - Revealing يكشف Elements on Scroll
// Reveal sections
const allSections = document.querySelectorAll('.section')

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (entry.isIntersecting)
    entry.target.classList.remove('section--hidden');
  else
    return;
  observer.unobserve(entry.target); // to stop observing sections after loaded
}

// rules
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
/* ================================================== */
// V : 199 - Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    // replace src with data-src
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () { // To wait till the image loads - for slow inernet in any reason
      entry.target.classList.remove('lazy-img');
    });
  } else return;
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px' // makes the lazy-load loaded after img be visible 200px from it 
});
imgTargets.forEach(img => imgObserver.observe(img));
/* ================================================== */
// V 200 : Buliding a Slider Component_Part 1
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  }

  const activateDots = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`; // 0%, 100%, 200%, 300%
    });
  } // curSlide = 1: -100%, 0%, 100%, 200%

  // Next Slide
  const nextSlide = () => {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  }
  // Previous Slide
  const prevSlide = () => {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  }

  // Initially function calls
  const init = function () {
    goToSlide(0);
    createDots();
    activateDots(0);
  }
  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  /* ================================================== */
  // V : 201 - Buliding a Slider Component_Part 2
  document.addEventListener('keydown', function (e) {
    // console.log(e);
    e.key === 'ArrowLeft' && prevSlide()
    e.key === 'ArrowRight' && nextSlide()
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDots(slide);
    }
  });
}
slider();
