const generateLetter = letters => {
    // const letters = ' abcdefghijklmnopqrstuvwxyz';
    let index = floorRandom(letters.length);
    let letter = letters[index];
    return letter;
};
const random = (minN, maxN) => {
    let min, max;
    if(!maxN) {
        min = 0;
        max = minN;
    } else {
        min = minN;
        max = maxN;
    }
    return min + Math.random() * (max - min);
};
const floorRandom = (min, max) => {
    return Math.floor(random(min, max));
};

const sleep = ms => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};