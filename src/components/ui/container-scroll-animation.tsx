"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";

export const ContainerScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="flex items-center justify-center relative p-2 sm:p-4 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-4 sm:py-6 md:py-20 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Card translate={translate} scale={scale} />
      </div>
    </div>
  );
};


export const Card = ({
  scale,
}: {
  scale: MotionValue<number>;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-5xl -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-12 mx-auto h-[20rem] sm:h-[25rem] md:h-[30rem] lg:h-[40rem] w-full border-2 sm:border-3 md:border-4 border-[#6C6C6C] p-1 sm:p-2 md:p-4 lg:p-6 bg-[#222222] rounded-[15px] sm:rounded-[20px] md:rounded-[25px] lg:rounded-[30px] shadow-2xl relative z-0"
    >
      <div className="h-full w-full overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-gray-100 dark:bg-zinc-900 p-1 sm:p-2 md:p-4">
        <img
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-lg sm:rounded-xl md:rounded-2xl object-cover h-full w-full object-left-top"
          draggable={true}
        />
      </div>
    </motion.div>
  );
};
