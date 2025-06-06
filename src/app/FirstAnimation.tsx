"use client";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useScroll,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Plane from "../../public/assets/videos/plane.png";
import Aviation from "../../public/assets/videos/Aviation.jpeg";

export default function FirstAnimation() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // sticky effect scroll range
  });

  const [windowWidth, setWindowWidth] = useState<number>(0);
  const planeWidth = 400;
  const cloudWidth = 480;
  const gap = 30;

  const cloudX = useMotionValue(0);

  useEffect(() => {
    const updateWindowWidth = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      const initialPlaneX = -planeWidth;
      const initialCloudX = initialPlaneX - cloudWidth - gap;
      cloudX.set(initialCloudX);
    };

    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);
    return () => window.removeEventListener("resize", updateWindowWidth);
  }, [cloudX]);

  const planeX = useTransform(
    scrollYProgress,
    [0, 1],
    [-planeWidth, windowWidth + planeWidth * 3]
  );

  useEffect(() => {
    const stopTriggerPosition = windowWidth / 2 + planeWidth / 2;
    const cloudStopPosition = windowWidth / 2 - cloudWidth / 2;

    const unsubscribe = planeX.on("change", (latestPlaneX) => {
      const followX = latestPlaneX - cloudWidth - gap;

      if (latestPlaneX < stopTriggerPosition) {
        cloudX.set(followX);
      } else {
        animate(cloudX, cloudStopPosition, {
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.5,
        });
      }
    });

    return () => unsubscribe();
  }, [planeX, windowWidth]);

  return (
    <>
    <div className="bg-blue-300">
      {/* Scrollable wrapper (controls scroll range) */}
      <div className="h-[300vh] relative" ref={containerRef}>
        {/* Sticky Section */}
        <div className="sticky top-0 h-screen w-screen overflow-hidden flex items-center">
          {/* Cloud */}
          <motion.div
            style={{
              x: cloudX,
              position: "absolute",
              top: "50%",
              translateY: "-50%",
              zIndex: 10,
              width: `${cloudWidth}px`,
              height: `${cloudWidth}px`,
            }}
            className="flex items-center justify-center"
          >
            <div
              id="cloud-clip-path"
              className="relative w-[320px] h-[320px] lg:w-full lg:h-full"
            >
              <Image
                src={Aviation}
                alt="Aviation background"
                className="w-full h-full opacity-40"
                priority
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4">
                <h1 className="text-center text-2xl lg:text-4xl font-[700]">
                  Direct Charter to Public
                </h1>
                <p className="text-black text-center">
                  Located in Central California, we are positioned well to
                  depart from all Northern and Southern California airport
                  locations.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Plane */}
          <motion.div
            style={{
              x: planeX,
              position: "absolute",
              top: "50%",
              translateY: "-50%",
              zIndex: 20,
            }}
          >
            <Image
              src={Plane}
              alt="Flying plane"
              className="w-[400px] h-auto"
              priority
            />
          </motion.div>
        </div>
      </div>
    </div>

    </>
  );
}
