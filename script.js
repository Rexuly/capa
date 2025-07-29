const loginModal = document.getElementById('loginModal');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const feedback = document.getElementById('loginFeedback');

function openLogin() {
  loginModal.style.display = 'block';
}

closeBtn.onclick = () => {
  loginModal.style.display = 'none';
};

window.onclick = e => {
  if (e.target === loginModal) loginModal.style.display = 'none';
};

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  // Only RX can log in
  if (user === "RX" && pass === "temporaryAccess123") {
    feedback.textContent = "Login successful. Welcome RX.";
    feedback.style.color = "lightgreen";
    setTimeout(() => {
      loginModal.style.display = 'none';
    }, 2000);
  } else {
    feedback.textContent = "Access denied. This login is restricted.";
    feedback.style.color = "red";
  }
});
