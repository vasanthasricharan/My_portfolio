import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp }
    from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ================== Showcase State Tracking ==================
let currentVisible = "projects";
const sectionOrder = ["projects", "certificates", "techstack"];


// ================== Welcome Animation ==================
setTimeout(() => {
    const welcome = document.getElementById("welcome-content");
    const portfolio = document.getElementById("portfolio");

    welcome.style.display = "none";
    portfolio.classList.remove("portfolio-hidden");
    portfolio.classList.add("portfolio-visible");
}, 5000);

// ================== Firebase Setup ==================

// 🔴 REPLACE this entire firebaseConfig with YOUR new project config
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCLlSOc7C_Y-wcJRDrY_geS1PmTuLeZDuw",
    authDomain: "portfolio-messages-charan.firebaseapp.com",
    projectId: "portfolio-messages-charan",
    storageBucket: "portfolio-messages-charan.firebasestorage.app",
    messagingSenderId: "1034154638276",
    appId: "1:1034154638276:web:7026426508bea5e7264291"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to "messages" collection
const messagesRef = collection(db, "messages");


// ================== Contact Form Firestore ==================
const form = document.getElementById("contactForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const comment = document.getElementById("comment").value.trim();

        if (!name || !email || !comment) {
            alert("Please fill all fields");
            return;
        }

        try {
            await addDoc(messagesRef, {
                name,
                email,
                comment,
                createdAt: serverTimestamp()
            });

            alert("Message Sent Successfully!");
            form.reset();

        } catch (error) {
            console.error("Firestore Error:", error);
            alert("Error sending message");
        }
    });
}

// ================== Typewriter ==================
const sentences = [
    "Electronics and Communication Student...",
    "VLSI Enthusiast"
];

let i = 0;
let j = 0;
let isDeleting = false;
const speed = 100;
const pause = 1000;

const textElement = document.getElementById("typewriter");

function type() {
    const current = sentences[i];

    if (!isDeleting) {
        textElement.textContent = current.substring(0, j++);
        if (j > current.length) {
            isDeleting = true;
            setTimeout(type, pause);
            return;
        }
    } else {
        textElement.textContent = current.substring(0, j--);
        if (j < 0) {
            isDeleting = false;
            i = (i + 1) % sentences.length;
        }
    }

    setTimeout(type, speed);
}
type();



// ================== Scroll Reveal ==================
function revealOnScroll() {
    const reveals = document.querySelectorAll('.hidden');
    const windowHeight = window.innerHeight;

    reveals.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add('visible');
            el.classList.remove('hidden');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);



// ================== Showcase Sliding Tabs ==================
let isAnimating = false;

function showContent(targetId, event) {
    if (isAnimating || targetId === currentVisible) return;

    // update button state
    document.querySelectorAll('.box-button').forEach(btn => btn.classList.remove('active'));
    if (event?.target) event.target.classList.add('active');

    const current = document.getElementById(currentVisible);
    const next = document.getElementById(targetId);
    const isForward = sectionOrder.indexOf(targetId) > sectionOrder.indexOf(currentVisible);

    // reset animation classes
    ['slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right']
        .forEach(c => {
            current.classList.remove(c);
            next.classList.remove(c);
        });

    // prepare next content
    next.classList.add('active');
    next.style.pointerEvents = 'none';

    // force reflow
    void next.offsetWidth;
    void current.offsetWidth;

    // animate
    current.classList.add(isForward ? 'slide-out-left' : 'slide-out-right');
    next.classList.add(isForward ? 'slide-in-right' : 'slide-in-left');

    isAnimating = true;

    // cleanup current
    current.addEventListener('animationend', function handler() {
        current.classList.remove('active', 'slide-out-left', 'slide-out-right');
        current.removeEventListener('animationend', handler);
    });

    // cleanup next
    next.addEventListener('animationend', function handler() {
        next.classList.remove('slide-in-right', 'slide-in-left');
        next.style.pointerEvents = '';
        next.removeEventListener('animationend', handler);
        isAnimating = false;
    });

    currentVisible = targetId;
}



// ================== Attach Showcase Buttons ==================
document.querySelectorAll('.box-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const text = btn.textContent.trim().toLowerCase();
        let targetId = "";

        if (text.includes("project")) targetId = "projects";
        else if (text.includes("certificate")) targetId = "certificates";
        else if (text.includes("tech")) targetId = "techstack";

        if (targetId) showContent(targetId, e);
    });
});



// ================== Certificates Modal ==================
function showCertificate(imageSrc) {
    const modal = document.getElementById('certificate-modal');
    const modalImg = document.getElementById('modal-image');

    if (!modal || !modalImg) return;

    modal.style.display = 'block';
    modalImg.src = imageSrc;
}

function closeModal() {
    const modal = document.getElementById('certificate-modal');
    if (modal) modal.style.display = 'none';
}

// Click images
document.querySelectorAll('.certificate-item img').forEach(img => {
    img.addEventListener('click', (event) => {
        showCertificate(event.target.src);
    });
});

// Close button
const closeBtn = document.querySelector('.close');
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}



// ================== Expand Coding Profiles Card ==================
document.addEventListener("DOMContentLoaded", () => {

    const codingCard = document.getElementById("codingCard");

    if (!codingCard) return;

    codingCard.addEventListener("click", function (e) {

        // prevent link click collapse
        if (e.target.closest("a")) return;

        codingCard.classList.toggle("active");
    });

});
