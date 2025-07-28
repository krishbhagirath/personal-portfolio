// **********************************************
// Live Typing Effect
// **********************************************

const phrases = [
    "Computer Engineer",
    "Sophomore at McMaster University",
    "Full Stack Developer"
];

let currentPhrase = 0;
let currentLetter = 0;
let isDeleting = false;
const textElement = document.getElementById("typing-text"); // links variable textElement to typing-text span in HTML

function type() {
    const phrase = phrases[currentPhrase];
    const visibleText = phrase.substring(0, currentLetter);
    textElement.textContent = visibleText;  // updates the HTML text element with the changing js string

    if (!isDeleting) { // currently typing
        if (currentLetter < phrase.length){
            currentLetter++;       // keep typing until phrase length reached, aka fully typed out
            setTimeout(type, 100); // typing speed
        } else {
            isDeleting = true;
            setTimeout(type, 2000); // wait before deleting
        }
    } else { // deleting text
        if (currentLetter > 0) {
            currentLetter--; // decreasing visible letters
            setTimeout(type, 50);
        } else {
            isDeleting = false;
            currentPhrase = (currentPhrase + 1) % phrases.length;
            setTimeout(type, 500); // short pause before next word, second arg is delay time
        }
    }
}

document.addEventListener("DOMContentLoaded", type);


// **********************************************
// Contact Form Submission Handling
// **********************************************

document.getElementById("contact-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const subject = form.subject.value;
    const message = form.message.value;

    try {
        const response = await fetch("/api/contact", { // sends a POST request to the server (your form to the backend using fetch API)
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, email, subject, message })
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const result = await response.json(); // reads response from server as JSON (success or error message)

        if (response.ok) {
            alert('✅ Message sent successfully!');
            form.reset(); // clear the form
        } else {
            alert('❌ Failed to send message: ' + result.error);
        }
    } catch (error) {
        console.error('❌ JS Error:', error);
        alert('❌ An unexpected error occurred.');
    }
});

// **********************************************
// Switching Timelines with Buttons
// **********************************************

function showTimeline(selectedCategory) {
  const timelineCategories = ['work', 'volunteer', 'education'];
  
  // Update subsection title text
const subsectionTitle = document.querySelector('.subsection-title');

const titles = {
  work: "Work / Technical Experience",
  volunteer: "Clubs & Volunteer Involvement",
  education: "Education"
};

subsectionTitle.textContent = titles[selectedCategory];


  timelineCategories.forEach(category => {
    const timelineElement = document.getElementById(`${category}-timeline`);

    if (timelineElement) {
      if (category === selectedCategory) {
        // First, show the section
        timelineElement.style.display = 'block';
        timelineElement.style.opacity = '0'; // Start hidden for animation

        // Trigger reflow to reset animation
        void timelineElement.offsetWidth;

        // Now animate in
        timelineElement.style.transition = 'opacity 0.6s ease';
        timelineElement.style.opacity = '1';

        // Re-initialize AOS after a small delay
        setTimeout(() => {
          AOS.refreshHard();
        }, 100);
      } else {
        // Hide the other timelines
        timelineElement.style.display = 'none';
        timelineElement.style.opacity = '0';
      }
    }
  });
}

// Wait until the DOM is fully loaded before setting the default view
document.addEventListener('DOMContentLoaded', () => {
  // Show the "work" timeline by default when the page loads
  showTimeline('work');
});


// **********************************************
// Modals
// **********************************************

// Open any modal
document.querySelectorAll(".view-project").forEach(button => {
  button.addEventListener("click", () => {
    const modalId = button.getAttribute("data-modal-id");
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("open");
      modal.querySelector('.modal-inner').scrollTop = 0;
      document.body.style.overflow = "hidden";
    }
  });
});


  document.addEventListener('click', function (e) {
    // Scroll Hint Button
    if (e.target.classList.contains('scroll-hint-button')) {
      const modalInner = e.target.closest('.modal-inner');
      if (modalInner) {
        modalInner.scrollBy({
          top: 200,
          behavior: 'smooth'
        });
      }
    }

    // Close Modal Button
    if (e.target.classList.contains('close-modal-btn')) {
      const modal = e.target.closest('.modal');
      if (modal) {
        modal.classList.remove('open');
      }
    }
  });

  // Arrow fade-out logic when user scrolls
  const observer = new MutationObserver(() => {
    const modals = document.querySelectorAll('.modal-inner');

    modals.forEach(modal => {
      modal.addEventListener('scroll', () => {
        const button = modal.querySelector('.scroll-hint-button');
        if (!button) return;

        if (modal.scrollTop > 100) {
          button.classList.add('hidden');
        } else {
          button.classList.remove('hidden');
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });


// **********************************************
// Slideshow Functionality
// **********************************************
document.addEventListener("DOMContentLoaded", () => {
  const slideshows = document.querySelectorAll(".project-slideshow");

  slideshows.forEach(slideshow => {
    const slides = slideshow.querySelectorAll(".slide");
    const prevBtn = slideshow.querySelector(".slideshow-btn.prev");
    const nextBtn = slideshow.querySelector(".slideshow-btn.next");

    let current = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    }

    if (slides.length > 0) {
      showSlide(current);

      prevBtn?.addEventListener("click", () => {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
      });

      nextBtn?.addEventListener("click", () => {
        current = (current + 1) % slides.length;
        showSlide(current);
      });
    }
  });
});
