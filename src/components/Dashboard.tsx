import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, BackHandler, RefreshControl } from 'react-native';
import { ForecastResult, AirQualityData } from '../api/airkorea';
import { formatTime, getOneHourLaterTime } from '../utils/time';

interface DashboardProps {
  data: ForecastResult;
  onResetFog: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function Dashboard({ data, onResetFog, refreshing = false, onRefresh }: DashboardProps) {
  const { current, predicted, trend, deltaPm10 } = data;
  const oneHourLater = getOneHourLaterTime();

  // 등급에 따른 배경 및 뱃지 색상 선택
  const getGradeTheme = (grade: string) => {
    switch (grade) {
      case '좋음':
        return { bg: '#e0f2fe', text: '#0369a1', badgeBg: '#bae6fd', desc: '공기가 아주 깨끗합니다!' };
      case '보통':
        return { bg: '#f0fdf4', text: '#15803d', badgeBg: '#bbf7d0', desc: '외출하기 적절한 공기입니다.' };
      case '나쁨':
        return { bg: '#fff7ed', text: '#c2410c', badgeBg: '#ffedd5', desc: '마스크를 준비하시는 게 좋겠어요!' };
      case '매우나쁨':
        return { bg: '#fef2f2', text: '#b91c1c', badgeBg: '#fee2e2', desc: '위험해요! 야외활동을 피하세요.' };
      default:
        return { bg: '#f8fafc', text: '#475569', badgeBg: '#e2e8f0', desc: '대기 정보 분석 중...' };
    }
  };

  const currentTheme = getGradeTheme(current.grade10);
  const predictedTheme = getGradeTheme(predicted.grade10);

  // 트렌드 이모티콘 및 설명
  const getTrendText = () => {
    if (trend === 'rising') return { icon: '📈 상승세', color: '#ef4444', desc: `시간당 약 ${deltaPm10}㎍/㎥ 상승 중` };
    if (trend === 'falling') return { icon: '📉 하강세', color: '#3b82f6', desc: `시간당 약 ${Math.abs(deltaPm10)}㎍/㎥ 감소 중` };
    return { icon: '➡️ 안정됨', color: '#10b981', desc: '변화가 미미합니다' };
  };

  const trendInfo = getTrendText();

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0f172a']} />
        ) : undefined
      }
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.locationLabel}>📍 {current.stationName} 대기측정소</Text>
        <Text style={styles.title}>대기 상태 보고서</Text>
        <Text style={styles.timeLabel}>측정 시간: {current.dataTime}</Text>
      </View>

      {/* 실시간 vs 1시간 뒤 비교 카드 */}
      <View style={styles.comparisonContainer}>
        {/* 현재 상태 */}
        <View style={[styles.card, { borderColor: currentTheme.badgeBg }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardPeriod}>현재 상황</Text>
            <View style={[styles.badge, { backgroundColor: currentTheme.badgeBg }]}>
              <Text style={[styles.badgeText, { color: currentTheme.text }]}>{current.grade10}</Text>
            </View>
          </View>
          
          <View style={styles.dustInfo}>
            <Text style={styles.dustLabel}>미세먼지 (PM10)</Text>
            <Text style={styles.dustValue}>{current.pm10} <Text style={styles.unit}>㎍/㎥</Text></Text>
          </View>
          <View style={styles.dustInfo}>
            <Text style={styles.dustLabel}>초미세먼지 (PM2.5)</Text>
            <Text style={styles.dustValue}>{current.pm25} <Text style={styles.unit}>㎍/㎥</Text></Text>
          </View>
        </View>

        {/* 1시간 뒤 예측 */}
        <View style={[styles.card, styles.predictedCard, { borderColor: predictedTheme.badgeBg }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardPeriod}>1시간 뒤 ({formatTime(oneHourLater)}) 예정</Text>
            <View style={[styles.badge, { backgroundColor: predictedTheme.badgeBg }]}>
              <Text style={[styles.badgeText, { color: predictedTheme.text }]}>{predicted.grade10}</Text>
            </View>
          </View>
          
          <View style={styles.dustInfo}>
            <Text style={styles.dustLabel}>예상 PM10</Text>
            <Text style={styles.dustValue}>{predicted.pm10} <Text style={styles.unit}>㎍/㎥</Text></Text>
          </View>
          <View style={styles.dustInfo}>
            <Text style={styles.dustLabel}>예상 PM2.5</Text>
            <Text style={styles.dustValue}>{predicted.pm25} <Text style={styles.unit}>㎍/㎥</Text></Text>
          </View>
        </View>
      </View>

      {/* 대기질 트렌드 분석 */}
      <View style={styles.trendCard}>
        <Text style={styles.trendTitle}>📊 대기질 변화 트렌드</Text>
        <View style={styles.trendRow}>
          <Text style={[styles.trendIcon, { color: trendInfo.color }]}>{trendInfo.icon}</Text>
          <Text style={styles.trendDesc}>{trendInfo.desc}</Text>
        </View>
      </View>

      {/* 행동 가이드 (코멘트) */}
      <View style={[styles.guideCard, { backgroundColor: predictedTheme.bg }]}>
        <Text style={[styles.guideTitle, { color: predictedTheme.text }]}>💡 1시간 뒤 행동 가이드</Text>
        <Text style={styles.guideDesc}>
          1시간 뒤 외출이나 출퇴근 시점에는 공기질이 <Text style={{fontWeight: 'bold'}}>{predicted.grade10}</Text> 상태로 예상됩니다. 
          {predicted.grade10 === '나쁨' || predicted.grade10 === '매우나쁨' ? 
            '\n😷 식약처 인증 황사 마스크(KF80 이상)를 꼭 착용하시고 장시간 야외 활동을 삼가해 주세요.' : 
            '\n😊 마스크 없이 편안하게 활동하셔도 좋은 날씨입니다.'}
        </Text>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={onResetFog}>
          <Text style={styles.buttonText}>안개 다시 켜기 🧼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={() => BackHandler.exitApp()}>
          <Text style={styles.buttonText}>앱 종료 ❌</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 6,
  },
  timeLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  comparisonContainer: {
    gap: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
  },
  predictedCard: {
    backgroundColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardPeriod: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  dustInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  dustLabel: {
    fontSize: 14,
    color: '#475569',
  },
  dustValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  unit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748b',
  },
  trendCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  trendTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trendIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trendDesc: {
    fontSize: 14,
    color: '#475569',
  },
  guideCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 35,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  guideDesc: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 50,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: '#0f172a',
  },
  exitButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
