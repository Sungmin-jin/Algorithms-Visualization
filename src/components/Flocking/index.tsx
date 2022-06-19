import React from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
import Boid from './Boid';
import { useWindowDimensions } from '../../util';
import fish from '../../img/fish.svg';

const Flocking = () => {
  const { width, height } = useWindowDimensions();
  const boids: Boid[] = [];
  let image: p5Types.Image;
  const setUp = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(width, height).parent(canvasParentRef);

    for (let i = 0; i < 50; i++) {
      boids.push(
        new Boid(p5.random(width), p5.random(height), p5, width, height)
      );
    }
    image = p5.loadImage(fish);
  };

  const draw = (p5: p5Types) => {
    p5.background('rgba(0, 95, 219, 0.5)');
    for (const boid of boids) {
      boid.render(image);
      boid.update();
      boid.edge();
      boid.centering();
      boid.flock(boids);
    }
  };

  return (
    <div>
      <Sketch setup={setUp} draw={draw} />
    </div>
  );
};

export default Flocking;
