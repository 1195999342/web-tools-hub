export type Cell = { top: boolean; right: boolean; bottom: boolean; left: boolean; visited: boolean };

export function generateMaze(width: number, height: number): Cell[][] {
  const grid: Cell[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ top: true, right: true, bottom: true, left: true, visited: false }))
  );

  // DFS maze generation
  const stack: [number, number][] = [];
  const startR = 0, startC = 0;
  grid[startR][startC].visited = true;
  stack.push([startR, startC]);

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];
    const neighbors: [number, number, string, string][] = [];
    if (r > 0 && !grid[r - 1][c].visited) neighbors.push([r - 1, c, 'top', 'bottom']);
    if (r < height - 1 && !grid[r + 1][c].visited) neighbors.push([r + 1, c, 'bottom', 'top']);
    if (c > 0 && !grid[r][c - 1].visited) neighbors.push([r, c - 1, 'left', 'right']);
    if (c < width - 1 && !grid[r][c + 1].visited) neighbors.push([r, c + 1, 'right', 'left']);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const [nr, nc, wall, opposite] = neighbors[Math.floor(Math.random() * neighbors.length)];
      (grid[r][c] as any)[wall] = false;
      (grid[nr][nc] as any)[opposite] = false;
      grid[nr][nc].visited = true;
      stack.push([nr, nc]);
    }
  }
  return grid;
}

export function solveMaze(grid: Cell[][], width: number, height: number): [number, number][] {
  const visited = Array.from({ length: height }, () => Array(width).fill(false));
  const path: [number, number][] = [];

  function dfs(r: number, c: number): boolean {
    if (r === height - 1 && c === width - 1) { path.push([r, c]); return true; }
    visited[r][c] = true;
    path.push([r, c]);
    const cell = grid[r][c];
    const dirs: [number, number, keyof Cell][] = [[-1, 0, 'top'], [1, 0, 'bottom'], [0, -1, 'left'], [0, 1, 'right']];
    for (const [dr, dc, wall] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < height && nc >= 0 && nc < width && !visited[nr][nc] && !cell[wall]) {
        if (dfs(nr, nc)) return true;
      }
    }
    path.pop();
    return false;
  }
  dfs(0, 0);
  return path;
}
