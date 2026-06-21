/**
 * DustyWipe 시간관련 유틸리티
 */

// 아침 출근 시간대: 06:00 ~ 08:00 (6시, 7시, 8시 정각 포함)
const MORNING_START = 6;
const MORNING_END = 8;

// 점심 외출 시간대: 11:00 ~ 12:00 (11시, 12시 정각 포함)
const LUNCH_START = 11;
const LUNCH_END = 12;

/**
 * 현재 시간이 안개 닦기 인터랙션 타겟 시간대인지 여부 반환
 */
export function isTargetTimeWindow(date: Date = new Date()): boolean {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // 6시 00분 ~ 8시 00분
  const isMorning = (hours === MORNING_START && minutes >= 0) || 
                    (hours === 7) || 
                    (hours === MORNING_END && minutes === 0);

  // 11시 00분 ~ 12시 00분
  const isLunch = (hours === LUNCH_START && minutes >= 0) || 
                  (hours === LUNCH_END && minutes === 0);

  return isMorning || isLunch;
}

/**
 * 1시간 뒤의 예상 미세먼지 수치를 보여주기 위한 1시간 뒤 시간 반환
 */
export function getOneHourLaterTime(date: Date = new Date()): Date {
  const newDate = new Date(date.getTime());
  newDate.setHours(newDate.getHours() + 1);
  return newDate;
}

/**
 * 디스플레이용 시간 포맷 반환 (예: "08:15")
 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
