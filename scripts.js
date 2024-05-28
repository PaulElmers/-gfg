document.addEventListener('DOMContentLoaded', () => {
    loadColors();
});

function saveColor() {
    const colorName = document.getElementById('color-name').value.trim();
    const colorType = document.getElementById('color-type').value;
    const colorCode = document.getElementById('color-code').value.trim();

    const errorMessages = [];
    if (!/^[a-zA-Z]+$/.test(colorName)) {
        errorMessages.push("Color name should only contain letters.");
    }

    const colors = getColorsFromCookies();
    if (colors.some(color => color.name.toLowerCase() === colorName.toLowerCase())) {
        errorMessages.push("Color name must be unique.");
    }

    let colorValue;
    if (colorType === 'RGB' && /^(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})$/.test(colorCode)) {
        const rgbValues = colorCode.split(',').map(Number);
        if (rgbValues.every(value => value >= 0 && value <= 255)) {
            colorValue = `rgb(${rgbValues.join(',')})`;
        } else {
            errorMessages.push("RGB values must be between 0 and 255.");
        }
    } else if (colorType === 'RGBA' && /^(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0|0\.\d+|1)$/.test(colorCode)) {
        const rgbaValues = colorCode.split(',').map((value, index) => index < 3 ? Number(value) : parseFloat(value));
        if (rgbaValues.slice(0, 3).every(value => value >= 0 && value <= 255) && rgbaValues[3] >= 0 && rgbaValues[3] <= 1) {
            colorValue = `rgba(${rgbaValues.join(',')})`;
        } else {
            errorMessages.push("RGBA values must be between 0 and 255 for RGB and 0 to 1 for alpha.");
        }
    } else if (colorType === 'HEX' && /^#[0-9A-Fa-f]{6}$/.test(colorCode)) {
        colorValue = colorCode;
    } else {
        errorMessages.push(`Invalid ${colorType} color code.`);
    }

    if (errorMessages.length > 0) {
        document.getElementById('error-messages').innerText = errorMessages.join('\n');
        return;
    }

    const newColor = { name: colorName, type: colorType, code: colorValue };
    colors.push(newColor);
    setColorsToCookies(colors);
    displayColor(newColor);
    document.getElementById('color-form').reset();
    document.getElementById('error-messages').innerText = '';
}

function displayColor(color) {
    const colorPalette = document.getElementById('color-palette');
    const colorBlock = document.createElement('div');
    colorBlock.className = 'color-block';
    colorBlock.style.backgroundColor = color.code;
    colorBlock.innerText = color.name;
    colorPalette.appendChild(colorBlock);
}

function loadColors() {
    const colors = getColorsFromCookies();
    colors.forEach(color => displayColor(color));
}

function getColorsFromCookies() {
    const cookies = document.cookie.split('; ');
    const colorCookie = cookies.find(cookie => cookie.startsWith('colors='));
    if (colorCookie) {
        return JSON.parse(decodeURIComponent(colorCookie.split('=')[1]));
    }
    return [];
}

function setColorsToCookies(colors) {
    const date = new Date();
    date.setHours(date.getHours() + 3);
    document.cookie = `colors=${encodeURIComponent(JSON.stringify(colors))}; expires=${date.toUTCString()}; path=/`;
}
