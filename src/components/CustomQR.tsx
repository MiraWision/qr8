import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, G, Image as SvgImage, Polygon, Path } from 'react-native-svg';
import QRCode from 'qrcode-generator';
import { CellShape, EyeShape } from '../types/qr';

type ErrorLevel = 'L' | 'M' | 'Q' | 'H';

interface CustomQRProps {
  value: string;
  size?: number;
  foregroundColor?: string;
  backgroundColor?: string;
  cellShape?: CellShape;
  eyeShape?: EyeShape;
  errorCorrectionLevel?: ErrorLevel;
  quietZone?: number; // px
  gradient?: { from: string; to: string; angle?: number } | null;
  centerLogo?: { width: number; height: number; borderRadius?: number; bgColor?: string; logoBase64?: string } | null;
}

const DEFAULT_SIZE = 200;

export type CustomQRHandle = {
  exportAsPng: (opts?: { width?: number; height?: number }) => Promise<string>; // returns base64 (no prefix)
};

const CustomQR = React.forwardRef<CustomQRHandle, CustomQRProps>(function CustomQR({
  value,
  size = DEFAULT_SIZE,
  foregroundColor = '#000000',
  backgroundColor = '#FFFFFF',
  cellShape = CellShape.Square,
  eyeShape = EyeShape.Square,
  errorCorrectionLevel = 'Q',
  quietZone = 12,
  gradient = null,
  centerLogo = null,
}: CustomQRProps, ref) {
  const svgRef = React.useRef<any>(null);
  const roundedRectPath = (
    x: number,
    y: number,
    w: number,
    h: number,
    rtl: number,
    rtr: number,
    rbr: number,
    rbl: number
  ): string => {
    // Clamp radii
    rtl = Math.min(rtl, w / 2, h / 2);
    rtr = Math.min(rtr, w / 2, h / 2);
    rbr = Math.min(rbr, w / 2, h / 2);
    rbl = Math.min(rbl, w / 2, h / 2);
    return [
      `M ${x + rtl} ${y}`,
      `H ${x + w - rtr}`,
      rtr ? `Q ${x + w} ${y} ${x + w} ${y + rtr}` : `L ${x + w} ${y}`,
      `V ${y + h - rbr}`,
      rbr ? `Q ${x + w} ${y + h} ${x + w - rbr} ${y + h}` : `L ${x + w} ${y + h}`,
      `H ${x + rbl}`,
      rbl ? `Q ${x} ${y + h} ${x} ${y + h - rbl}` : `L ${x} ${y + h}`,
      `V ${y + rtl}`,
      rtl ? `Q ${x} ${y} ${x + rtl} ${y}` : `L ${x} ${y}`,
      'Z',
    ].join(' ');
  };
  const qr = React.useMemo(() => {
    const typeNumber = 0; // auto
    const qrInstance = QRCode(typeNumber, errorCorrectionLevel);
    qrInstance.addData(value || '');
    qrInstance.make();
    return qrInstance;
  }, [value, errorCorrectionLevel]);

  const moduleCount = qr.getModuleCount();
  const viewSize = size;
  const innerSize = viewSize - quietZone * 2;
  const cell = innerSize / moduleCount;
  const gapRatio = 0.0;
  const margin = 0;

  const isFinder = (x: number, y: number): boolean => {
    const ranges = [
      [0, 0],
      [moduleCount - 7, 0],
      [0, moduleCount - 7],
    ];
    return ranges.some(([sx, sy]) => x >= sx && x < sx + 7 && y >= sy && y < sy + 7);
  };

  const renderCell = (x: number, y: number) => {
    const px = quietZone + x * cell + margin;
    const py = quietZone + y * cell + margin;
    const s = cell - margin * 2;
    const d = (ix: number, iy: number) => (ix >= 0 && ix < moduleCount && iy >= 0 && iy < moduleCount) ? qr.isDark(ix, iy) : false;
    const inFinder = isFinder(x, y);
    const nT = d(x, y - 1);
    const nB = d(x, y + 1);
    const nL = d(x - 1, y);
    const nR = d(x + 1, y);
    const isolated = !nT && !nB && !nL && !nR;
    const cellFill = hasGradient ? 'url(#fgGradient)' : foregroundColor;

    switch (cellShape) {
      case CellShape.Circle:
        return <Circle key={`${x}-${y}`} cx={px + s / 2} cy={py + s / 2} r={s * 0.5} fill={cellFill} />;
      case CellShape.RoundedSquareFull:
        if (isolated) {
          return <Circle key={`${x}-${y}`} cx={px + s / 2} cy={py + s / 2} r={s * 0.5} fill={cellFill} />;
        }
        {
          const r = s * 0.38;
          const rtl = (!nT && !nL) ? r : 0;
          const rtr = (!nT && !nR) ? r : 0;
          const rbr = (!nB && !nR) ? r : 0;
          const rbl = (!nB && !nL) ? r : 0;
          return <Path key={`${x}-${y}`} d={roundedRectPath(px, py, s, s, rtl, rtr, rbr, rbl)} fill={cellFill} />;
        }
      case CellShape.RoundedSquareSlight:
        {
          const r = s * 0.18;
          const rtl = (!nT && !nL) ? r : 0;
          const rtr = (!nT && !nR) ? r : 0;
          const rbr = (!nB && !nR) ? r : 0;
          const rbl = (!nB && !nL) ? r : 0;
          return <Path key={`${x}-${y}`} d={roundedRectPath(px, py, s, s, rtl, rtr, rbr, rbl)} fill={cellFill} />;
        }
      case CellShape.RoundedTopLeftBottomRight:
        {
          const r = s * 0.38;
          const rtl = (!nT && !nL) ? r : 0;
          const rbr = (!nB && !nR) ? r : 0;
          return <Path key={`${x}-${y}`} d={roundedRectPath(px, py, s, s, rtl, 0, rbr, 0)} fill={cellFill} />;
        }
      case CellShape.RoundedTopRightBottomLeft:
        {
          const r = s * 0.38;
          const rtr = (!nT && !nR) ? r : 0;
          const rbl = (!nB && !nL) ? r : 0;
          return <Path key={`${x}-${y}`} d={roundedRectPath(px, py, s, s, 0, rtr, 0, rbl)} fill={cellFill} />;
        }
      case CellShape.HorizontalLines:
        return (
          <Rect key={`${x}-${y}`} x={px} y={py + s * 0.3} width={s} height={s * 0.4} rx={s * 0.2} ry={s * 0.2} fill={cellFill} />
        );
      case CellShape.VerticalLines:
        return (
          <Rect key={`${x}-${y}`} x={px + s * 0.3} y={py} width={s * 0.4} height={s} rx={s * 0.2} ry={s * 0.2} fill={cellFill} />
        );
      case CellShape.Square:
      default:
        return <Rect key={`${x}-${y}`} x={px} y={py} width={s} height={s} fill={cellFill} />;
    }
  };

  const renderEye = (sx: number, sy: number) => {
    const px = quietZone + sx * cell;
    const py = quietZone + sy * cell;
    const outerProps = { x: px, y: py, width: cell * 7, height: cell * 7 } as const;
    const whiteProps = { x: px + cell, y: py + cell, width: cell * 5, height: cell * 5 } as const;
    const pupilProps = { x: px + cell * 2, y: py + cell * 2, width: cell * 3, height: cell * 3 } as const;

    switch (eyeShape) {
      case EyeShape.Circle:
        return (
          <G key={`eye-${sx}-${sy}`}>
            <Circle
              cx={px + cell * 3.5}
              cy={py + cell * 3.5}
              r={cell * 3.5}
              fill={foregroundColor}
            />
            <Circle
              cx={px + cell * 3.5}
              cy={py + cell * 3.5}
              r={cell * 2.5}
              fill={backgroundColor}
            />
            <Circle
              cx={px + cell * 3.5}
              cy={py + cell * 3.5}
              r={cell * 1.5}
              fill={foregroundColor}
            />
          </G>
        );
      case EyeShape.RoundedSquare:
        return (
          <G key={`eye-${sx}-${sy}`}>
            <Rect {...outerProps} rx={cell * 1.4} ry={cell * 1.4} fill={foregroundColor} />
            <Rect {...whiteProps} rx={cell * 1.0} ry={cell * 1.0} fill={backgroundColor} />
            <Rect {...pupilProps} rx={cell * 1.1} ry={cell * 1.1} fill={foregroundColor} />
          </G>
        );
      case EyeShape.Drop:
        return (
          <G key={`eye-${sx}-${sy}`}>
            {(() => {
              const innerCorner =
                sx === 0 && sy === 0 ? 'br' :
                sx > 0 && sy === 0 ? 'bl' :
                'tr';
              const rOuter = cell * 2.6;
              const rWhite = cell * 1.9;
              const rPupil = cell * 1.4;

              const outerPath =
                innerCorner === 'br'
                  ? roundedRectPath(outerProps.x, outerProps.y, outerProps.width, outerProps.height, rOuter, rOuter, 0, rOuter) // bottom-right sharp
                  : innerCorner === 'bl'
                  ? roundedRectPath(outerProps.x, outerProps.y, outerProps.width, outerProps.height, rOuter, rOuter, rOuter, 0) // bottom-left sharp
                  : roundedRectPath(outerProps.x, outerProps.y, outerProps.width, outerProps.height, rOuter, 0, rOuter, rOuter); // top-right sharp

              const whitePath =
                innerCorner === 'br'
                  ? roundedRectPath(whiteProps.x, whiteProps.y, whiteProps.width, whiteProps.height, rWhite, rWhite, 0, rWhite)
                  : innerCorner === 'bl'
                  ? roundedRectPath(whiteProps.x, whiteProps.y, whiteProps.width, whiteProps.height, rWhite, rWhite, rWhite, 0)
                  : roundedRectPath(whiteProps.x, whiteProps.y, whiteProps.width, whiteProps.height, rWhite, 0, rWhite, rWhite);

              const pupilPath =
                innerCorner === 'br'
                  ? roundedRectPath(pupilProps.x, pupilProps.y, pupilProps.width, pupilProps.height, rPupil, rPupil, 0, rPupil)
                  : innerCorner === 'bl'
                  ? roundedRectPath(pupilProps.x, pupilProps.y, pupilProps.width, pupilProps.height, rPupil, rPupil, rPupil, 0)
                  : roundedRectPath(pupilProps.x, pupilProps.y, pupilProps.width, pupilProps.height, rPupil, 0, rPupil, rPupil);

              return (
                <>
                  <Path d={outerPath} fill={foregroundColor} />
                  <Path d={whitePath} fill={backgroundColor} />
                  <Path d={pupilPath} fill={foregroundColor} />
                </>
              );
            })()}
          </G>
        );
      case EyeShape.Square:
      default:
        return (
          <G key={`eye-${sx}-${sy}`}>
            {/* Classic finder: 7x7 black, 5x5 white, 3x3 black */}
            <Rect x={px} y={py} width={cell * 7} height={cell * 7} fill={foregroundColor} />
            <Rect x={px + cell} y={py + cell} width={cell * 5} height={cell * 5} fill={backgroundColor} />
            <Rect x={px + cell * 2} y={py + cell * 2} width={cell * 3} height={cell * 3} fill={foregroundColor} />
          </G>
        );
    }
  };

  const eyePositions: Array<[number, number]> = [
    [0, 0],
    [moduleCount - 7, 0],
    [0, moduleCount - 7],
  ];

  const hasGradient = Boolean(gradient);
  const angle = gradient?.angle ?? 90;
  const rad = (angle * Math.PI) / 180;
  const gx = (Math.cos(rad) + 1) / 2;
  const gy = (Math.sin(rad) + 1) / 2;
  React.useImperativeHandle(ref, () => ({
    exportAsPng: ({ width, height }: { width?: number; height?: number } = {}) => {
      return new Promise<string>((resolve, reject) => {
        try {
          const w = width ?? viewSize;
          const h = height ?? viewSize;
          const attempt = (tries: number) => {
            if (!svgRef.current || typeof svgRef.current.toDataURL !== 'function') {
              if (tries > 5) {
                reject(new Error('SVG not ready'));
                return;
              }
              requestAnimationFrame(() => attempt(tries + 1));
              return;
            }
            svgRef.current.toDataURL(
              (data: string) => {
                const base64 = data.replace(/^data:image\/png;base64,/, '');
                resolve(base64);
              },
              { width: w, height: h, base64: true, backgroundColor }
            );
          };
          attempt(0);
        } catch (e) {
          reject(e);
        }
      });
    },
  }), [viewSize, backgroundColor]);

  const logoRect = React.useMemo(() => {
    if (!centerLogo) return null;
    const lw = Math.min(centerLogo.width, viewSize * 0.35);
    const lh = Math.min(centerLogo.height, viewSize * 0.35);
    return {
      x: (viewSize - lw) / 2,
      y: (viewSize - lh) / 2,
      w: lw,
      h: lh,
      r: centerLogo.borderRadius ?? 12,
      bg: centerLogo.bgColor ?? '#FFFFFF',
      dataUri: centerLogo.logoBase64 ? `data:image/png;base64,${centerLogo.logoBase64}` : null,
    } as const;
  }, [centerLogo, viewSize]);

  return (
    <Svg ref={svgRef} width={viewSize} height={viewSize}>
      <Defs>
        {hasGradient && (
          <LinearGradient id="fgGradient" x1={1 - gx} y1={1 - gy} x2={gx} y2={gy}>
            <Stop offset="0%" stopColor={gradient!.from} />
            <Stop offset="100%" stopColor={gradient!.to} />
          </LinearGradient>
        )}
      </Defs>

      <Rect x={0} y={0} width={viewSize} height={viewSize} fill={backgroundColor} />

      {/* Finder patterns */}
      {eyePositions.map(([sx, sy]) => renderEye(sx, sy))}

      {/* Data modules */}
      <G>
        {Array.from({ length: moduleCount }).map((_, y) =>
          Array.from({ length: moduleCount }).map((__, x) => {
            if (!qr.isDark(x, y)) return null;
            if (isFinder(x, y)) return null;
            if (logoRect) {
              const px = quietZone + x * cell + margin;
              const py = quietZone + y * cell + margin;
              const s = cell - margin * 2;
              const pad = cell * 0.5;
              const lx = logoRect.x - pad;
              const ly = logoRect.y - pad;
              const lw = logoRect.w + pad * 2;
              const lh = logoRect.h + pad * 2;
              const overlaps = px < lx + lw && px + s > lx && py < ly + lh && py + s > ly;
              if (overlaps) return null;
            }
            return renderCell(x, y);
          })
        )}
      </G>

      {/* Center logo placeholder */}
      {logoRect && (
        <G>
          <Rect
            x={logoRect.x - cell}
            y={logoRect.y - cell}
            width={logoRect.w + cell * 2}
            height={logoRect.h + cell * 2}
            rx={logoRect.r + cell * 0.6}
            ry={logoRect.r + cell * 0.6}
            fill={logoRect.bg}
          />
          <Rect x={logoRect.x} y={logoRect.y} width={logoRect.w} height={logoRect.h} rx={logoRect.r} ry={logoRect.r} fill={logoRect.bg} />
          {logoRect.dataUri && (
            <SvgImage
              x={logoRect.x}
              y={logoRect.y}
              width={logoRect.w}
              height={logoRect.h}
              preserveAspectRatio="xMidYMid meet"
              href={{ uri: logoRect.dataUri }}
            />
          )}
        </G>
      )}
    </Svg>
  );
});

export default CustomQR;


