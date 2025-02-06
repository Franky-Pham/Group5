import './gallery.scss';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  const closeModal = document.getElementById('modal-close');

  const galleryItems = document.querySelectorAll('.gallery-item img');
  galleryItems.forEach((img) => {
    img.addEventListener('click', () => {
      modalImage.src = img.src;
      modal.style.display = 'flex';
    });
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
