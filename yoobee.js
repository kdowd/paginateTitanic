
async function onSubmit(e) {
    e.preventDefault();
    const { error } = await db
        .from(TABLE)
        .insert({ firstname: 'Sammy', lastname: 'Snake', country: 'BG' });

    if (error) {
        console.warn('Error inserting data:', error.message);
    } else {
        clearContentElement();
        getStudents();
    }

}

function clearContentElement() {
    const container = document.querySelector('.content');
    container.replaceChildren();
}

async function getStudents() {

    let result = await db.from(TABLE)
        .select('*')
        .order('id', { ascending: true });

    let error = result.error;
    let data = result.data;

    if (error) {
        // update the UI, let the user know there's been a problem
        console.warn(error.message);

        return;
    }

    if (!data || data.length == 0) {
        return;
    }
    window.debugData = data;

    const templateWrap = document.querySelector('#student-card-template');
    const container = document.querySelector('.content');

    data.forEach(element => {
        const clone = templateWrap.content.cloneNode(true);
        const name = clone.querySelector('.name');
        const country = clone.querySelector('.country');
        name.textContent = `${element.firstname} ${element.lastname}`;
        country.textContent = `${element.country}`;

        container.appendChild(clone);

    });
}
getStudents();
