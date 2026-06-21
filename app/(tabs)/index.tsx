import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, NativeModules } from 'react-native';
import { useAirQuality } from '../../src/hooks/useAirQuality';
import Dashboard from '../../src/components/Dashboard';

const { DustyWipeModule } = NativeModules;

export default function TabOneScreen() {
  const { data, loading, error, refresh } = useAirQuality();

  const handleResetFog = () => {
    // 네이티브 오버레이를 완전히 리셋하고 새로 띄움 (처음 실행과 동일)
    if (DustyWipeModule) {
      DustyWipeModule.resetFogState();
    }
  };

  if (loading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0f172a" />
        <Text style={styles.loadingText}>실시간 대기 상태 분석 중...</Text>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error || '대기 정보를 가져올 수 없습니다.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Dashboard data={data!} onResetFog={handleResetFog} refreshing={loading} onRefresh={refresh} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#475569',
    fontWeight: '600',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
