import { filter } from "lodash";

const examples = ["one", "two"];
console.log(filter(examples, (e) => {
    return e === "one";
}));