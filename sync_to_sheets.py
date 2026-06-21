import sys
import os
import csv
import gspread

SHEET_KEY = "1kwEsuWve5VqdvsuVImnHCzd7vt0ANBhJF07UHEk4N-A"
CSV_PATH = "/Users/tide/Projects/dusty-wipe/tester_feedback_template.csv"

def main():
    print("Connecting to Google Sheets...")
    try:
        gc = gspread.oauth()
    except Exception as e:
        print(f"Failed to authenticate with Google: {e}")
        print("Please verify your gspread configuration.")
        sys.exit(1)

    print(f"Opening spreadsheet: {SHEET_KEY}")
    try:
        sh = gc.open_by_key(SHEET_KEY)
    except PermissionError:
        print("\n[ERROR] 403 Permission Denied")
        print("현재 로컬 PC에 인증된 구글 계정이 이 스프레드시트에 접근할 권한이 없습니다.")
        print("해결 방법:")
        print("1. 공유해주신 구글 시트 우측 상단 [공유] 단추를 누릅니다.")
        print("2. 일반 액세스를 '링크가 있는 모든 사용자'로 변경하고 역할을 '편집자(Editor)'로 설정해 주세요.")
        print("3. 또는 로컬 PC에 인증된 구글 계정에 공유 권한을 부여해 주세요.")
        print("4. 그 다음 이 동기화 스크립트를 다시 실행해 주세요.\n")
        sys.exit(1)
    except Exception as e:
        print(f"Failed to open spreadsheet: {e}")
        sys.exit(1)

    # 첫 번째 워크시트 가져오기
    try:
        worksheet = sh.get_worksheet(0)
    except Exception as e:
        print(f"Failed to get worksheet: {e}")
        sys.exit(1)

    print(f"Reading CSV data from: {CSV_PATH}")
    if not os.path.exists(CSV_PATH):
        print(f"CSV file not found at {CSV_PATH}")
        sys.exit(1)

    rows = []
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        # UTF-8 BOM 대응
        content = f.read()
        if content.startswith('\ufeff'):
            content = content[1:]
        reader = csv.reader(content.splitlines())
        for row in reader:
            rows.append(row)

    print("Clearing existing sheet content...")
    worksheet.clear()

    print(f"Writing {len(rows)} rows to the sheet...")
    worksheet.update('A1', rows)
    
    print("\n🎉 스프레드시트에 테스터 의견 수집 템플릿 등록 완료!")
    print(f"공유 링크: https://docs.google.com/spreadsheets/d/{SHEET_KEY}/edit\n")

if __name__ == "__main__":
    main()
