function initRipple() {
  const btn = document.querySelector("button");
  btn.textContent = "Verifying...";
  setTimeout(() => {
    btn.textContent = "You passed!";
    btn.style.backgroundColor = "#4CAF50";
  }, 2000);
}