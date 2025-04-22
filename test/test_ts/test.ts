
// node --loader ts-node/esm .\test.ts

type AAA = {
  aaa: string;
  bbb: string;
  ccc: string;
}

type A = keyof AAA;
type B = keyof AAA;


function test<T, K extends keyof AAA>(bruh1: T, bruh2: K) {
  console.log("pass");
}

const bruh = {
  aaa: "213"
}
test(bruh);


