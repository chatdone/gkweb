import { Button, Space } from '@arco-design/web-react';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';

import styles from './ImageViewer.module.less';

const scales = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5];

const ImageViewer = ({ url }: { url: string }) => {
  const [scale, setScale] = useState<number>(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [moving, setMoving] = useState<boolean>(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const moveDataRef = useRef({
    pageX: 0,
    pageY: 0,
    originX: 0,
    originY: 0,
  });

  useEffect(() => {
    if (moving) {
      document.addEventListener('mousemove', handleMoving, false);
      document.addEventListener('mouseup', handleMoveEnd, false);
    }

    return () => {
      document.removeEventListener('mousemove', handleMoving, false);
      document.removeEventListener('mouseup', handleMoveEnd, false);
    };
  }, [moving]);

  useEffect(() => {
    if (!moving) {
      checkAndFixTranslate();
    }
  }, [moving, translate]);

  useEffect(() => {
    checkAndFixTranslate();
  }, [scale]);

  const handleZoomIn = () => {
    const currentScaleIndex = scales.findIndex((value) => value === scale);
    const nextIndex = Math.min(scales.length - 1, currentScaleIndex + 1);

    setScale(scales[nextIndex]);
  };

  const handleZoomOut = () => {
    const currentScaleIndex = scales.findIndex((value) => value === scale);
    const prevIndex = Math.max(0, currentScaleIndex - 1);

    setScale(scales[prevIndex]);
  };

  const handleMoveStart: MouseEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault();

    setMoving(true);

    // @ts-ignore
    const ev = e.type === 'touchstart' ? e.touches[0] : e;
    moveDataRef.current.pageX = ev.pageX;
    moveDataRef.current.pageY = ev.pageY;
    moveDataRef.current.originX = translate.x;
    moveDataRef.current.originY = translate.y;
  };

  const handleMoving = (e: MouseEvent) => {
    if (moving) {
      e.preventDefault();

      const { originX, originY, pageX, pageY } = moveDataRef.current;
      const nextX = originX + (e.pageX - pageX) / scale;
      const nextY = originY + (e.pageY - pageY) / scale;
      setTranslate({
        x: nextX,
        y: nextY,
      });
    }
  };

  const handleMoveEnd = (e: MouseEvent) => {
    e.preventDefault();

    setMoving(false);
  };

  const checkAndFixTranslate = () => {
    if (!wrapperRef.current || !imageRef.current) {
      return;
    }

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const imgRect = imageRef.current.getBoundingClientRect();

    const [x, y] = getFixTranslate(
      wrapperRect,
      imgRect,
      translate.x,
      translate.y,
      scale,
    );

    if (x !== translate.x || y !== translate.y) {
      setTranslate({
        x,
        y,
      });
    }
  };

  return (
    <div ref={wrapperRef} className={styles['image-viewer-wrapper']}>
      <div
        className={styles['image-container']}
        data-testid="image-container"
        style={{ transform: `scale(${scale})` }}
      >
        <img
          ref={imageRef}
          src={url}
          alt="preview"
          style={{
            transform: `translate(${translate.x}px, ${
              translate.y
            }px) rotate(${0}deg)`,
          }}
          onMouseDown={handleMoveStart}
        />
      </div>

      <div className={styles['control-container']}>
        <Space size={20}>
          <Button
            data-testid="zoom-in"
            type="text"
            icon={<MdZoomIn />}
            onClick={handleZoomIn}
          />
          <Button
            data-testid="zoom-out"
            type="text"
            icon={<MdZoomOut />}
            onClick={handleZoomOut}
          />
        </Space>
      </div>
    </div>
  );
};

const getFixTranslate = (
  wrapperRect: DOMRect,
  imgRect: DOMRect,
  translateX: number,
  translateY: number,
  scale: number,
): [number, number] => {
  let fixTranslateX = translateX;
  let fixTranslateY = translateY;

  if (translateX) {
    // No translateX if width of img is smaller than width of wrapper
    if (wrapperRect.width > imgRect.width) {
      fixTranslateX = 0;
    } else {
      // Width of image is greater than width of wrapper
      if (imgRect.left > wrapperRect.left) {
        // Reduce translateX to make image move to left if left side of image is within wrapper
        fixTranslateX -= Math.abs(wrapperRect.left - imgRect.left) / scale;
      }
      if (imgRect.right < wrapperRect.right) {
        // Enlarge translateX to make image move to right if right side of image is within wrapper
        fixTranslateX += Math.abs(wrapperRect.right - imgRect.right) / scale;
      }
    }
  }
  if (translateY) {
    // No translateY if height of img is smaller than height of wrapper
    if (wrapperRect.height > imgRect.height) {
      fixTranslateY = 0;
    } else {
      // Height of image is greater than height of wrapper
      if (imgRect.top > wrapperRect.top) {
        // Reduce translateY to make image move to top if top side of image is within wrapper
        fixTranslateY -= Math.abs(wrapperRect.top - imgRect.top) / scale;
      }
      if (imgRect.bottom < wrapperRect.bottom) {
        // Enlarge translateY to make image move to bottom if bottom side of image is within wrapper
        fixTranslateY += Math.abs(wrapperRect.bottom - imgRect.bottom) / scale;
      }
    }
  }
  return [fixTranslateX, fixTranslateY];
};

export default ImageViewer;
