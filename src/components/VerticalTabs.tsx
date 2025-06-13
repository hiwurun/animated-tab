import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { TabsProps } from "@/types";

const transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.15,
};

export function VerticalTabs({ tabs, defaultTabIndex = 0 }: TabsProps) {
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

    // 监听导航栏滚动
    const handleScroll = () => {
      updateNavRect();
    };
    if (navRef.current) {
      navRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("resize", updateNavRect);
      observer.disconnect();
      if (navRef.current) {
        navRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const getButtonRect = (index: number) => {
    const button = buttonRefs.current[index];
    if (!button) {
      return null;
    }
    const rect = button.getBoundingClientRect();
    return rect;
  };

  const getHoverAnimationProps = (hoveredRect: DOMRect, navRect: DOMRect) => ({
    y: hoveredRect.top - navRect.top + (navRef.current?.scrollTop || 0) - 15,
    x: hoveredRect.left - navRect.left - 12,
    width: hoveredRect.width,
    height: hoveredRect.height,
  });

  const getIndicatorAnimationProps = (
    selectedRect: DOMRect,
    navRect: DOMRect
  ) => ({
    height: selectedRect.height,
    width: 3,
    y: selectedRect.top - navRect.top + (navRef.current?.scrollTop || 0),
    x: navRect.width - 3, // 指示器在导航栏右侧
    opacity: 1,
  });

  return (
    <div className='w-full rounded-lg shadow-lg overflow-hidden flex flex-row'>
      <nav
        ref={navRef}
        className='relative z-0 border-r flex-col py-4 px-3 w-30 flex gap-4 overflow-auto'
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
                className='relative z-20 transition-colors duration-300 min-h-[40px] w-full justify-start'>
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
                className='absolute z-10 rounded-md bg-primary/10'
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
            className='absolute z-10 bg-primary right-0 top-0 w-[3px]'
            initial={false}
            animate={getIndicatorAnimationProps(
              getButtonRect(selectedTabIndex)!,
              navBoundingRect
            )}
            transition={transition}
          />
        )}
      </nav>

      <AnimatePresence mode='wait'>
        <motion.div
          key={tabs[selectedTabIndex].value}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
          className='p-1 flex-1'>
          {tabs[selectedTabIndex].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
