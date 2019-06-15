//import './main.css'

console.log('axiba');

const compose = (...fns) => (args) => fns.reduce((prev, next) => next(prev), args)

console.log($('div'));