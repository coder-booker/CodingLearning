
// node --loader ts-node/esm .\test.ts

type AAA = {
  id: string;
  name: string;
  uid: number;
};
type BBB = Omit<AAA, "name" | "uid">; // {id: string}


function temp(x: BBB) {
  console.log(x)
}

const bruh = {
  id: "123123", 
  name: "123123",
  uid: "123123"
};
temp(bruh)


