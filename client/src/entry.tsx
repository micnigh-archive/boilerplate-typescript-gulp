import * as HelloWorld from "./component/HelloWorld";

console.log("entry imported");
console.log(HelloWorld.default);
document.getElementById("content").innerHTML = HelloWorld.default;

export default "something something";
