document.addEventListener('DOMContentLoaded', () => {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentIndex = 0;

    // Show the first testimonial
    testimonials[currentIndex].classList.add('active');

    // Function to update the visible testimonial
    const showTestimonial = (index) => {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (i === index) {
                testimonial.classList.add('active');
            }
        });
    };

    // Previous button event
    document.getElementById('prev').addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonials.length - 1;
        showTestimonial(currentIndex);
    });

    // Next button event
    document.getElementById('next').addEventListener('click', () => {
        currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
        showTestimonial(currentIndex);
    });
});
document.querySelectorAll('.toggle').forEach(item => {
    item.addEventListener('click', function() {
        // Toggle collapse visibility
        const collapse = this.nextElementSibling;
        collapse.style.display = collapse.style.display === 'block' ? 'none' : 'block';
        
        // Toggle active class for arrow rotation
        this.classList.toggle('active');
    });
});
