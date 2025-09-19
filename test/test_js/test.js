import merge from 'lodash'

let a = {
    '1': 1,
    '2': 2
}

let b = {
    '3': 3,
    '4': 4,
}

console.log(merge(a, b))