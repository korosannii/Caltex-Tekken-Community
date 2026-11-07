document.addEventListener("DOMContentLoaded", () => {
    const userNameDisplay = document.getElementById("userNameDisplay");
    const profileBtn = document.getElementById("profileBtn");
    const signInBtn = document.getElementById("signInBtn");
    const signOutBtn = document.getElementById("signOutBtn");
    const loginModal = document.getElementById("loginModal");
    const profileModal = document.getElementById("profileModal");
    const closeLoginBtn = document.getElementById("closeModal");
    const closeProfileBtn = document.getElementById("closeProfileModal");
    const loginForm = document.getElementById("loginForm");
    const profileForm = document.getElementById("profileForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorMsg = document.getElementById("errorMsg");
    const profileSaveMsg = document.getElementById("profileSaveMsg");

    function getProfile() {
        const username = localStorage.getItem("ctc_username");
        if (!username) return {};
        const savedProfile = localStorage.getItem(`ctc_profile:${username}`);
        return savedProfile ? JSON.parse(savedProfile) : {};
    }

    function updateAccountUI() {
        const savedUser = localStorage.getItem("ctc_username");
        const profile = getProfile();
        userNameDisplay.textContent = savedUser
            ? (profile.fullName || savedUser)
            : "Belum masuk";
        profileBtn.hidden = false;
        signInBtn.hidden = Boolean(savedUser);
        signOutBtn.hidden = !savedUser;
    }

    function openModal(modal, focusTarget) {
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        focusTarget.focus();
    }

    function closeModal(modal, focusTarget) {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        if (focusTarget && !focusTarget.hidden) focusTarget.focus();
    }

    function openLogin() {
        if (localStorage.getItem("ctc_username")) return;
        errorMsg.textContent = "";
        openModal(loginModal, usernameInput);
    }

    function openProfile() {
        if (!localStorage.getItem("ctc_username")) {
            openLogin();
            return;
        }

        const profile = getProfile();
        profileForm.elements.fullName.value = profile.fullName || "";
        profileForm.elements.email.value = profile.email || "";
        profileForm.elements.character.value = profile.character || "";
        profileForm.elements.bio.value = profile.bio || "";
        profileSaveMsg.textContent = "";
        openModal(profileModal, profileForm.elements.fullName);
    }

    signInBtn.addEventListener("click", openLogin);
    profileBtn.addEventListener("click", openProfile);
    closeLoginBtn.addEventListener("click", () => closeModal(loginModal, signInBtn));
    closeProfileBtn.addEventListener("click", () => closeModal(profileModal, profileBtn));

    [loginModal, profileModal].forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (event.target !== modal) return;
            if (modal === loginModal) {
                closeModal(loginModal, signInBtn);
            } else {
                closeModal(profileModal, profileBtn);
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        if (loginModal.classList.contains("is-open")) {
            closeModal(loginModal, signInBtn);
        } else if (profileModal.classList.contains("is-open")) {
            closeModal(profileModal, profileBtn);
        }
    });

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            errorMsg.textContent = "Username dan password wajib diisi.";
            return;
        }

        localStorage.setItem("ctc_username", username);
        loginForm.reset();
        closeModal(loginModal);
        updateAccountUI();
        profileBtn.focus();
    });

    profileForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const profile = {
            fullName: profileForm.elements.fullName.value.trim(),
            email: profileForm.elements.email.value.trim(),
            character: profileForm.elements.character.value.trim(),
            bio: profileForm.elements.bio.value.trim()
        };

        const username = localStorage.getItem("ctc_username");
        if (!username) return;
        localStorage.setItem(`ctc_profile:${username}`, JSON.stringify(profile));
        profileSaveMsg.textContent = "Profil berhasil disimpan.";
        updateAccountUI();
    });

    signOutBtn.addEventListener("click", () => {
        localStorage.removeItem("ctc_username");
        updateAccountUI();
    });

    updateAccountUI();
});
