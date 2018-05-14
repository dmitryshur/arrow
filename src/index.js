import { bezier } from "./bezier_cubic";
import { mathematics } from "./mathematics";
import { raf } from "./requestAnimationFrame";
import { arrow } from "./arrow";
import "./main.css";

const height = 200;
const width = 600;

const canvas = document.querySelector("#canvas");
canvas.width = width;
canvas.height = height;

const arrow_color = "#4fbad8";
const bezierCurve = {
  p0: {
    x: 0,
    y: height
  },
  p1: {
    x: width / 4,
    y: 0
  },
  p2: {
    x: width * 3 / 4,
    y: 0
  },
  p3: {
    x: width,
    y: height
  }
};

$$.animateArrow(canvas.getContext("2d"), bezierCurve, 10, arrow_color, 500);
