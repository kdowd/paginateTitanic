
async function handleSignIn() {
    let userEmail = document.querySelector('#email').value;
    let uersPassword = document.querySelector('#password').value;

    userEmail = userEmail.trim();
    uersPassword = uersPassword.trim();

    // if (userEmail == '' || uersPassword == '') {
    //     console.warn("Insufficent login details");
    //     return;
    // }

    // let result = await db.auth.signInWithPassword({
    //     email: userEmail,
    //     password: uersPassword,
    // });

    // for debug only
    // let result = await db.auth.signInWithPassword({
    //     email: "dave@gmail.com",
    //     password: "12345678",
    // });

    // let result = await db.auth.signUp({
    //     email: "qwerty11@gmail.com",
    //     password: "12345678",
    // });

    let result = await supabase.auth.signUp({
        email: 'user@example.com',
        password: 'password123',
        options: {
            data: {
                role: 'shop_employee'  // Pass in the value of the hidden field here
            }
        }
    });

    // let result = await supabase.auth.admin.createUser({
    //     email: 'shop_staff',
    //     password: '12345678',
    //     app_metadata: { role: 'shop_staff' } // Securely tied to JWT
    // });

    let data = result.data;
    let error = result.error;

    if (error) {
        alert("Invalid login credentials"); // e.g. "Invalid login credentials"
        return;
    }

    if (data) {
        console.log(data);
        checkSession();
    }

}

async function checkSession() {
    const res = await db.auth.getSession();
    let ele = document.querySelector(".status span");
    let emailStatusEle = document.querySelector(".status .email");

    if (res.data.session == null) {
        ele.textContent = "not logged in";
        emailStatusEle.textContent = "";
    } else {
        ele.textContent = "Logged in";
        let email = res.data.session?.user?.email || "";
        emailStatusEle.textContent = email;
    }

    // showUser(data.session ? data.session.user : null);
}

async function logOut() {
    await db.auth.signOut();
    checkSession();

}

checkSession();
