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
const btnTakeAssessment = document.querySelector('.btn-complete');

btnTakeAssessment.addEventListener('click', () => {
  mainContent.style.display = 'none';
  quizOverlay.style.display = '';
  quizIframe.src = '/quiz.html';
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

// Nadia's Notes sidebar link
const sidebarNadiasNotes = document.getElementById('sidebar-nadias-notes');
if (sidebarNadiasNotes) sidebarNadiasNotes.addEventListener('click', (e) => {
  e.preventDefault();
  mainContent.style.display = 'none';
  quizOverlay.style.display = '';
  quizIframe.src = '/nadias-notes.html';
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  sidebarNadiasNotes.classList.add('active');
});

// Chat History sidebar link
const sidebarChatHistory = document.getElementById('sidebar-chat-history');
if (sidebarChatHistory) sidebarChatHistory.addEventListener('click', (e) => {
  e.preventDefault();
  mainContent.style.display = 'none';
  quizOverlay.style.display = '';
  quizIframe.src = '/chat-history.html';
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  sidebarChatHistory.classList.add('active');
});

// Journeys sidebar link
const sidebarJourneys = document.getElementById('sidebar-journeys');
if (sidebarJourneys) sidebarJourneys.addEventListener('click', (e) => {
  e.preventDefault();
  mainContent.style.display = 'none';
  quizOverlay.style.display = '';
  quizIframe.src = '/journeys.html';
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  sidebarJourneys.classList.add('active');
});
