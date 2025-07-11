import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { TabsProps } from "@/types";

const transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.15,
};

export function HorizontalTabs({ tabs, defaultTabIndex = 0 }: TabsProps) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(defaultTabIndex);
  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [navBoundingRect, setNavBoundingRect] = useState<DOMRect | null>(null);

  // 动态更新 navBoundingRect
  useEffect(() => {
    const updateNavRect = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        setNavBoundingRect(rect);
      }
    };

    updateNavRect(); // 初次设置
    window.addEventListener("resize", updateNavRect); // 窗口大小变化
    const observer = new ResizeObserver(updateNavRect); // 观察导航栏尺寸变化
    if (navRef.current) {
      observer.observe(navRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateNavRect);
      observer.disconnect();
    };
  }, []);

  const getButtonRect = (index: number) => {
    const button = buttonRefs.current[index];
    if (!button) {
      return null;
    }
    return button.getBoundingClientRect();
  };

  const getHoverAnimationProps = (hoveredRect: DOMRect, navRect: DOMRect) => ({
    x: hoveredRect.left - navRect.left + navRef.current!.scrollLeft,
    y: hoveredRect.top - navRect.top, // 确保 y 位置对齐按钮顶部
    width: hoveredRect.width,
    height: hoveredRect.height, // 使用按钮的高度
  });

  return (
    <div className='w-full px-4 rounded-lg shadow-lg overflow-hidden'>
      <nav
        ref={navRef}
        className='flex justify-between border-b relative z-0 py-2 pb-3'
        onPointerLeave={() => setHoveredTabIndex(null)}>
        {tabs.map((tab, index) => {
          const isActive = selectedTabIndex === index;

          return (
            <div
              key={tab.value}
              ref={el => {
                buttonRefs.current[index] = el;
              }}
              className='relative'>
              <Button
                variant={isActive ? "default" : "ghost"}
                onClick={() => setSelectedTabIndex(index)}
                onPointerEnter={() => setHoveredTabIndex(index)}
                onFocus={() => setHoveredTabIndex(index)}
                className='relative z-20 transition-colors duration-300'>
                <motion.span
                  className='block'
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    transition: { duration: 0.2 },
                  }}>
                  {tab.label}
                </motion.span>
              </Button>
            </div>
          );
        })}

        <AnimatePresence>
          {hoveredTabIndex !== null &&
            navBoundingRect &&
            getButtonRect(hoveredTabIndex) && (
              <motion.div
                key='hover'
                className='absolute z-10 top-0 left-0 rounded-md bg-primary/10'
                initial={{
                  ...getHoverAnimationProps(
                    getButtonRect(hoveredTabIndex)!,
                    navBoundingRect
                  ),
                  opacity: 0,
                }}
                animate={{
                  ...getHoverAnimationProps(
                    getButtonRect(hoveredTabIndex)!,
                    navBoundingRect
                  ),
                  opacity: 1,
                }}
                exit={{
                  ...getHoverAnimationProps(
                    getButtonRect(hoveredTabIndex)!,
                    navBoundingRect
                  ),
                  opacity: 0,
                }}
                transition={transition}
              />
            )}
        </AnimatePresence>

        {navBoundingRect && getButtonRect(selectedTabIndex) && (
          <motion.div
            className='absolute z-10 bottom-0 left-0 h-[3px] bg-primary'
            initial={false}
            animate={{
              width: getButtonRect(selectedTabIndex)!.width,
              x: `calc(${
                getButtonRect(selectedTabIndex)!.left - navBoundingRect.left
              }px + ${navRef.current!.scrollLeft}px)`,
              opacity: 1,
            }}
            transition={transition}
          />
        )}
      </nav>

      <AnimatePresence mode='wait'>
        <motion.div
          key={tabs[selectedTabIndex].value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className='p-1' // 内容间距保持 p-4
        >
          {tabs[selectedTabIndex].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
