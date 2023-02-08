

const NoFiltrLogic = (arr) => {
    if(arr.length === 0) return false;

    // check what value in array appears most often. if more than 1 value appears most often, return the letter that appears first in the alphabet
    let obj = {};
    let max = 0;
    let maxKey = '';
    for(let i = 0; i < arr.length; i++) {
        if(obj[arr[i]]) {
            obj[arr[i]]++;
        } else {
            obj[arr[i]] = 1;
        }
        if(obj[arr[i]] > max) {
            max = obj[arr[i]];
            maxKey = arr[i];
        }
    }

    // sort obj by key and value
    let sortable = [];
    for(let key in obj) {
        sortable.push([key, obj[key]]);
    }
    sortable.sort((a, b) => {
        return b[1] - a[1] || a[0].localeCompare(b[0]);
    });

    maxKey = sortable[0]
    return maxKey[0];
}

module.exports = NoFiltrLogic;