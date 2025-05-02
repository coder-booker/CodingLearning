// cd ./test\test_ts
// node --loader ts-node/esm .\test.ts

function useRequest(url: string, {auto}: {auto: boolean}) {
  const [res, setRes] = useState();
  const action = () => {
    return fetch(url);
  }
  // useEffect(() => {
  if ( auto ) {
    action().then((value) => {
      setRes(value);
    })
  }
  // }, [])
  return {
    action, 
    res
  }
}
