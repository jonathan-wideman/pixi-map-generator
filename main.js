import { Application, Sprite, Assets, Graphics, Texture } from "pixi.js";
import Delaunator from "delaunator";
import {
  forEachTriangleEdge,
  forEachVoronoiCell,
  forEachVoronoiEdge,
} from "./triangles";
import {
  bgColor,
  traingleEdgeColor,
  pointColor,
  voronoiEdgeColor,
  randomHexColor,
  randomHexShade,
  randomCellShade,
  getCellShade,
} from "./colors";
import { createNoise2D } from "simplex-noise";

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new Application();

// Wait for the Renderer to be available
// await app.init();
await app.init({ resizeTo: window });
// await app.init({ background: "#1c1917", resizeTo: window });

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.canvas);

// Create the background sprite with a basic white texture
let bg = new Sprite(Texture.WHITE);
// Set it to fill the screen
bg.width = app.screen.width;
bg.height = app.screen.height;
// Tint it to whatever color you want, here red
bg.tint = bgColor;
app.stage.addChild(bg);

const POINT_SPACING = 20;
const POINT_RADIUS = 2;
const GRID_OFFSET = POINT_SPACING / 2;
// const GRID_OFFSET = 20;
// const GRID_SIZE = { x: 80, y: 45 };
const GRID_SIZE = { X: 48, Y: 36 };

const MAP_BOUNDS = {
  X: { MIN: 0, MAX: GRID_SIZE.X * POINT_SPACING },
  Y: { MIN: 0, MAX: GRID_SIZE.Y * POINT_SPACING },
};

const isInBounds = (point) => {
  return (
    point[0] >= MAP_BOUNDS.X.MIN &&
    point[0] <= MAP_BOUNDS.X.MAX &&
    point[1] >= MAP_BOUNDS.Y.MIN &&
    point[1] <= MAP_BOUNDS.Y.MAX
  );
};

function random(min, max) {
  return Math.random() * (max - min) + min;
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create a grid
function createGrid() {
  let points = [];
  const pointRandomOffset = POINT_SPACING / 2.8;
  const pointsGraphics = new Graphics();
  for (let row = 0; row < GRID_SIZE.Y; row++) {
    for (let col = 0; col < GRID_SIZE.X; col++) {
      const point = {
        x:
          col * POINT_SPACING +
          randomInt(-pointRandomOffset, pointRandomOffset),
        y:
          row * POINT_SPACING +
          randomInt(-pointRandomOffset, pointRandomOffset),
      };
      pointsGraphics
        .circle(GRID_OFFSET + point.x, GRID_OFFSET + point.y, POINT_RADIUS)
        .fill(pointColor);
      points.push({ ...point, graphics: pointsGraphics });
    }
  }

  const coords = points.map((p) => [p.x, p.y]);
  const delaunay = Delaunator.from(coords);

  // const edgesGraphics = new Graphics();
  // forEachTriangleEdge(coords, delaunay, (e, p, q) => {
  //   edgesGraphics
  //     .moveTo(GRID_OFFSET + p[0], GRID_OFFSET + p[1])
  //     .lineTo(GRID_OFFSET + q[0], GRID_OFFSET + q[1])
  //     .stroke({ width: 1, color: traingleEdgeColor });
  // });

  // forEachVoronoiEdge(coords, delaunay, (e, p, q) => {
  //   // if (!isInBounds(p) || !isInBounds(q)) return;
  //   edgesGraphics
  //     .moveTo(GRID_OFFSET + p[0], GRID_OFFSET + p[1])
  //     .lineTo(GRID_OFFSET + q[0], GRID_OFFSET + q[1])
  //     .stroke({ width: 1, color: voronoiEdgeColor });
  // });

  const noise2D = createNoise2D();
  forEachVoronoiCell(coords, delaunay, (p, vertices, point) => {
    // console.log("forEachVoronoiCell callback vertices", vertices);
    if (vertices.length < 3) {
      return;
    }
    const cellsGraphics = new Graphics();

    for (let i = 0; i < vertices.length; i++) {
      const q = vertices[i];
      if (i === 0) {
        cellsGraphics.moveTo(GRID_OFFSET + q[0], GRID_OFFSET + q[1]);
      } else {
        cellsGraphics.lineTo(GRID_OFFSET + q[0], GRID_OFFSET + q[1]);
      }
    }
    const noiseScale = 0.002;
    const noiseValue = noise2D(point[0] * noiseScale, point[1] * noiseScale);
    console.log(noiseValue);
    // cellsGraphics.fill(randomCellShade());
    cellsGraphics.fill(getCellShade(noiseValue));

    app.stage.addChild(cellsGraphics);

    // cellsGraphics.moveTo(GRID_OFFSET + p[0], GRID_OFFSET + p[1]);
    // for (const q of vertices) {
    //   cellsGraphics.lineTo(GRID_OFFSET + q[0], GRID_OFFSET + q[1]);
    // }
    // cellsGraphics.fill(voronoiEdgeColor);
    // .stroke({ width: 1, color: voronoiEdgeColor });
  });

  // app.stage.addChild(edgesGraphics);
  app.stage.addChild(pointsGraphics);
}

function clearStage() {
  if (app.stage.children.length > 1) {
    app.stage.removeChildren(1, app.stage.children.length - 1);
  }
}

app.stage.interactive = true;
app.stage.on("pointerdown", () => {
  clearStage();
  createGrid();
});
