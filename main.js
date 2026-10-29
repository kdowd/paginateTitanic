async function getMaxRows() {
    const { count, error } = await db
        .from(TABLE)
        .select('*', { count: 'exact' });

    if (error) {
        console.error(error);
    } else {
        console.log(`Total rows: ${count}`);
        dbObj.rows = count;
        drawButtons();
        initialView();
    }

}

function drawButtons() {
    let buttonCount = dbObj.rows / dbObj.range;

    const template = document.getElementById('user-card-template');
    const container = document.querySelector('.pagination');

    for (let i = 0; i < buttonCount; ++i) {

        // Access the template's content and create a deep clone
        const clone = template.content.cloneNode(true);

        // 3. Populate the clone's elements with data
        let theButtonElement = clone.querySelector('.btn-circle');
        theButtonElement.textContent = i + 1;
        theButtonElement.setAttribute('data-chunk', i + 1);

        // 4. Append the fully built clone into the live DOM
        container.appendChild(clone);

    }

}

function refreshView(e) {

    let maxRange = e.target.getAttribute("data-chunk") * dbObj.range;
    // maxRange = Math.min(dbObj.rows, maxRange);
    let minRange = maxRange - dbObj.range;

    clearContentElement();
    showLoader();
    getChunks(minRange, --maxRange);

}

function showLoader() {
    const container = document.querySelector('.content');
    let imgElement = document.createElement('img');
    imgElement.classList.add('loader');
    imgElement.src = './loader.svg';
    container.appendChild(imgElement);

}

function killLoader() {
    const container = document.querySelector('.content');
    let loader = container.querySelector('.loader');
    container.removeChild(loader);
    // loader.removeChild();
}

function initialView() {
    getChunks(0, dbObj.range - 1);
}

async function getChunks(from, to) {

    let result = await db.from(TABLE)
        .select('*')
        .order('id', { ascending: true })
        .range(from, to);

    let error = result.error;
    let data = result.data;

    if (error) {
        // update the UI, let the user know there's been a problem
        console.warn(error.message);
        killLoader();
        return;
    }

    if (!data || data.length == 0) {
        killLoader();
        return;
    }
    // window.debugData = data;

    const template = document.getElementById('passenger-card-template');
    const container = document.querySelector('.content');

    data.forEach(element => {

        const clone = template.content.cloneNode(true);

        let nameElement = clone.querySelector(".name");
        nameElement.textContent = element.name;

        let ageElement = clone.querySelector(".age");
        ageElement.textContent = element.age;

        let survivedElement = clone.querySelector(".survived");
        survivedElement.textContent = element.survived;

        let fareElement = clone.querySelector(".fare");
        fareElement.textContent = element.class;

        container.appendChild(clone);

    });
    killLoader();
    updateUICounter(from, to);

}

function clearContentElement() {
    const container = document.querySelector('.content');
    container.replaceChildren();
}

function updateUICounter(start, end) {
    const uiCounterElement = document.querySelector(".ui-counter");
    const from = uiCounterElement.querySelector(".from");
    const to = uiCounterElement.querySelector(".to");
    const ofElement = uiCounterElement.querySelector(".of");

    from.textContent = `${start + 1} `;
    to.textContent = `${end + 1} `;
    ofElement.textContent = `${dbObj.rows}`;

    // check for end
    if (end > dbObj.rows) {
        to.textContent = dbObj.rows;
    }
}
showLoader();
getMaxRows();
//
