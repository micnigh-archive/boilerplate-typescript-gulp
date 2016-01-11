import * as HelloWorld from "./component/HelloWorld";

console.log("entry import");
console.log(HelloWorld.default);
document.getElementById("content").innerHTML = HelloWorld.default;

export default "something something";
