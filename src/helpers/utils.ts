type CallbackFunction = Function;

export function loadJSON(path: string, callback: CallbackFunction) {
    const xObj = new XMLHttpRequest();
    xObj.overrideMimeType("application/json");
    xObj.open('GET', path, true);
    xObj.onreadystatechange = function () {
        if (xObj.readyState === 4 && xObj.status === 200) {
            // 2. call your callback function
            callback(xObj.responseText);
        }
    };
    xObj.send(null);
}