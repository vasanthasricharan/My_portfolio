// ================== Firebase Imports (must be at top for modules) ==================
import { getFirestore, collection, addDoc, getDocs, serverTimestamp }
    from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

// ================== Showcase State Tracking ==================
let currentVisible = "projects";
const sectionOrder = ["projects", "certificates", "techstack"];

// ================== Portfolio Animations ==================
setTimeout(() => {
    const welcome = document.getElementById("welcome-content");
    const portfolio = document.getElementById("portfolio");

    welcome.style.display = "none";
    portfolio.style.display = "block";

    setTimeout(() => {
        portfolio.classList.add("visible");
    }, 50);
}, 4500);

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

// Track which content is visible
// let currentVisible = "projects";
// const sectionOrder = ["projects", "certificates", "techstack"];
let isAnimating = false;

function showContent(targetId, event) {
    if (isAnimating || targetId === currentVisible) return;

    // update button state
    document.querySelectorAll('.box-button').forEach(btn => btn.classList.remove('active'));
    if (event?.target) event.target.classList.add('active');

    const current = document.getElementById(currentVisible);
    const next = document.getElementById(targetId);
    const isForward = sectionOrder.indexOf(targetId) > sectionOrder.indexOf(currentVisible);

    // reset old animation classes
    ['slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right']
        .forEach(c => { current.classList.remove(c); next.classList.remove(c); });

    // prepare next content
    next.classList.add('active');
    next.style.pointerEvents = 'none';

    // force reflow (ensures CSS animations trigger)
    void next.offsetWidth;
    void current.offsetWidth;

    // animate both
    current.classList.add(isForward ? 'slide-out-left' : 'slide-out-right');
    next.classList.add(isForward ? 'slide-in-right' : 'slide-in-left');

    isAnimating = true;

    // after current slides out → hide it
    current.addEventListener('animationend', function handler() {
        current.classList.remove('active', 'slide-out-left', 'slide-out-right');
        current.removeEventListener('animationend', handler);
    });

    // after next slides in → cleanup
    next.addEventListener('animationend', function handler() {
        next.classList.remove('slide-in-right', 'slide-in-left');
        next.style.pointerEvents = '';
        next.removeEventListener('animationend', handler);
        isAnimating = false;
    });

    // update visible state
    currentVisible = targetId;
}

// ================== Attach to buttons ==================
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

// ================== Firestore Contact Form ==================

// 🔹 Your Firebase config (update storageBucket to .appspot.com)
const firebaseConfig = {
    apiKey: "AIzaSyBv97YGYE4-3M3ELERZrykIhtGxKwVbnHY",
    authDomain: "portfoliomessages65.firebaseapp.com",
    projectId: "portfoliomessages65",
    storageBucket: "portfoliomessages65.appspot.com",
    messagingSenderId: "728009265061",
    appId: "1:728009265061:web:747514012a23bd28b2e24c",
    measurementId: "G-STC806ZSRK"
};

// Initialize Firebase + Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, "messages");

// Form elements
const form = document.getElementById('contactForm');
const messagesList = document.getElementById('messagesList');
const showMessagesBtn = document.getElementById('showMessagesBtn');
const contactSection = document.getElementById('contactSection');
const messagesSection = document.getElementById('messagesSection');
const backBtn = document.getElementById('backBtn');

// Handle form submit → Save to Firestore
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const comment = document.getElementById('comment').value.trim();

    if (name && email && comment) {
        try {
            await addDoc(messagesRef, {
                name,
                email,
                comment,
                createdAt: serverTimestamp()
            });
            alert("✅ Message saved to Firestore!");
            form.reset();
        } catch (err) {
            console.error("❌ Firestore error:", err);
            alert("❌ Error: " + err.message);
        }
    }
});

// Show messages view → Fetch from Firestore
showMessagesBtn.addEventListener('click', async () => {
    contactSection.style.display = "none";
    messagesSection.style.display = "block";
    messagesList.innerHTML = ""; // Clear old list

    try {
        const querySnapshot = await getDocs(messagesRef);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const li = document.createElement('li');
            li.style.marginBottom = "10px";
            li.style.padding = "10px";
            li.style.border = "1px solid white";
            li.style.borderRadius = "8px";
            li.innerHTML = `<strong>${data.name}</strong> (${data.email}): <br>${data.comment}`;
            messagesList.appendChild(li);
        });
    } catch (err) {
        console.error("❌ Firestore fetch error:", err);
    }
});

// Back to form view
backBtn.addEventListener('click', () => {
    messagesSection.style.display = "none";
    contactSection.style.display = "block";
});

// ================== Certificates Modal ==================
function showCertificate(imageSrc) {
    const modal = document.getElementById('certificate-modal');
    const modalImg = document.getElementById('modal-image');
    modal.style.display = 'block';
    modalImg.src = imageSrc;
}

function closeModal() {
    const modal = document.getElementById('certificate-modal');
    modal.style.display = 'none';
}

document.querySelectorAll('.certificate-item img').forEach(img => {
    img.addEventListener('click', (event) => {
        showCertificate(event.target.src);
    });
});
document.querySelector('.close').addEventListener('click', closeModal);

