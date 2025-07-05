const power = 10;

class Population {
    constructor(target, justCreate) {
        this.target = target;
        if(justCreate) {
            return;
        }
        this.createSelf(letters);
        // this.calcFitness();
    }
    createSelf() {
        length = this.target.length;
        let d = '';
        let score = 0;
        for(let i = 0; i < length; i++) {
            let char = generateLetter(letters);
            if(char == this.target[i]) {
                score++;
                fitnessSum++;
            }
            d+= char;
        }
        // console.log(d);
        this.DNA = d;
        this.score = score;
        this.fitness = calcFitness(score);
        // this.fitnessArrangement = fitnessSum;
    }
    setDNA(newDNA) {
        this.DNA = newDNA;
        let score = 0;
        for(let i = 0; i < newDNA.length; i++) {
            let char = newDNA[i];
            if(char == this.target[i]) {
                score++;
                // fitnessSum++;
            }
        }
        this.score = score;
        this.fitness = calcFitness(score);
    }
    // calcFitness() {
    //     const t = this.target;
    //     let score = 0;
    //     for(let i = 0; i < t.length; i++) {
    //         let char = this.DNA.charAt(i);
    //         if(char == t.charAt(i)) {
    //             //rightPopulation.DNA = rightPopulation.DNA.substring(0, i) + char + rightPopulation.DNA.substring(i + 1);
    //             score++;
    //         }
    //     }
    //     // this.percent = score / t.length;
    //     // score+= Math.floor(this.percent / 0.1);
    //     this.fitness = score;

    //     // this.fitness = Math.pow(score, 2);
    // }
}