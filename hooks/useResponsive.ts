import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const px = width < 560 ? 18 : 24;
  const containerWidth = Math.min(width, 1100) - px * 2;

  return {
    width,
    height,
    px,
    containerWidth,
    isMobile:  width < 600,
    isTablet:  width >= 600 && width < 1024,
    isDesktop: width >= 1024,
    isShortScreen: height < 700,
    /** Returns the card pixel width for a given number of columns */
    colWidth: (cols: number, gap = 16): number =>
      (containerWidth - gap * (cols - 1)) / cols,
  };
}
