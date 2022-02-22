function handleCredentialResponse(response) {
    const responsePayload = jwt_decode(response.credential);

    const user = {
        id: responsePayload.sub,
        fullName: responsePayload.name,
        firstName: responsePayload.given_name,
        lastName: responsePayload.family_name,
        profileImage: responsePayload.picture,
        email: responsePayload.email
    }

    localStorage.setItem('g_google_login_user', JSON.stringify(user));

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    window.location.href = '/profile.html';

    google.accounts.id.disableAutoSelect();

}

function handleSignOut() {
    const button = document.querySelector('.signout_button');
    button.onclick = () => {
        google.accounts.id.disableAutoSelect();
    }
}

function signOut() {
    let signOutButton = document.querySelector('.sign-out');

    if (signOutButton) {
        signOutButton.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('g_google_login_user');
            window.location.href = '/';
        });
    }
}

function isLogged() {
    if (window.location.pathname === '/profile.html') {
        const { email, firstName, fullName, id, lastName, profileImage } = JSON.parse(localStorage.g_google_login_user);
        google.accounts.id.disableAutoSelect();
        constructorProfile(email, firstName, fullName, id, lastName, profileImage);
    }
}

function constructorProfile(email, firstName, fullName, id, lastName, profileImage) {
    let userImage = document.querySelector('img');
    let userName = document.querySelector('p[name="fullName"]');
    let userEmail = document.querySelector('p[name="email"]');
    let userId = document.querySelector('p[name="id"]');

    userName.textContent = fullName;
    userId.textContent = id;
    userImage.src = profileImage;
    userEmail.textContent = email;
}

window.onload = function () {

    google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        {
            theme: "outline",
            size: "large",
            shape: "circle",
            type: "icon",
            text: "sign_in_with",
            login_uri: "/profile"
        }  // customization attributes
    );

    google.accounts.id.prompt(); // also display the One Tap dialog

    if (localStorage.g_google_login_user) {
        if (window.location.pathname === '/') {
            window.location.href = '/profile.html'
        }
        isLogged()
    }

    signOut();
}

