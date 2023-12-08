import { useRef,useEffect,useState } from "react"

export default function useScroll() {const [scrollTop, setScrollTop] = useState(0);
    const prevScrollTop = useRef(scrollTop);
    const [isScrollingDown, setIsScrollingDown] = useState(false)
    useEffect(() => {
      if (scrollTop > prevScrollTop.current) {
        setIsScrollingDown(true)
      } else {
        setIsScrollingDown(false)
      }
      prevScrollTop.current = scrollTop
    }, [scrollTop])
    
  useEffect(() => {
    function handleScroll(this: Window, event: Event) {
      setScrollTop(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { isScrollingDown }
}