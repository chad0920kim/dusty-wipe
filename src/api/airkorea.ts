/**
 * 에어코리아 대기오염정보 API 서비스
 */

const API_KEY = process.env.EXPO_PUBLIC_DATA_GO_KR_API_KEY || '70bd52095f3e7a5c616a57e4aa6690118925f17ccc81ce6a1a57278e2b891d40';
const BASE_URL = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc';

export interface AirQualityData {
  pm10: number;      // PM10 농도 (㎍/㎥)
  pm25: number;      // PM2.5 농도 (㎍/㎥)
  grade10: string;   // PM10 등급 (좋음, 보통, 나쁨, 매우나쁨)
  grade25: string;   // PM2.5 등급
  dataTime: string;  // 측정 시간
  stationName: string;
}

export interface ForecastResult {
  current: AirQualityData;
  predicted: AirQualityData; // 1시간 뒤 예측 데이터
  trend: 'rising' | 'falling' | 'stable';
  deltaPm10: number; // 시간당 변화량
}

/**
 * 미세먼지 수치에 따른 등급 판정
 */
export function getDustGrade(val: number, isPm25: boolean): '좋음' | '보통' | '나쁨' | '매우나쁨' {
  if (isPm25) {
    if (val <= 15) return '좋음';
    if (val <= 35) return '보통';
    if (val <= 75) return '나쁨';
    return '매우나쁨';
  } else {
    if (val <= 30) return '좋음';
    if (val <= 80) return '보통';
    if (val <= 150) return '나쁨';
    return '매우나쁨';
  }
}

/**
 * 특정 측정소의 최근 대기질 데이터 가져오기 및 1시간 뒤 예측 계산
 * @param stationName 측정소 이름 (예: "종로구")
 */
export async function fetchAirQuality(stationName: string = '종로구'): Promise<ForecastResult> {
  try {
    const url = `${BASE_URL}/getMsrstnAcctoRltmMesureDnsty?serviceKey=${API_KEY}&returnType=json&numOfRows=5&pageNo=1&stationName=${encodeURIComponent(stationName)}&dataTerm=DAILY&ver=1.3`;
    
    console.log(`[AirKorea API] Fetching: ${stationName}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json = await response.json();
    const items = json?.response?.body?.items;
    
    if (!items || items.length === 0) {
      throw new Error(`No data returned for station: ${stationName}`);
    }

    // 최신 순으로 정렬되어 수신됨
    // 유효한 수치 데이터 필터링 (점검 중인 경우 '-' 등으로 들어올 수 있음)
    const validData = items.map((item: any) => {
      const pm10 = parseInt(item.pm10Value, 10);
      const pm25 = parseInt(item.pm25Value, 10);
      return {
        pm10: isNaN(pm10) ? null : pm10,
        pm25: isNaN(pm25) ? null : pm25,
        dataTime: item.dataTime,
      };
    }).filter((d: any) => d.pm10 !== null && d.pm25 !== null);

    if (validData.length === 0) {
      throw new Error('No valid numeric data in recent hours.');
    }

    // 최신 1시간 데이터 (T-0)
    const currentItem = validData[0];
    const current: AirQualityData = {
      pm10: currentItem.pm10,
      pm25: currentItem.pm25,
      grade10: getDustGrade(currentItem.pm10, false),
      grade25: getDustGrade(currentItem.pm25, true),
      dataTime: currentItem.dataTime,
      stationName,
    };

    // 1시간 뒤 예측치 계산 (선형 보외법)
    let deltaPm10 = 0;
    let deltaPm25 = 0;
    let trend: 'rising' | 'falling' | 'stable' = 'stable';

    if (validData.length >= 2) {
      // 최근 수치들 간의 차이 평균 계산
      let totalDiffPm10 = 0;
      let totalDiffPm25 = 0;
      let count = 0;

      for (let i = 0; i < validData.length - 1; i++) {
        // T-i 수치와 T-(i+1) 수치의 차이 (새로운 것 - 옛날 것)
        const diff10 = validData[i].pm10 - validData[i+1].pm10;
        const diff25 = validData[i].pm25 - validData[i+1].pm25;
        totalDiffPm10 += diff10;
        totalDiffPm25 += diff25;
        count++;
      }

      deltaPm10 = Math.round((totalDiffPm10 / count) * 10) / 10;
      deltaPm25 = Math.round((totalDiffPm25 / count) * 10) / 10;

      if (deltaPm10 > 1) {
        trend = 'rising';
      } else if (deltaPm10 < -1) {
        trend = 'falling';
      }
    }

    // 1시간 뒤 수치 예측 = 현재 수치 + 1시간 평균 변화량
    // 수치는 0 이하로 내려갈 수 없음
    const predPm10 = Math.max(0, Math.round(current.pm10 + deltaPm10));
    const predPm25 = Math.max(0, Math.round(current.pm25 + deltaPm25));

    const predicted: AirQualityData = {
      pm10: predPm10,
      pm25: predPm25,
      grade10: getDustGrade(predPm10, false),
      grade25: getDustGrade(predPm25, true),
      dataTime: '1시간 뒤 (예측)',
      stationName,
    };

    return {
      current,
      predicted,
      trend,
      deltaPm10,
    };

  } catch (error) {
    console.error('[AirKorea API] Error fetching air quality:', error);
    // 에러 시 기본 더미 데이터 반환 (테스트 및 폴백용)
    // KST 한국 현지 시간대 기준으로 포맷팅 적용 (UTC 시차 9시간 보정)
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const localTimeStr = kstDate.toISOString().replace('T', ' ').substring(0, 16);

    const fallbackCurrent: AirQualityData = {
      pm10: 45,
      pm25: 22,
      grade10: '보통',
      grade25: '보통',
      dataTime: localTimeStr,
      stationName,
    };
    const fallbackPredicted: AirQualityData = {
      pm10: 52,
      pm25: 26,
      grade10: '보통',
      grade25: '보통',
      dataTime: '1시간 뒤 (예측)',
      stationName,
    };
    return {
      current: fallbackCurrent,
      predicted: fallbackPredicted,
      trend: 'rising',
      deltaPm10: 7,
    };
  }
}
