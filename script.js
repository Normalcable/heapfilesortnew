let speedMultiplier = 1;
let fileNames = [];
let elements = [];
let mode = 'fileNames';
let isSorting = false;

function displayFileNames(fileNames) {
    const container = document.getElementById('file-names');
    container.innerHTML = ''; // Clear previous content

    if (fileNames.length === 0) {
        container.classList.add('placeholder');
        container.innerHTML = `
            <div class="placeholder-content text-center">
                <p>No files uploaded. Please select files to visualize the sorting process.</p>
            </div>
        `;
    } else {
        container.classList.remove('placeholder');
        fileNames.forEach(name => {
            const div = document.createElement('div');
            div.className = 'file-name';
            div.textContent = name;
            container.appendChild(div);
        });
    }
}

function displayElements(elements) {
    const container = document.getElementById('selected-elements');
    container.innerHTML = ''; // Clear previous content
    elements.forEach(element => {
        const div = document.createElement('div');
        div.className = 'file-name mx-2';
        div.textContent = element;
        container.appendChild(div);
    });
    container.classList.remove('d-none');
}

function displayElementButtons() {
    console.log("Displaying element buttons...");
    const container = document.getElementById('element-buttons');
    container.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
        const button = document.createElement('button');
        button.className = 'btn btn-secondary m-1';
        button.textContent = i;
        button.onclick = () => addElement(i);
        container.appendChild(button);
    }
}

function addElement(element) {
    elements.push(element);
    displayElements(elements);
}

function updateNarration(text) {
    const narration = document.getElementById('narration');
    narration.textContent = text;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms / speedMultiplier));
}

function changeSpeed(multiplier) {
    speedMultiplier = multiplier;
    updateNarration(`Speed: ${multiplier}x`);
    setTimeout(() => updateNarration("Click 'Start Visualization' to begin sorting."), 3000);
}

function changeMode(selectedMode) {
    if (isSorting) return;

    mode = selectedMode;

    if (mode === 'fileNames') {
        window.location.href = 'index.html'; // Redirect to index.html for fileNames mode
    } else if (mode === 'elements') {
        window.location.href = 'elements.html'; // Redirect to elements.html for elements mode
    }
}

async function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    updateNarration(`Heapifying sub-tree rooted at index ${i}.`);
    await sleep(1000);

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        updateNarration(`Swapping elements at index ${i} and ${largest}.`);
        await visualizeSorting(arr, i, largest);
        await heapify(arr, n, largest);
    }
}

async function heapSort(arr) {
    const n = arr.length;

    updateNarration(`Building max heap.`);
    await sleep(1000);

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
    }

    updateNarration(`Max heap built. Now sorting...`);
    await sleep(1000);

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        updateNarration(`Swapping the root with the last element (index ${i}).`);
        await visualizeSorting(arr, 0, i);
        await heapify(arr, i, 0);
    }

    updateNarration(`Sorting complete!`);
}

async function visualizeSorting(arr, index1, index2) {
    const container = document.getElementById('selected-elements');
    const fileElements = container.children;

    fileElements[index1]?.classList.add('highlight');
    fileElements[index2]?.classList.add('highlight');

    await sleep(500);

    container.innerHTML = '';
    arr.forEach((element, index) => {
        const div = document.createElement('div');
        div.className = 'file-name';
        div.textContent = element;
        if (index === index1 || index === index2) {
            div.classList.add('highlight');
        }
        container.appendChild(div);
    });

    await sleep(500);

    fileElements[index1]?.classList.remove('highlight');
    fileElements[index2]?.classList.remove('highlight');
}

function handleFileUpload(event) {
    const files = event.target.files;
    fileNames = Array.from(files).map(file => file.name);
    displayFileNames(fileNames);
}

function removeAllItems() {
    if (isSorting) return;

    elements = [];
    displayElements(elements);
    updateNarration("All items removed.");
}

async function startVisualization() {
    if (isSorting) return;

    isSorting = true;
    disableControls(true);

    if (mode === 'fileNames') {
        if (fileNames.length === 0) {
            updateNarration('No files to sort. Please upload files.');
            isSorting = false;
            disableControls(false);
            return;
        }
        displayFileNames(fileNames);
        await sleep(1000);
        await heapSort(fileNames);
    } else {
        if (elements.length === 0) {
            updateNarration('No elements to sort. Please select elements.');
            isSorting = false;
            disableControls(false);
            return;
        }
        displayElements(elements);
        await sleep(1000);
        await heapSort(elements);
    }

    isSorting = false;
    disableControls(false);
}

function disableControls(disabled) {
    const controls = document.getElementById('controls').querySelectorAll('button, select:not(#speed)');
    controls.forEach(control => {
        control.disabled = disabled;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html')) {
        mode = 'fileNames';
        updateNarration(`Click "Start Visualization" to begin sorting.`);
        displayFileNames(fileNames);  // Ensure placeholder is displayed on page load
    } else if (window.location.pathname.includes('elements.html')) {
        mode = 'elements';
        updateNarration(`Click "Start Visualization" to begin sorting.`);
        displayElementButtons();  // Display buttons 1-9 for selecting elements
        displayElements(elements);  // Display any initially selected elements
    }
});
