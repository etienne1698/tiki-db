export function pickRandom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function flipACoin(): boolean {
  return Math.random() > 0.5;
}