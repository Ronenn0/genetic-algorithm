let populations = [], frameRate = 20
    , counter = 0, dotsCounter = 0
    , fitnessSum = 0, averageFitness
    , genNumber = 1
    , pAmount = 20
    , mutationRate = 0.01, showMutRate = mutationRate + '%'
    , target = 'to be or not to be that is the question'
    , letters = [], mainLetters = 'abcdefghijklm nopqrstuvwxyz';
const container = document.querySelector('#container')
    , displayContainer = container.querySelector('#displayContainer')
    , foundStatus = container.querySelector('#found #foundStatus')
    , bestPhrase = container.querySelector('#best #bestPhrase')
    , targetPhrase = container.querySelector('#current #targetPhrase');
let /*rightPopulation*/findAll = false
        , originalFoundTextContent = foundStatus.textContent;
target = '';
// mainLetters = '';
let best = {};
const resetBest = () => {
    best = {
        fitness: -1
        , phrase: ''
    }
};
const calcMutation = () => {
    const minMutationRate = 0.006;
    let lengthBase = mainLetters.length * 4;
    let amountBase = pAmount * 0.32;
    let rate = 1 / (lengthBase + amountBase);
    if(rate < minMutationRate) {
        rate = minMutationRate;
    }
    return rate;
    // return 0.01;
}

const setup = () => {
    showMutRate = shownMutationRate();
    resetBest();
    const frameSpan = container.querySelector('#frames #frameRate');
    frameSpan.textContent = frameRate + 'ms';
    if(target.length == 0) {
        return;
    }
    foundStatus.textContent = 'in progress';
    targetPhrase.textContent = target;
    // rightPopulation = new Population(target, true);
    // rightPopulation.DNA = '';
    // for(let i = 0; i < target.length; i++) {
    //     rightPopulation.DNA += '!';
    // }
    // for(let i = 0; i < mainLetters.length; i++) {
    //     letters.push(mainLetters.charAt(i));
    // }
    letters = mainLetters;
    let fontSize = 200 / pAmount;
    const minSize = 13, maxSize = 18;
    if(fontSize < minSize) {
        fontSize = minSize;
    }
    else if(fontSize > maxSize) {
        fontSize = maxSize;
    }
    for(let i = 0; i < pAmount; i++) {
        let p = new Population(target);
        p.fitnessArrangement = fitnessSum;
        populations.push(p);
        let span = document.createElement('span');
        span.textContent = p.DNA;
        span.style.fontSize = fontSize + 'px';
        displayContainer.appendChild(span);
    }
};

const draw = async() => {
    if(target.length == 0 || mainLetters.length == 0) {
        return;
    }
    updateStatusDots();
    // let matingPool = [];
    // for(let i = 0; i < populations.length; i++) {
    //     let p = populations[i];
    //     let fitness = p.fitness;
    //     if(p.DNA == p.target) {
    //         counter++;
    //     }
    //     for(let j = 0; j < fitness; j++) {
    //         matingPool.push(p);
    //     }
    // }
    // console.log(fitnessSum);
    let children = [];
    let newFitnessSum = 0;
    for(let i = 0; i < populations.length; i++) {
        // let index1 = floorRandom(matingPool.length);
        // let index2 = floorRandom(matingPool.length);
        // let popA = matingPool[index1];
        // let popB = matingPool[index2];
        let popA = pickOne(populations);
        let popB = pickOne(populations);
        let newDNA = '';
        let n = floorRandom(populations.length);
        for(let j = 0; j < target.length; j++) {
            if(Math.random() < mutationRate) {
                newDNA+= generateLetter(letters);
                continue;
            }
            if(j < n) {
                newDNA+= popA.DNA.charAt(j);
            } else {
                newDNA+= popB.DNA.charAt(j);
            }
        }
        let newP = new Population(target, true);
        newP.setDNA(newDNA);
        if(newP.fitness > best.fitness) {
            best.fitness = newP.fitness;
            // bestPhrase.textContent = newP.DNA;
            best.phrase = newP.DNA;
        }
        newFitnessSum+= newP.fitness;
        newP.fitnessArrangement = newFitnessSum;
        // console.log(newP.fitness);
        children.push(newP);
        // fitnessSum-= populations[i].fitness;
        // fitnessSum+= newP.fitness;
        // populations[i] = newP;
    }
    populations = children;
    fitnessSum = newFitnessSum;
    bestPhrase.textContent = best.phrase;

    show();
    const c = 'blue', foundStatement = 'found';
    if(findAll) {
        const FOUNDCOMPLETLY = 2;
        let foundStat = foundCompletly();
        if(foundStat > 0) {
            // console.log('----found');
            foundStatus.style.color = c;
            if(foundStat == FOUNDCOMPLETLY) {
                foundStatus.textContent = 'Completly found';
                return;
            } else {
                foundStatus.textContent = foundStatement;
                dotsCounter = 0;
            }
        }
    } else {
        if(best.phrase == target) {
            foundStatus.style.color = c;
            foundStatus.textContent = foundStatement;
            return;
        }
    }
    
    counter = 0;
    genNumber++;
    await sleep(frameRate);
    draw();
};
const shownMutationRate = () => {
    const lengthAfterPoint = 3;
    let s = (mutationRate * 100).toString();
    let i, j = 0, approx = '';
    for(i = 0; i < s.length; i++) {
        let current = s[i];
        approx+= current;
        if(current == '.') {
            i++;
            while(j < lengthAfterPoint && i < s.length) {
                approx+= s[i];
                j++;
                i++;
            }
            break;
        }
    }
    shownMutRate = approx + '%';
};
const showData = () => {
    const data = container.querySelector('#data');
    const genNumberSpan = data.querySelector('#generation #generationNumber');
    const popsAmount = data.querySelector('#populations #populationsAmount')
    const fitnessAverage = data.querySelector('#fitness #fitnessAverage');
    const mutationRateSpan = data.querySelector('#mutation #mutationRate');
    genNumberSpan.textContent = genNumber;
    popsAmount.textContent = pAmount;
    fitnessAverage.textContent = averageFitness;
    mutationRateSpan.textContent = shownMutRate;
};
const show = () => {
    const spans = displayContainer.querySelectorAll('span');
    // console.log(populations.length);
    let scoresSum = 0;
    populations.forEach((p, index) => {
        spans[index].textContent = '"' + p.DNA + '".';
        // console.log(index);
        scoresSum+= p.score;
    });
    let maxFitness = target.length * pAmount;
    averageFitness = Math.floor(scoresSum / maxFitness * 100) + '%';
    // averageFitness = Math.floor(fitnessSum / maxFitness * 100) + '%';
    showData();
};

const foundCompletly = () => {
    let counter = 0;
    for(let i = 0; i < populations.length; i++) {
        let p = populations[i];
        if(p.DNA == p.target) {
            counter++;
        }
    }
    if(counter != populations.length) {
        if(counter <= 1) {
            return counter;
        } else{
            return 1;
        }
    } else {
        return 2; // COMPLETLY FOUND
    }
};

const updateStatusDots = () => {
    const maxDots = 3, updatingRate = 5;
    if(genNumber % updatingRate != 0) {
        return;
    }
    if(dotsCounter >= maxDots) {
        let status = foundStatus.textContent;
        let c = 0;
        while(c < dotsCounter) {
            status = foundStatus.textContent;
            foundStatus.textContent = status.substring(0, status.length - 1);
            c++;
        }
        dotsCounter = 0;
        // foundStatus.textContent = status.substring(0, status.length - maxDots);
    } else {
        foundStatus.textContent+= '.';
        dotsCounter++;
    }
};

const createEventListeners = () => {
    const redPink = '#fd7575';
    const getChild = (query, parent) => {
        return parent.querySelector(query);
    };
    const helpButton = getChild('#newGenerationMaker #help button', container);
    helpButton.addEventListener('click', () => {
        alert('Target string is the string you want the program to search for and find.  Amount is the amount of DNAs to use - atleast 2.  MutationRate is a percent and is between 0 and 1.')
    });
    
    const generationMaker = getChild('#newgenerationMaker', container);

    // targetInput.addEventListener('input', () => {});
    // targetInput.addEventListener('focusout', ()=> {
    //     if(targetInput.wrong) {
    //         targetInput.errorAlert();
    //     }
    // });

    const amountInput = getChild('#pAmount', generationMaker);
    const amountMin = 2, amountMax = Infinity;
    const numberValidation = (input, min, max) => {
        let value = Number(input.value);
        if(value < min) {
            input.value = min;
        } else if(value > max) {
            input.value = max;
        }
    }
    amountInput.addEventListener('input', () => {
        if(amountInput.value.length == 0) {
            return;
        }
        if(Number(amountInput.value) > amountMax) {
            amountInput.textContent = amountMax;
        }
    });
    amountInput.addEventListener('focusout', () => {
        // numberValidation(amountInput, amountMin, amountMax);
        numberValidation(amountInput, amountMin, amountMax);
        if(amountInput.value.length > 0) {
            amountInput.value = Math.round(amountInput.value);
        }
    });
    
    const mutationInput = getChild('#mutationRate', generationMaker);
    const mutationMin = 0, mutationMax = 1;
    mutationInput.addEventListener('input', () => {
        if(mutationInput.value.length == 0) {
            return;
        }
        numberValidation(mutationInput, mutationMin, mutationMax);
    });
    mutationInput.addEventListener('focusout', () => {
        numberValidation(mutationInput, mutationMin, mutationMax);
        // if(mutationInput.value.length == 0) {
        //     mutationInput.value = 0;
        // }
    });

    const checkboxes = generationMaker.querySelectorAll('#checkboxes input[type="checkbox"]');
    const otherLettersCheckBox = checkboxes[checkboxes.length - 1];
    const otherLettersInput = getChild('#otherLetters', generationMaker);
    otherLettersCheckBox.addEventListener('change', () => {
        let isChecked = otherLettersCheckBox.checked;
        // otherLettersInput.classList.toggle('visible-element');
        let display = isChecked? 'block' : 'none';
        otherLettersInput.style.display = display;
    });
    
    
    const startNew = getChild('#generationMakerButton', generationMaker);
    startNew.addEventListener('click', () => {
        const targetInput = getChild('#target', generationMaker);
        if(targetInput.value.length > 0) {
            target = targetInput.value;
        }
        if(amountInput.value.length > 0) {
            pAmount = Number(amountInput.value);
        }

        let newLetters = '', duplicatedLetters = '';
        const addLetters = additional => {
            for(let j = 0; j < additional.length; j++) {
                let letter = additional.charAt(j);
                if(duplicatedLetters.includes(letter)) {
                    continue;
                } else if(newLetters.includes(letter)) {
                    duplicatedLetters+= letter;
                    continue;
                }
                newLetters+= letter;
            }
        }
        for(let i = 0; i < checkboxes.length - 1; i++) {
            let current = checkboxes[i];
            if(current.checked) {
                let additional = '';
                if(i == 4) {
                    additional+= '"';
                }
                additional+= current.value;
                addLetters(additional);
            }
        }
        if(otherLettersCheckBox.checked) {
            addLetters(otherLettersInput.value);
        }
        if(duplicatedLetters.length > 0) {
            alert('Unnecessary (duplicated) letters were removed >> ' + duplicatedLetters);
        }
        // if(newLetters.length != 0) {
        //     mainLetters = newLetters;
        // } else {
        //     mainLetters = 'abcdefghijklm nopqrstuvwxyz';
        // }
        mainLetters = newLetters;
        if(mutationInput.value.length > 0) {
            mutationRate = Number(mutationInput.value);
        } else {
            mutationRate = calcMutation();
        }
        const usedLetters = getChild('#letters #usedLetters', container);

        const targetInputValidation = () => {
            // targetInput.errorAlert = () => {
            //     let l = 'letter' + (targetInput.unacceptableLetters.length > 1? 's' : '');
            //     let error = 'Unacceptable ' + l + ' detected: "' + targetInput.unacceptableLetters+ '".    Acceptable letters in the target string are: "' + mainLetters + '"';
            //     alert(error);
            // };
            // let text = targetInput.value;
            // targetInput.unacceptableLetters = '';
            // for(let i = 0; i < text.length; i++) {
            //     let char = text.charAt(i);
            //     if(!mainLetters.includes(char)) {
            //         targetInput.style.borderColor = redPink;
            //         targetInput.style.outlineColor = 'transparent';
            //         targetInput.wrong = true;
            //         targetInput.unacceptableLetters+= text.charAt(i);
            //     }
            // }
            // if(!targetInput.wrong) {
            //     targetInput.style.borderColor = 'unset';
            //     targetInput.style.outlineColor = 'blue';
            //     targetInput.wrong = false;
            // }
            // let selfText = targetInput.value;
            let selfText = target;
            let neededLetters = '';
            let seen = '';
            for(let i = 0; i < selfText.length;i++) {
                let char = selfText.charAt(i);
                if(!seen.includes(char)) {
                    if(!mainLetters.includes(char)) {
                        neededLetters+= char;
                    }
                    seen+= char;
                }
            }
            mainLetters+= neededLetters;
            if((neededLetters.length > 0 && neededLetters != usedLetters.textContent)
                 || usedLetters.textContent.length == 0) {
                const neededString = 'Not considered and needed letters were added >> "' + neededLetters + '".   ';
                const mainLettersString = 'All letters >> "' + mainLetters + '".';
                const fullString = neededString + mainLettersString;
                alert(fullString);
            }
        };
        targetInputValidation();
        // if(targetInput.wrong) {
        //     targetInput.errorAlert();
        //     return;
        // }

        usedLetters.textContent = mainLetters;
        populations = [];
        letters = [];
        genNumber = 1;
        displayContainer.innerHTML = '';
        foundStatus.textContent = originalFoundTextContent;
        foundStatus.style.color = 'var(--inProgress)';
        dotsCounter = 0;
        counter = 0;
        showData();
        setup();
        draw();
    });
};
const calcFitness = score => {
    return Math.pow(score, power);
};

const pickOne = pArray => {
    let r = random(fitnessSum);
    // console.log('random: ' + r);
    for(let i = 0; i < pArray.length; i++) {
        let p = pArray[i];
        if(r <= p.fitnessArrangement) {
            return p;
        }
    }
    // let index = 0;
    // let r = Math.random();
    // while(r > 0) {
    //     let percent = pArray[index].fitness / fitnessSum;
    //     r-= percent;
    //     index++;
    // }
    // index--;
    // return pArray[index];
}
// const pickOneAlt = pArray => {
//     let times = 0;
//     while(times < 10) {
//         let random = pArray[floorRandom(pArray.length)];
//         let percent = random.fitness / fitnessSum;
//         if(Math.random() <= percent) {
//             return random;
//         }
//         times++;
//     }
//     console.log('ALTERNATIVE UESD');
//     return pickOneAlt(pArray);
// };

/*----------------------*/
const sketch = () => {
    setup();
    draw();
    createEventListeners();
};
sketch();
/*----------------------*/

