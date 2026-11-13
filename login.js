const $ = id => document.getElementById(id);
let mode = "signin";

function clearErrors() {
  ["nameError", "emailError", "passwordError"].forEach(id => $(id).textContent = "");
}
function setMode(nextMode) {
  mode = nextMode;
  const registering = mode === "register";
  $("signinTab").classList.toggle("active", !registering);
  $("registerTab").classList.toggle("active", registering);
  $("signinTab").setAttribute("aria-selected", String(!registering));
  $("registerTab").setAttribute("aria-selected", String(registering));
  $("nameField").classList.toggle("hidden", !registering);
  $("signinOptions").classList.toggle("hidden", registering);
  $("formEyebrow").textContent = registering ? "JOIN SHOPZONE" : "YOUR ACCOUNT";
  $("formTitle").textContent = registering ? "Create your account" : "Welcome back";
  $("formDescription").textContent = registering ? "A few details to get started." : "Enter your details to continue.";
  $("submitButton").innerHTML = registering ? "Create account <span>→</span>" : "Sign in <span>→</span>";
  $("password").autocomplete = registering ? "new-password" : "current-password";
  $("formFeedback").textContent = "";
  clearErrors();
}
$("signinTab").addEventListener("click", () => setMode("signin"));
$("registerTab").addEventListener("click", () => setMode("register"));
$("togglePassword").addEventListener("click", () => {
  const input = $("password");
  const visible = input.type === "password";
  input.type = visible ? "text" : "password";
  $("togglePassword").textContent = visible ? "Hide" : "Show";
});
$("forgotPassword").addEventListener("click", event => {
  event.preventDefault();
  $("formFeedback").textContent = "Password recovery is not connected in this prototype.";
});
$("authForm").addEventListener("submit", event => {
  event.preventDefault();
  clearErrors();
  $("formFeedback").textContent = "";
  const name = $("fullName").value.trim();
  const email = $("email").value.trim().toLowerCase();
  const password = $("password").value;
  let valid = true;
  if (mode === "register" && name.length < 2) {
    $("nameError").textContent = "Enter your name.";
    valid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    $("emailError").textContent = "Enter a valid email address.";
    valid = false;
  }
  if (password.length < 6) {
    $("passwordError").textContent = "Password must be at least 6 characters.";
    valid = false;
  }
  if (!valid) return;
  // Demo profile only. Passwords are not stored or sent anywhere.
  const profile = { name: mode === "register" ? name : email.split("@")[0], email };
  localStorage.setItem("shopzone-demo-user", JSON.stringify(profile));
  $("formFeedback").textContent = mode === "register"
    ? "Demo account created. Returning to the store..."
    : "Demo sign-in successful. Returning to the store...";
  setTimeout(() => window.location.href = "index.html", 900);
});
