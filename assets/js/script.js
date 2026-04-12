'use strict';

// ─── Utility ──────────────────────────────────────────────────────────────────

const elementToggleFunc = elem => elem.classList.toggle('active');


// ─── Sidebar toggle (mobile) ──────────────────────────────────────────────────

const sidebar    = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));


// ─── Testimonials modal ───────────────────────────────────────────────────────

const testimonialsItems = document.querySelectorAll('[data-testimonials-item]');
const modalContainer    = document.querySelector('[data-modal-container]');
const modalCloseBtn     = document.querySelector('[data-modal-close-btn]');
const overlay           = document.querySelector('[data-overlay]');
const modalImg          = document.querySelector('[data-modal-img]');
const modalTitle        = document.querySelector('[data-modal-title]');
const modalText         = document.querySelector('[data-modal-text]');

const toggleModal = () => {
  modalContainer.classList.toggle('active');
  overlay.classList.toggle('active');
};

testimonialsItems.forEach(item => {
  item.addEventListener('click', () => {
    modalImg.src   = item.querySelector('[data-testimonials-avatar]').src;
    modalImg.alt   = item.querySelector('[data-testimonials-avatar]').alt;
    modalTitle.innerHTML = item.querySelector('[data-testimonials-title]').innerHTML;
    modalText.innerHTML  = item.querySelector('[data-testimonials-text]').innerHTML;
    toggleModal();
  });
});

if (modalCloseBtn) modalCloseBtn.addEventListener('click', toggleModal);
if (overlay)       overlay.addEventListener('click', toggleModal);


// ─── Custom select (mobile portfolio filter) ──────────────────────────────────

const select      = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-selecct-value]');
const filterBtns  = document.querySelectorAll('[data-filter-btn]');

if (select) select.addEventListener('click', () => elementToggleFunc(select));

selectItems.forEach(item => {
  item.addEventListener('click', () => {
    const value = item.innerText.toLowerCase();
    selectValue.innerText = item.innerText;
    elementToggleFunc(select);
    filterFunc(value);
    // keep filter buttons in sync
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.innerText.toLowerCase() === value);
    });
  });
});


// ─── Filter functionality ─────────────────────────────────────────────────────

const filterFunc = selectedValue => {
  document.querySelectorAll('[data-filter-item]').forEach(item => {
    const match =
      selectedValue === 'all' ||
      item.dataset.category.toLowerCase() === selectedValue;
    item.classList.toggle('active', match);
  });
};

let lastClickedBtn = filterBtns[0];

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = btn.innerText;

    filterFunc(value);

    if (lastClickedBtn) lastClickedBtn.classList.remove('active');
    btn.classList.add('active');
    lastClickedBtn = btn;
  });
});


// ─── Contact form validation ──────────────────────────────────────────────────

const form       = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn    = document.querySelector('[data-form-btn]');

formInputs.forEach(input => {
  input.addEventListener('input', () => {
    if (form && formBtn) {
      formBtn.disabled = !form.checkValidity();
    }
  });
});


// ─── Page navigation ──────────────────────────────────────────────────────────

const navLinks = document.querySelectorAll('[data-nav-link]');
const pages    = document.querySelectorAll('[data-page]');

navLinks.forEach((link, linkIndex) => {
  link.addEventListener('click', () => {
    const targetPage = link.innerHTML.toLowerCase();

    pages.forEach((page, pageIndex) => {
      const isMatch = targetPage === page.dataset.page;
      page.classList.toggle('active', isMatch);
      navLinks[pageIndex].classList.toggle('active', isMatch);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Animate skill bars when Resume tab is activated
    if (targetPage === 'resume') animateSkillBars();
  });
});


// ─── Skill bar animation ──────────────────────────────────────────────────────

function animateSkillBars() {
  document.querySelectorAll('.skill-progress-fill').forEach(bar => {
    // Save target width, collapse to 0, then animate back
    const target = bar.style.width || '0%';
    bar.style.width = '0%';
    // Double rAF: first frame paints the 0 state, second triggers the transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.width = target;
      });
    });
  });
}
