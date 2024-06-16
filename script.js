let speedMultiplier = 1;
let fileNames = [];

function displayFileNames(fileNames) {
    const container = document.getElementById('file-names');
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
    setTimeout(() => updateNarration("Click 'Start Visualization' to begin sorting."), 3000); // Hides the speed narration after 3 seconds
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

async function startVisualization() {
    if (fileNames.length === 0) {
        updateNarration('No files to sort. Please upload files.');
        return;
    }
    displayFileNames(fileNames);
    
    await sleep(1000);
    await heapSort(fileNames, visualizeSorting);
}

document.addEventListener('DOMContentLoaded', () => {
    updateNarration(`Click "Start Visualization" to begin sorting.`);
});
