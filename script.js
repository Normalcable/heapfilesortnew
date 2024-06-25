let speedMultiplier = 1;
let fileNames = [];
let elements = [];
let mode = 'fileNames';

function displayFileNames(fileNames) {
    const container = document.getElementById('file-names');
    container.classList.remove('placeholder');
    container.innerHTML = '';
    fileNames.forEach(name => {
        const div = document.createElement('div');
        div.className = 'file-name';
        div.textContent = name;
        container.appendChild(div);
    });
}

function displayElements(elements) {
    const container = document.getElementById('file-names');
    container.classList.remove('placeholder');
    container.innerHTML = '';
    elements.forEach(element => {
        const div = document.createElement('div');
        div.className = 'file-name';
        div.textContent = element;
        container.appendChild(div);
    });
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
    setTimeout(() => updateNarration("Click 'Start Visualization' to begin sorting."), 3000); // Hides the speed narration after 3 seconds
}

function changeMode(selectedMode) {
    mode = selectedMode;
    if (mode === 'fileNames') {
        document.getElementById('file-input').classList.remove('d-none');
        document.getElementById('elements').classList.add('d-none');
        document.getElementById('mode').classList.remove('d-none'); // Ensure mode select is visible
    } else {
        document.getElementById('file-input').classList.add('d-none');
        document.getElementById('elements').classList.remove('d-none');
        displayElementButtons();
    }
    
    // Hide the mode select when mode is not 'elements'
    if (mode !== 'elements') {
        document.getElementById('mode').classList.add('d-none');
    } else {
        document.getElementById('mode').classList.remove('d-none');
    }
    
    resetVisualization();
}


function displayElementButtons() {
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

async function heapify(arr, n, i, visualize) {
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
        await visualize(arr, i, largest);
        await heapify(arr, n, largest, visualize);
    }
}

async function heapSort(arr, visualize) {
    const n = arr.length;

    updateNarration(`Building max heap.`);
    await sleep(1000);

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i, visualize);
    }

    updateNarration(`Max heap built. Now sorting...`);
    await sleep(1000);

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        updateNarration(`Swapping the root with the last element (index ${i}).`);
        await visualize(arr, 0, i, true);
        await heapify(arr, i, 0, visualize);
    }

    updateNarration(`Sorting complete!`);
}

async function visualizeSorting(arr, index1, index2, isSorted = false) {
    const container = document.getElementById('file-names');
    const fileElements = container.children;

    fileElements[index1].classList.add('highlight');
    fileElements[index2].classList.add('highlight');

    await sleep(500);

    container.innerHTML = '';
    arr.forEach((name, index) => {
        const div = document.createElement('div');
        div.className = 'file-name';
        div.textContent = name;
        if (index === index1 || index === index2) {
            div.classList.add('highlight');
        }
        if (isSorted && index >= arr.length - index2) {
            div.classList.add('sorted');
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

function resetVisualization() {
    const container = document.getElementById('file-names');
    container.classList.add('placeholder');
    container.innerHTML = '<div class="placeholder-content text-center"><p>No files uploaded. Please select files to visualize the sorting process.</p></div>';
    fileNames = [];
    elements = [];
}

async function startVisualization() {
    if (mode === 'fileNames') {
        if (fileNames.length === 0) {
            updateNarration('No files to sort. Please upload files.');
            return;
        }
        displayFileNames(fileNames);
        await sleep(1000);
        await heapSort(fileNames, visualizeSorting);
    } else {
        if (elements.length === 0) {
            updateNarration('No elements to sort. Please select elements.');
            return;
        }
        displayElements(elements);
        await sleep(1000);
        await heapSort(elements, visualizeSorting);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateNarration(`Click "Start Visualization" to begin sorting.`);
});
