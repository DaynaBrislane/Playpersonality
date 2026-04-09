// Password gate
const gate = document.getElementById('password-gate');
const pageContent = document.getElementById('page-content');
const pwInput = document.getElementById('password-input');
const pwBtn = document.getElementById('password-btn');
const pwError = document.getElementById('password-error');

function checkPassword() {
  if (pwInput.value.toLowerCase().trim() === 'cosmic latte') {
    gate.style.display = 'none';
    pageContent.style.display = '';
    sessionStorage.setItem('collab-profiles-auth', 'true');
  } else {
    pwError.textContent = 'Incorrect password';
    pwInput.value = '';
    pwInput.focus();
  }
}

if (sessionStorage.getItem('collab-profiles-auth') === 'true') {
  gate.style.display = 'none';
  pageContent.style.display = '';
}

pwBtn.addEventListener('click', checkPassword);
pwInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkPassword();
});

// Quiz overlay
const mainContent = document.getElementById('main-content');
const quizOverlay = document.getElementById('quiz-overlay');
const quizIframe = document.getElementById('quiz-iframe');
const quizBackBtn = document.getElementById('quiz-back-btn');
const btnTakeAssessment = document.querySelector('.btn-complete');

btnTakeAssessment.addEventListener('click', () => {
  mainContent.style.display = 'none';
  quizOverlay.style.display = '';
  quizIframe.src = '/quiz.html';
});

quizBackBtn.addEventListener('click', () => {
  quizOverlay.style.display = 'none';
  mainContent.style.display = '';
  quizIframe.src = 'about:blank';
  // Reset sidebar active state to Home
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.sidebar-item')[1].classList.add('active');
});

// Listen for quiz "Explore Perspective" message
window.addEventListener('message', (e) => {
  if (e.data && e.data.action === 'showProfileView') {
    quizIframe.src = '/collaboration-profile-view.html';
  }
  if (e.data && e.data.action === 'showPersonProfile') {
    quizIframe.src = '/person-profile.html';
  }
});

// Home sidebar link
const sidebarHome = document.getElementById('sidebar-home');
if (sidebarHome) sidebarHome.addEventListener('click', (e) => {
  e.preventDefault();
  quizOverlay.style.display = 'none';
  mainContent.style.display = '';
  quizIframe.src = 'about:blank';
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  sidebarHome.classList.add('active');
});

// New Chat sidebar link
const sidebarNewChat = document.getElementById('sidebar-new-chat');
if (sidebarNewChat) sidebarNewChat.addEventListener('click', (e) => {
  e.preventDefault();
  mainContent.style.display = 'none';
  quizOverlay.style.display = '';
  quizIframe.src = '/new-chat.html';
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  sidebarNewChat.classList.add('active');
});

// Collaboration Profile sidebar link
const sidebarCollabProfile = document.getElementById('sidebar-collab-profile');
if (sidebarCollabProfile) sidebarCollabProfile.addEventListener('click', (e) => {
  e.preventDefault();
  mainContent.style.display = 'none';
  quizOverlay.style.display = '';
  quizIframe.src = '/collaboration-profile-view.html';
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  sidebarCollabProfile.classList.add('active');
});

// My People sidebar link
const sidebarMyPeople = document.getElementById('sidebar-my-people');
if (sidebarMyPeople) sidebarMyPeople.addEventListener('click', (e) => {
  e.preventDefault();
  mainContent.style.display = 'none';
  quizOverlay.style.display = '';
  quizIframe.src = '/my-people.html';
  // Update active sidebar state
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  sidebarMyPeople.classList.add('active');
});
