function solveNQueens(n: number): string[][] {
  // 在每一个能放置皇后的地方往下递归，直到回溯

  const result: string[][] = [];

  function isConflictTrack(x1: number, y1: number, track: number[]): boolean {
      for ( let qy = 0; qy < track.length; ++qy ) {
          if ( x1 === track[qy] || y1 === qy || Math.abs(x1-track[qy]) === Math.abs(y1-qy) ) return true;
      }
      return false;
  }

  function parseOneResult(track: number[]): string[] {
      const parsed: string[] = new Array();
      for ( let x of track ) {
          const row = new Array(n).fill(".");
          row[x] = "Q";
          parsed.push(row.join(""));
      }
      return parsed;
  }

  function backtrack(depth: number, track: number[]): void {
      if ( depth === n ) {
          result.push(parseOneResult(track));
          return;
      }
      
      // 剪枝：每一行都只会有一个皇后，所以我们其实可以把行的遍历交给回溯路径，列才在这里遍历
      for ( let x = 0; x < n; ++x ) {
          if ( isConflictTrack(x, depth, track) ) continue;
          track.push(x);
          backtrack(depth+1, track);
          track.pop();
      }
  }
  // 优化：track不需要保存二维数组，创建数组是很耗费性能的，用index和item两个信息就够了
  const track: number[] = []; // track保存已被放置的皇后的x y坐标，index为y，内容为x
  backtrack(0, track);
  return result;

};



// node --loader ts-node/esm .\test.ts