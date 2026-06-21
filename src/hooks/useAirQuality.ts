import { useState, useEffect, useCallback } from 'react';
import { NativeModules } from 'react-native';
import * as Location from 'expo-location';
import { fetchAirQuality, ForecastResult } from '../api/airkorea';

const { DustyWipeModule } = NativeModules;

export function useAirQuality() {
  const [data, setData] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [station, setStation] = useState<string>('종로구');

  const loadAirData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      let currentStation = '종로구';

      if (status === 'granted') {
        // 2. 현재 GPS 위치 획득 (4초 타임아웃 및 폴백)
        let location = null;
        try {
          location = await Promise.race([
            Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            }),
            new Promise<null>((_, reject) =>
              setTimeout(() => reject(new Error('Location request timeout')), 4000)
            )
          ]) as Location.LocationObject | null;
        } catch (locErr) {
          console.warn('[useAirQuality] Location request timed out or failed, falling back:', locErr);
          try {
            location = await Location.getLastKnownPositionAsync();
          } catch (lastLocErr) {
            console.error('[useAirQuality] getLastKnownPositionAsync failed:', lastLocErr);
          }
        }

        // 3. 위경도 -> 행정구역 역지오코딩 (Reverse Geocoding)
        let geocode = null;
        if (location) {
          try {
            geocode = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          } catch (geoErr) {
            console.error('[useAirQuality] reverseGeocodeAsync failed:', geoErr);
          }
        }

        if (geocode && geocode.length > 0) {
          const first = geocode[0];
          
          // 1순위: 동/읍/면/로로 끝나는 측정소급 상세 행정 구역 매칭
          let candidate = '';
          const dongCandidates = [first.street, first.district, first.name, first.subregion];
          for (const item of dongCandidates) {
            if (item) {
              const trimmed = item.trim();
              if (
                trimmed.length > 1 &&
                (trimmed.endsWith('동') || trimmed.endsWith('읍') || trimmed.endsWith('면') || trimmed.endsWith('로'))
              ) {
                candidate = trimmed;
                break;
              }
            }
          }

          // 2순위: 동/읍/면을 못 찾은 경우 시/구/군 정보 매칭
          if (!candidate) {
            const district = first.district || first.subregion || first.city;
            if (district) {
              candidate = district.trim();
            }
          }

          if (candidate) {
            currentStation = getFallbackStationForDistrict(candidate);
            setStation(currentStation);
          }
        }
      } else {
        console.log('[useAirQuality] Location permission denied. Using default station: 종로구');
      }

      // 4. 에어코리아 API 호출
      const result = await fetchAirQuality(currentStation);
      setData(result);

      // 5. 네이티브 오버레이와 동기화하기 위해 SharedPreferences에 저장
      if (DustyWipeModule) {
        const pm10Val = result.current.pm10;
        const gradeVal = result.current.grade10;
        // 1시간 뒤 예측값 및 추세 텍스트 작성
        const forecastText = `1시간 후 예측: ${result.predicted.pm10} μg/m³ (${result.predicted.grade10})`;
        DustyWipeModule.setAirQualityData(currentStation, pm10Val, gradeVal, forecastText, result.current.dataTime);
        console.log('[useAirQuality] Synced to Android SharedPreferences successfully.');
      }
    } catch (err: any) {
      console.error('[useAirQuality] Error:', err);
      setError(err.message || '데이터를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAirData();
  }, [loadAirData]);

  return {
    data,
    loading,
    error,
    station,
    refresh: loadAirData,
  };
}

/**
 * 단순 시/구 명칭(예: 상록구, 영통구 등)을 실제 측정소가 존재하는 동 단위 측정소명으로 변환합니다.
 */
/**
 * 단순 시/구 명칭(예: 상록구, 영통구 등)을 실제 측정소가 존재하는 동 단위 측정소명으로 변환합니다.
 */
function getFallbackStationForDistrict(district: string): string {
  const clean = district.trim().toLowerCase();
  
  if (clean.includes('방배') || clean.includes('bangbae')) return '서초구'; // 방배동에 측정소가 없으므로 서초구로 예외 매핑
  if (clean.includes('서초') || clean.includes('seocho')) return '서초구';
  if (clean.includes('사동') || clean.includes('sa-dong') || clean.includes('sadong')) return '본오동'; // 사동에 대기질 측정소가 없으므로 본오동으로 예외 매핑
  if (clean.includes('상록') || clean.includes('sangnok')) return '본오동';
  if (clean.includes('단원') || clean.includes('danwon')) return '고잔동';
  if (clean.includes('안산') || clean.includes('ansan')) return '고잔동';
  if (clean.includes('영통') || clean.includes('yeongtong')) return '영통동';
  if (clean.includes('팔달') || clean.includes('paldal')) return '신풍동';
  if (clean.includes('장안') || clean.includes('jangan')) return '천천동';
  if (clean.includes('권선') || clean.includes('gwonseon')) return '고색동';
  if (clean.includes('수원') || clean.includes('suwon')) return '신풍동';
  if (clean.includes('분당') || clean.includes('bundang')) return '수내동';
  if (clean.includes('수정') || clean.includes('sujeong')) return '복정동';
  if (clean.includes('중원') || clean.includes('jungwon')) return '상대원동';
  if (clean.includes('성남') || clean.includes('seongnam')) return '수내동';
  if (clean.includes('일산동') || clean.includes('ilsandong')) return '식사동';
  if (clean.includes('일산서') || clean.includes('ilsanseo')) return '주엽동';
  if (clean.includes('덕양') || clean.includes('deogyang')) return '행신동';
  if (clean.includes('고양') || clean.includes('goyang')) return '행신동';
  if (clean.includes('기흥') || clean.includes('giheung')) return '기흥';
  if (clean.includes('수지') || clean.includes('suji')) return '수지';
  if (clean.includes('처인') || clean.includes('cheoin')) return '김량장동';
  if (clean.includes('용인') || clean.includes('yongin')) return '김량장동';
  if (clean.includes('중구') || clean.includes('jung-gu') || clean.includes('junggu')) return '중구';
  if (clean.includes('종로') || clean.includes('jongno')) return '종로구';

  // General English to Korean district translations for Seoul
  if (clean.includes('gangnam')) return '강남구';
  if (clean.includes('gangdong')) return '강동구';
  if (clean.includes('gangbuk')) return '강북구';
  if (clean.includes('gangseo')) return '강서구';
  if (clean.includes('gwanak')) return '관악구';
  if (clean.includes('gwangjin')) return '광진구';
  if (clean.includes('guro')) return '구로구';
  if (clean.includes('geumcheon')) return '금천구';
  if (clean.includes('nowon')) return '노원구';
  if (clean.includes('dobong')) return '도봉구';
  if (clean.includes('dongdaemun')) return '동대문구';
  if (clean.includes('dongjak')) return '동작구';
  if (clean.includes('mapo')) return '마포구';
  if (clean.includes('seodaemun')) return '서대문구';
  if (clean.includes('seongdong')) return '성동구';
  if (clean.includes('seongbuk')) return '성북구';
  if (clean.includes('songpa')) return '송파구';
  if (clean.includes('yangcheon')) return '양천구';
  if (clean.includes('yeongdeungpo')) return '영등포구';
  if (clean.includes('yongsan')) return '용산구';
  if (clean.includes('eunpyeong')) return '은평구';
  if (clean.includes('jungnang')) return '중랑구';

  return district.trim();
}
