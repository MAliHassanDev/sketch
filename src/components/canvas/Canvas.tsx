import {MouseEvent, useContext, useEffect, useRef, useState } from "react";
import styles from "./Canvas.module.css";
import {
  ThemeContext,
  ThemeContextType,
} from "@/components/ThemeProvider/ThemeProvider";
import { CanvasTool, HandDrawTool} from "@/app/tools";



type CanvasProps = {
  activeTool: CanvasTool
}

const Canvas = ({activeTool}:CanvasProps) => {
  const { theme } = useContext(ThemeContext) as ThemeContextType;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  type MouseCords = [number,number]
  const [startMouseCords, setStartMouseCords] = useState<MouseCords>([
    0, 0,
  ]);


  useEffect(() => {
    if (!canvasRef.current) {
      throw new Error("Html canvas is undefined");
    } 
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    contextRef.current = ctx;
  }, []);


  useEffect(() => {
    switch (activeTool.category) {
      case "handDraw":
        setUpHandDrawTool(activeTool);
        break;
      case "select":
        setUpSelectTool();  
    }
  },[startMouseCords]);

  function setUpSelectTool() {
    
  }
  
  function setUpHandDrawTool(tool:HandDrawTool) {
    const ctx = contextRef.current;
    if (!ctx) throw new Error("Canvas rendering context is undefined");
    ctx.beginPath();
    ctx.moveTo(...startMouseCords);
    ctx.strokeStyle = tool.strokeStyle;
    ctx.lineCap = tool.lineCap;
    ctx.lineWidth = tool.lineWidth;
  }

  // TODO Move the logic os assigning rendering based on category in function Or switch 
  function handleMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    if (!isMouseDown) return;
    const ctx = contextRef.current;
    if (activeTool.category == "handDraw") {
      ctx?.lineTo(e.clientX, e.clientY);
      ctx?.stroke();
    }
  }

  function handleMouseDown(e:MouseEvent<HTMLCanvasElement>) {
    setIsMouseDown(true);
    setStartMouseCords([e.clientX, e.clientY],);
  
  }

  function handleMouseUp() {
    setIsMouseDown(false);
  }

  
  return (
    <canvas
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={`${styles.canvas} ${theme}`}
      height={window.innerHeight}
      width={window.innerWidth}
      ref={canvasRef}
      id='canvas'
      data-testid="canvas"
    ></canvas>
  );
};

export default Canvas;
