import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';

export default function TabTwoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정 및 안내</Text>
        <Text style={styles.appVersion}>더스티 와이프 (DustyWipe) v1.0</Text>
      </View>

      {/* 앱 설명 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 주요 기능 안내</Text>
        
        <View style={styles.featureRow}>
          <Text style={styles.featureEmoji}>⏰</Text>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>자동 안개 노출 시간대</Text>
            <Text style={styles.featureDesc}>
              하루 중 미세먼지 확인이 가장 필요한 아래 시간대에 첫 실행 시 자동으로 뿌연 안개 화면을 활성화합니다.
              {'\n'}• 아침 출근길: 오전 6시 ~ 8시
              {'\n'}• 점심 외출길: 오전 11시 ~ 낮 12시
            </Text>
          </View>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureEmoji}>🔮</Text>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>1시간 뒤 예보 제공</Text>
            <Text style={styles.featureDesc}>
              단순한 현재 수치가 아닌, 사용자가 실제로 야외에 나가게 될 '1시간 뒤'의 미세먼지 트렌드를 실시간 통계 분석법으로 계산하여 보여줍니다.
            </Text>
          </View>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureEmoji}>🧼</Text>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>직관적인 닦기 인터랙션</Text>
            <Text style={styles.featureDesc}>
              수치나 등급에 맞춰 화면의 불투명도와 색상이 결정되며, 손가락으로 가볍게 문질러 액정을 닦아내면 맑은 대시보드가 노출됩니다.
            </Text>
          </View>
        </View>
      </View>

      {/* 미세먼지 등급 기준표 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 미세먼지 등급 기준</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.headerText]}>등급</Text>
            <Text style={[styles.tableCell, styles.headerText]}>PM10 (미세)</Text>
            <Text style={[styles.tableCell, styles.headerText]}>PM2.5 (초미세)</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { color: '#0369a1', fontWeight: 'bold' }]}>좋음</Text>
            <Text style={styles.tableCell}>0 ~ 30 ㎍/㎥</Text>
            <Text style={styles.tableCell}>0 ~ 15 ㎍/㎥</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { color: '#15803d', fontWeight: 'bold' }]}>보통</Text>
            <Text style={styles.tableCell}>31 ~ 80 ㎍/㎥</Text>
            <Text style={styles.tableCell}>16 ~ 35 ㎍/㎥</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { color: '#c2410c', fontWeight: 'bold' }]}>나쁨</Text>
            <Text style={styles.tableCell}>81 ~ 150 ㎍/㎥</Text>
            <Text style={styles.tableCell}>36 ~ 75 ㎍/㎥</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { color: '#b91c1c', fontWeight: 'bold' }]}>매우나쁨</Text>
            <Text style={styles.tableCell}>151 ㎍/㎥ ~</Text>
            <Text style={styles.tableCell}>76 ㎍/㎥ ~</Text>
          </View>
        </View>
      </View>

      {/* 연동 데이터 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔗 데이터 제공처</Text>
        <Text style={styles.infoText}>
          • 실시간 미세먼지 수치: 환경부 한국환경공단 (에어코리아){'\n'}
          • 위치 측위 서비스: 기기 GPS 수신기 및 카카오/구글 역지오코딩{'\n'}
          * 본 앱의 예측 알고리즘은 단기 트렌드 선형보외법에 의한 추정치로, 기상 상황에 따라 실제 수치와 다소 오차가 발생할 수 있습니다.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 13,
    color: '#64748b',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  featureEmoji: {
    fontSize: 24,
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: '#334155',
  },
  headerText: {
    fontWeight: '700',
    color: '#1e293b',
  },
  infoText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
  },
});
