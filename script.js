document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove focus from the button after a small delay to ensure the click is processed
            setTimeout(() => button.blur(), 100);
        });
    });
});

let speedMultiplier = 1;
let fileNames = [];
let isSorting = false;
let sortingCompleted = false;

function changeMode(selectedMode) {
    if (selectedMode === 'FileNames') {
        window.location.href = 'index.html';
    } else if (selectedMode === 'Elements') {
        window.location.href = 'elements.html';
    }
}

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
    sortingCompleted = true;
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

async function startVisualization() {
    if (fileNames.length === 0) {
        updateNarration('No files to sort. Please upload files.');
        setTimeout(() => updateNarration('Click "Start Visualization" to begin sorting.'), 2000);
        return;
    }

    if (sortingCompleted) {
        updateNarration('Sorting already completed. Refresh or upload new files to sort again.');
        return;
    }

    disableControls(true);
    displayFileNames(fileNames);
    
    await sleep(1000);
    await heapSort(fileNames, visualizeSorting);
    
    disableControls(false);

    const startButton = document.getElementById('start-visualization-btn');
    startButton.disabled = true;
}

function disableControls(disabled) {
    const controlsToDisable = document.getElementById('controls').querySelectorAll('button, select:not(#speed)');
    controlsToDisable.forEach(control => {
        control.disabled = disabled;
        if (disabled) {
            control.classList.add('disabled');
        } else {
            control.classList.remove('disabled');
        }
    });
}

function removeAllItems() {
    if (isSorting) return; // Prevent removal while sorting is in progress

    fileNames = []; // Clear the fileNames array
    sortingCompleted = false; // Reset the sortingCompleted flag

    // Reset UI to initial state
    const container = document.getElementById('file-names');
    container.classList.add('placeholder');
    container.innerHTML = `
        <div class="placeholder-content text-center">
            <p>No files uploaded. Please select files to visualize the sorting process.</p>
        </div>
    `;

    // Temporary narration
    updateNarration('All items removed.');

    // Clear temporary narration after 2 seconds
    setTimeout(() => {
        updateNarration('Click "Start Visualization" to begin sorting.');
    }, 2000); // 2000 milliseconds = 2 seconds

    // Re-enable the start visualization button
    const startButton = document.getElementById('start-visualization-btn');
    startButton.disabled = false;
}
