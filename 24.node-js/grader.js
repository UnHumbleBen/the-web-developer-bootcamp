// Returns the rounded average of the scores in the array @scores.
function average(scores) {
    var total = 0;
    scores.forEach(function(scores) {
        total += scores;
    });
    return Math.round(total / scores.length);
}

console.log("Average score for enviornmental science");
var scores = [90, 98, 89, 100, 100, 86, 94];
console.log(average(scores));

console.log("Average score for organic chemistry"); 
var scores2 = [40, 65, 77, 82, 80, 54, 73, 63, 95, 49];
console.log(average(scores2));