export const preload_particle = {
  x: 400,
  y: 300,
  speed: 200,
  lifespan: 3000,
  blendMode: 'ADD',
  quantity: 1.2,
  tint: 0X00FFFF,
  scale: {start: 2, end: 1},
  alpha: {start: 1, end: 0}
}

export const star_particle = {
  speed: 300,
  lifespan: 300,
  blendMode: 'ADD',
  scale: {start: 1, end: 0},
  alpha: {start: 1, end: 0},
  on: false
}

export const bomb_particle = {
  speed: 100,
  lifespan: 600,
  blendMode: 'ADD',
  tint: 0XFF0000,
  scale: {start: 2, end: 0},
  alpha: {start: 1, end: 0},
  on: false
}