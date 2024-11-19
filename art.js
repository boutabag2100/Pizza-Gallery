document.addEventListener('DOMContentLoaded', function() {
    // Existing lightbox code...

    // Add loading animation
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.animation = `pulse 0.5s ease ${index * 0.1}s`;
        item.style.opacity = '0';
        setTimeout(() => {
            item.style.opacity = '1';
        }, index * 100);
    });
}); 