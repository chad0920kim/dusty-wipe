import React, { useState, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions, PanResponder } from 'react-native';
import Svg, { G, Defs, Mask, Rect, Path, Text as SvgText } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FogOverlayProps {
  pm10: number;
  onWiped: () => void;
}

export default function FogOverlay({ pm10, onWiped }: FogOverlayProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const currentPath = useRef<string>('');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const touchPointsCount = useRef(0);
  const isWipedTriggered = useRef(false);

  // 미세먼지 수치에 따른 테마 설정 (네이티브 오버레이와 1:1 매칭)
  const getTheme = () => {
    if (pm10 <= 30) {
      return { 
        bgColor: 'rgba(224, 242, 254, 0.75)', // 좋음: 맑은 하늘색
        gradeText: '공기 맑음', 
        gradeColor: '#0284c7' 
      };
    } else if (pm10 <= 80) {
      return { 
        bgColor: 'rgba(226, 232, 240, 0.82)', // 보통: 연한 회색
        gradeText: '공기 보통', 
        gradeColor: '#16a34a' 
      };
    } else if (pm10 <= 150) {
      return { 
        bgColor: 'rgba(203, 213, 225, 0.90)', // 나쁨: 탁한 회색
        gradeText: '공기 나쁨', 
        gradeColor: '#ea580c' 
      };
    } else {
      return { 
        bgColor: 'rgba(120, 113, 108, 0.96)', // 매우나쁨: 어둡고 텁텁한 회색
        gradeText: '공기 매우나쁨', 
        gradeColor: '#dc2626' 
      };
    }
  };

  const theme = getTheme();

  const handlePanResponderMove = (evt: any) => {
    const { locationX, locationY } = evt.nativeEvent;
    
    if (currentPath.current === '') {
      currentPath.current = `M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
    } else {
      currentPath.current += ` L ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
    }

    touchPointsCount.current += 1;
    setPaths([...paths, currentPath.current]);

    // 닦음 비율 판단 (많이 닦이면 전체 화면 페이드 아웃)
    if (touchPointsCount.current > 150 && !isWipedTriggered.current) {
      isWipedTriggered.current = true;
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        onWiped();
      });
    }
  };

  const handlePanResponderRelease = () => {
    if (currentPath.current !== '') {
      setPaths(prev => [...prev, currentPath.current]);
      currentPath.current = '';
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current = `M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
      },
      onPanResponderMove: handlePanResponderMove,
      onPanResponderRelease: handlePanResponderRelease,
    })
  ).current;

  // 카드 치수 계산 (가독성 높은 카드 레이아웃)
  const cardWidth = SCREEN_WIDTH * 0.85;
  const cardHeight = 240;
  const cardX = (SCREEN_WIDTH - cardWidth) / 2;
  const cardY = (SCREEN_HEIGHT - cardHeight) / 2 - 40;
  const cx = SCREEN_WIDTH / 2;

  return (
    <Animated.View 
      style={[
        StyleSheet.absoluteFill, 
        { opacity: fadeAnim, zIndex: 9999 }
      ]}
      {...panResponder.panHandlers}
    >
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          {/* 마스크 정의: 기본 흰색(불투명)에 터치 경로(검정색)를 뚫어줌 */}
          <Mask id="scratchMask">
            <Rect width="100%" height="100%" fill="#ffffff" />
            {paths.map((p, index) => (
              <Path
                key={index}
                d={p}
                fill="none"
                stroke="#000000"
                strokeWidth={75}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </Mask>
        </Defs>

        {/* 
          마스크 대상 그룹 (<G>):
          배경색과 정보 카드, 글씨들 전체를 하나의 Group으로 묶어 mask를 적용합니다.
          이렇게 하면 정보 카드도 손가락으로 문지르면 배경과 함께 닦여나갑니다!
        */}
        <G mask="url(#scratchMask)">
          {/* 1. 반투명 배경 레이어 */}
          <Rect
            width="100%"
            height="100%"
            fill={theme.bgColor}
          />

          {/* 2. 정보 카드 몸체 */}
          <Rect
            x={cardX}
            y={cardY}
            width={cardWidth}
            height={cardHeight}
            rx={20}
            ry={20}
            fill="rgba(255, 255, 255, 0.92)"
          />

          {/* 3. 정보 텍스트 (가독성 강화된 SVG 텍스트) */}
          <SvgText
            x={cx}
            y={cardY + 45}
            fill="#475569"
            fontSize="17"
            fontWeight="bold"
            textAnchor="middle"
          >
            📍 대기 정보
          </SvgText>

          <SvgText
            x={cx}
            y={cardY + 105}
            fill={theme.gradeColor}
            fontSize="38"
            fontWeight="bold"
            textAnchor="middle"
          >
            {theme.gradeText}
          </SvgText>

          <SvgText
            x={cx}
            y={cardY + 148}
            fill="#1e293b"
            fontSize="19"
            fontWeight="600"
            textAnchor="middle"
          >
            현재 미세먼지: {pm10} μg/m³
          </SvgText>

          <SvgText
            x={cx}
            y={cardY + 185}
            fill="#64748b"
            fontSize="15"
            textAnchor="middle"
          >
            1시간 뒤 행동 가이드 반영 됨
          </SvgText>

          <SvgText
            x={cx}
            y={cardY + 220}
            fill="#0f172a"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            👉 화면을 문질러 안개를 닦아내세요
          </SvgText>
        </G>
      </Svg>
    </Animated.View>
  );
}
