// made by cedar quattlebum & oliver burdick

// formula to find mean
function mean(data) {
    let count = data.length; // get length of list.
    let sum = 0; // set sum to 0 to start.

    data.forEach(val => { // iterate over the values of my data.
        sum += val; // add them to the sum.
    })

    let mean = sum / count; // formula to find mean.
    return mean; // returns the mean.
}


// function for median
function median(data) {
    // sort data to find the median
    data.sort((a, b) => a - b);
    let count = data.length; // get lenght of data.

    // if odd return middle num
    if (count % 2 != 0) {
        // gets middle number
        return data[Math.floor(count / 2)];
    } 
        else // if even return mean of the 2 middle nums
    {
        // middle number 1
        let middlenumberuno = data[count / 2 - 1];

        // middle number 2
        let middlenumberdos = data[count / 2];
        // find the mean of the middle numbers

        return (middlenumberuno + middlenumberdos) / 2;
    }
}

// formula for mode (was very complicated to figure out) :(
function mode(data) {
    // map to store frequncies of numbers
    let frequencyMap = {}

    data.forEach(val => {
        frequencyMap[val] = (frequencyMap[val] || 0) + 1; // count the frequncey of each number
    });

    let maxFrequency = Math.max(...Object.values(frequencyMap)); // find the max frequenaacaoee
    let modes = []; //empty list of modes... for now
    // collect all nums with highest frequencies
    for (let val in frequencyMap) {
        if (frequencyMap[val] === maxFrequency) {
            modes.push(Number(val));
        }
    }

    // if multiple modes, return all, else return single mode
    return modes.length === data.length ? [] : modes;
}