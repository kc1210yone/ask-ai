import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const JAPAN_TIME_ZONE = 'Asia/Tokyo';

// 日時を日本時間に変換した上で、指定したフォーマットの文字列に変換する
export const formatWithTimeZone = (
  dateTime: Date,
  formatString: string,
): string => {
  return format(new TZDate(dateTime, JAPAN_TIME_ZONE), formatString, {
    locale: ja,
  });
};
