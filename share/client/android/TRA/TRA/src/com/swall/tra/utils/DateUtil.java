package com.swall.tra.utils;

/**
 * Created by pxz on 13-12-25.
 */

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class DateUtil {
    /**
     * 规则 1分钟以内（今天零点后） 刚刚 刚刚 1分钟-1小时内（今天零点后） n分钟前 1分钟前 ；59分钟前 1小时-24小时内（今天零点后）
     * n小时前 1小时前 ；23小时前 今天零点-昨天零点 昨天 n时：n分 昨天 23：59 ；昨天 0：00 昨天零点-前天零点 前天 n时：n分
     * 前天 23：59 ；前天 0：00 前天零点-本月第一天零点 n天前 3天前 ；30天前 本月第一天零点-今年1月1日零点 n个月前 1个月前
     * ；11个月前 今年1月1日零点前 n年前 1年前 ；n年前
     *
     * @param d
     * @return
     */

    public static final String JUST_MINS = "刚刚";

    public static final String MINS_AGO = "分钟前";

    public static final String HOURS_AGO = "小时前";

    public static final String TODAY = "今天";

    public static final String YESTERDAY = "昨天";

    public static final String BEFOREY_YESTERDAY = "前天";

    public static final String DAYS_AGO = "天前";

    public static final String MONTH_AGO = "月前";

    public static final String YEAR_AGO = "年前";

    public static final String HOUR = "时";

    public static final String YEAR = "年";

    public static final String MONTH = "月";

    public static final String DAY = "日";

    public static final String MIN = "分";

    public static final String BEFORE = "前";

    public static final String COLON = ":";

    public static final String DIAN = "点";

    public static final int    DAY_SECOND = 86400;

    public static final int    TWO_DAY_SECOND = 172800;

    public static final int    TIME_ZONE_SPACE = 28800;

    // private static TimeZone timezone=TimeZone.;
    static String doubleD(int i) {
        if (i < 10) {
            return '0' + String.valueOf(i);
        } else {
            return String.valueOf(i);
        }
    }

    public final static String DATE_FORMAT = "%d-%d %d:%02d";
    public final static String DATE_FORMAT_FULL = "%d年%d月%d日 %d:%02d";
    public final static String DATE_FORMAT_TODAY = "%d:%02d";
    public final static String DATE_FORMAT_YESTERDAY = "%s %d:%02d";

    public final static String mYear = "年", mMonth = "月", mDay = "日";
    public final static String mToday = "今天";
    public final static String mYESTERDAY = "昨天";

    /**
     * @param time
     * @return
     * @author clarkhuang
     */
    public static String getDate(long time) {
        Calendar calendar = new ThreadLocal<Calendar>() {
            protected Calendar initialValue() {
                return Calendar.getInstance();
            }
        }.get();

        long now = System.currentTimeMillis();
        calendar.setTimeInMillis(now);
        int nowYear = calendar.get(Calendar.YEAR);
//        int nowMonth = calendar.get(Calendar.MONTH) + 1 - Calendar.JANUARY;
//        int nowDay = calendar.get(Calendar.DAY_OF_MONTH);

        calendar.setTimeInMillis(time);
        int timeYear = calendar.get(Calendar.YEAR);
        int timeMonth = calendar.get(Calendar.MONTH) + 1 - Calendar.JANUARY;
        int timeDay = calendar.get(Calendar.DAY_OF_MONTH);
        int timeHour = calendar.get(Calendar.HOUR_OF_DAY);
        int timeMin = calendar.get(Calendar.MINUTE);

        final String date;

        double onDay = 24 * 60 * 60 * 1000;
        long offset = (long)(Math.floor(1.0*now/onDay) - Math.floor(1.0*time/onDay));
        //int offset = (int)(intervalMill/(24 * 60 * 60 * 1000));

        String pre = "";
        if(offset == -1){
            pre = "明天";
        }else if(offset == 0){ //今天
                pre = "今天 ";
//            date = String.format(DATE_FORMAT_TODAY, timeHour, timeMin);
        }else if(offset == 1){//昨天
            pre = "昨天 ";
//            date = String.format(DATE_FORMAT_YESTERDAY, mYESTERDAY,timeHour, timeMin);
        }else if (nowYear == timeYear){//同一年
//            date = String.format(DATE_FORMAT, timeMonth, timeDay, timeHour, timeMin);
        }

        date = pre + String.format(DATE_FORMAT_FULL, timeYear, timeMonth, timeDay,timeHour, timeMin);
        return date;
    }


    public static final String getHourMins(long timemillis) {
        // 14463900
        Date d = new Date(timemillis);
        return hhmm.format(d);
    }
    public static final String getDisplayTimeForBLOGLIST(long time){
        //当前的时间
        Calendar now = Calendar.getInstance();
        //要计算的时间
        Calendar d = Calendar.getInstance();
        d.setTimeInMillis(time);

        long nowTime = now.getTimeInMillis();
//      //times000是今天0点时刻与输入时间的比较差值
//      //times是当前时间与输入时间的比较差值

        long todaytime0 =  (nowTime -
                (now.get(Calendar.HOUR_OF_DAY)*60*60*1000) -
                (now.get(Calendar.MINUTE)*60*1000) -
                (now.get(Calendar.SECOND)*1000) ) ;

        long times = nowTime - d.getTimeInMillis();

        long times000 = todaytime0 - d.getTimeInMillis();


        if (times < 0) {
            int yearOfPubDate = d.get(Calendar.YEAR);
            int monOfPubDate = d.get(Calendar.MONTH) + 1;
            int dayOfPubDate = d.get(Calendar.DATE);
            int yearOfToday = now.get(Calendar.YEAR);
            int dayOfToday = now.get(Calendar.DATE);
            if (yearOfToday != yearOfPubDate) {
                return yearOfPubDate + "年" + doubleD(monOfPubDate) + "月"
                        + doubleD(dayOfPubDate)+"日";
            } else if(dayOfPubDate != dayOfToday) {
                return doubleD(d.get(Calendar.MONTH) + 1) + "月" + doubleD(d.get(Calendar.DATE))
                        + "日" + doubleD(d.get(Calendar.HOUR_OF_DAY)) + COLON
                        + doubleD(d.get(Calendar.MINUTE));
            } else {
                return doubleD(d.get(Calendar.HOUR_OF_DAY)) + COLON
                        + doubleD(d.get(Calendar.MINUTE));
            }
        }
        times = times / 1000;

        if(times >= 0 && times000 < 0) {
            int hourOfPubDate = d.get(Calendar.HOUR_OF_DAY);
            int minOfPubDate = d.get(Calendar.MINUTE);
            return TODAY+doubleD(hourOfPubDate) + COLON
                    + doubleD(minOfPubDate);
        }/*

		if (times >= 0 && times < 60) {
			return JUST_MINS;// "刚刚";
		} else if (times >= 60 && times < 60 * 60) {
			return times / 60 + MINS_AGO;// "分钟前";
		} else if (times000 < 0) {
			return times / (60 * 60) + HOURS_AGO;// "小时前";
		}*/ else if (times000 >= 0 && times000 < 60 * 60 * 24 * 1000) {

            int hourOfPubDate = d.get(Calendar.HOUR_OF_DAY);
            int minOfPubDate = d.get(Calendar.MINUTE);
            return YESTERDAY + doubleD(hourOfPubDate) + COLON
                    + doubleD(minOfPubDate);
        } else if (times000 >= 60 * 60 * 24 * 1000
                && times000 < 60 * 60 * 24 * 2 * 1000) {

            int hourOfPubDate = d.get(Calendar.HOUR_OF_DAY);
            int minOfPubDate = d.get(Calendar.MINUTE);
            return BEFOREY_YESTERDAY + doubleD(hourOfPubDate) + COLON
                    + doubleD(minOfPubDate);
        } else if (times000 >= 60 * 60 * 24 * 2 * 1000) {

            int yearOfPubDate = d.get(Calendar.YEAR);
            int monOfPubDate = d.get(Calendar.MONTH) + 1;
            int dayOfPubDate = d.get(Calendar.DATE);
            int yearOfToday = now.get(Calendar.YEAR);
            if (yearOfToday != yearOfPubDate) {
                return yearOfPubDate + "年" + doubleD(monOfPubDate) + "月"
                        + doubleD(dayOfPubDate)+"日" ;
            } else {
                return doubleD(monOfPubDate) + "月" + doubleD(dayOfPubDate)
                        +"日"+ doubleD(d.get(Calendar.HOUR_OF_DAY)) + COLON
                        + doubleD(d.get(Calendar.MINUTE));
            }
        }

        return "";
    }

    public static final String getDisplayTimeForTalk(long time){
        //当前的时间
        Calendar now = Calendar.getInstance();
        //要计算的时间
        Calendar d = Calendar.getInstance();
        d.setTimeInMillis(time);

        long nowTime = now.getTimeInMillis();
//      //times000是今天0点时刻与输入时间的比较差值
//      //times是当前时间与输入时间的比较差值

        long todaytime0 =  (nowTime -
                (now.get(Calendar.HOUR_OF_DAY)*60*60*1000) -
                (now.get(Calendar.MINUTE)*60*1000) -
                (now.get(Calendar.SECOND)*1000) ) ;

        long times = nowTime - d.getTimeInMillis();

        long times000 = todaytime0 - d.getTimeInMillis();


        if (times < 0) {
            int yearOfPubDate = d.get(Calendar.YEAR);
            int monOfPubDate = d.get(Calendar.MONTH) + 1;
            int dayOfPubDate = d.get(Calendar.DATE);
            int yearOfToday = now.get(Calendar.YEAR);
            int dayOfToday = now.get(Calendar.DATE);
            if (yearOfToday != yearOfPubDate) {
                return yearOfPubDate + "年" + doubleD(monOfPubDate) + "月"
                        + doubleD(dayOfPubDate)+"日";
            } else if(dayOfPubDate != dayOfToday) {
                return doubleD(d.get(Calendar.MONTH) + 1) + "月" + doubleD(d.get(Calendar.DATE))
                        + "日" + doubleD(d.get(Calendar.HOUR_OF_DAY)) + DIAN
                        + doubleD(d.get(Calendar.MINUTE))+MIN;
            } else {
                return doubleD(d.get(Calendar.HOUR_OF_DAY)) + DIAN
                        + doubleD(d.get(Calendar.MINUTE))+MIN;
            }
        }
        times = times / 1000;

        if(times >= 0 && times000 < 0) {
            int hourOfPubDate = d.get(Calendar.HOUR_OF_DAY);
            int minOfPubDate = d.get(Calendar.MINUTE);
            return TODAY+doubleD(hourOfPubDate) + DIAN
                    + doubleD(minOfPubDate)+MIN;
        }/*

		if (times >= 0 && times < 60) {
			return JUST_MINS;// "刚刚";
		} else if (times >= 60 && times < 60 * 60) {
			return times / 60 + MINS_AGO;// "分钟前";
		} else if (times000 < 0) {
			return times / (60 * 60) + HOURS_AGO;// "小时前";
		}*/ else if (times000 >= 0 && times000 < 60 * 60 * 24 * 1000) {

            int hourOfPubDate = d.get(Calendar.HOUR_OF_DAY);
            int minOfPubDate = d.get(Calendar.MINUTE);
            return YESTERDAY + doubleD(hourOfPubDate) + DIAN
                    + doubleD(minOfPubDate)+MIN;
        } else if (times000 >= 60 * 60 * 24 * 1000
                && times000 < 60 * 60 * 24 * 2 * 1000) {

            int hourOfPubDate = d.get(Calendar.HOUR_OF_DAY);
            int minOfPubDate = d.get(Calendar.MINUTE);
            return BEFOREY_YESTERDAY + doubleD(hourOfPubDate) + DIAN
                    + doubleD(minOfPubDate)+MIN;
        } else if (times000 >= 60 * 60 * 24 * 2 * 1000) {

            int yearOfPubDate = d.get(Calendar.YEAR);
            int monOfPubDate = d.get(Calendar.MONTH) + 1;
            int dayOfPubDate = d.get(Calendar.DATE);
            int yearOfToday = now.get(Calendar.YEAR);
            if (yearOfToday != yearOfPubDate) {
                return yearOfPubDate + "年" + doubleD(monOfPubDate) + "月"
                        + doubleD(dayOfPubDate)+"日" ;
            } else {
                return doubleD(monOfPubDate) + "月" + doubleD(dayOfPubDate)
                        +"日"+ doubleD(d.get(Calendar.HOUR_OF_DAY)) + DIAN
                        + doubleD(d.get(Calendar.MINUTE))+MIN;
            }
        }

        return "";
    }
    //为了不增加方法数，就在这里加标识
    //beforeYesterdayNeedShowHour 今年三天前的是否需要显示小时和分钟
    public static final String getDisplayTime(long time,boolean beforeYesterdayNeedShowHour){
        //当前的时间
        Calendar now = Calendar.getInstance();
        //要计算的时间
        Calendar d = Calendar.getInstance();
        d.setTimeInMillis(time);

        long nowTime = now.getTimeInMillis();
//      //times000是今天0点时刻与输入时间的比较差值
//      //times是当前时间与输入时间的比较差值

        long todaytime0 =  (nowTime -
                (now.get(Calendar.HOUR_OF_DAY)*60*60*1000) -
                (now.get(Calendar.MINUTE)*60*1000) -
                (now.get(Calendar.SECOND)*1000) ) ;

        long times = nowTime - d.getTimeInMillis();

        long times000 = todaytime0 - d.getTimeInMillis();


        if (times < 0) {
            int yearOfPubDate = d.get(Calendar.YEAR);
            int monOfPubDate = d.get(Calendar.MONTH) + 1;
            int dayOfPubDate = d.get(Calendar.DATE);
            int yearOfToday = now.get(Calendar.YEAR);
            int dayOfToday = now.get(Calendar.DATE);
            if (yearOfToday != yearOfPubDate) {
                return yearOfPubDate + "-" + doubleD(monOfPubDate) + "-"
                        + doubleD(dayOfPubDate);
            } else if(dayOfPubDate != dayOfToday) {
                return doubleD(d.get(Calendar.MONTH) + 1) + "-" + doubleD(d.get(Calendar.DATE))
                        + " " + doubleD(d.get(Calendar.HOUR_OF_DAY)) + COLON
                        + doubleD(d.get(Calendar.MINUTE));
            } else {
                return TODAY + doubleD(d.get(Calendar.HOUR_OF_DAY)) + COLON
                        + doubleD(d.get(Calendar.MINUTE));
            }
        }
        times = times / 1000;

        if(times >= 0 && times000 < 0) {
            int hourOfPubDate = d.get(Calendar.HOUR_OF_DAY);
            int minOfPubDate = d.get(Calendar.MINUTE);
            return TODAY + doubleD(hourOfPubDate) + COLON
                    + doubleD(minOfPubDate);
        }/*

		if (times >= 0 && times < 60) {
			return JUST_MINS;// "刚刚";
		} else if (times >= 60 && times < 60 * 60) {
			return times / 60 + MINS_AGO;// "分钟前";
		} else if (times000 < 0) {
			return times / (60 * 60) + HOURS_AGO;// "小时前";
		}*/ else if (times000 >= 0 && times000 < 60 * 60 * 24 * 1000) {

            int hourOfPubDate = d.get(Calendar.HOUR_OF_DAY);
            int minOfPubDate = d.get(Calendar.MINUTE);
            return YESTERDAY + doubleD(hourOfPubDate) + COLON
                    + doubleD(minOfPubDate);
        } else if (times000 >= 60 * 60 * 24 * 1000
                && times000 < 60 * 60 * 24 * 2 * 1000) {

            int hourOfPubDate = d.get(Calendar.HOUR_OF_DAY);
            int minOfPubDate = d.get(Calendar.MINUTE);
            return BEFOREY_YESTERDAY + doubleD(hourOfPubDate) + COLON
                    + doubleD(minOfPubDate);
        } else if (times000 >= 60 * 60 * 24 * 2 * 1000) {

            int yearOfPubDate = d.get(Calendar.YEAR);
            int monOfPubDate = d.get(Calendar.MONTH) + 1;
            int dayOfPubDate = d.get(Calendar.DATE);
            int yearOfToday = now.get(Calendar.YEAR);
            if (yearOfToday != yearOfPubDate) {
                return yearOfPubDate + "-" + doubleD(monOfPubDate) + "-"
                        + doubleD(dayOfPubDate) ;
            } else {
                if(beforeYesterdayNeedShowHour){

                    return doubleD(monOfPubDate) + "-" + doubleD(dayOfPubDate)
                            +" "+ doubleD(d.get(Calendar.HOUR_OF_DAY)) + COLON
                            + doubleD(d.get(Calendar.MINUTE));
                }else{
                    return doubleD(monOfPubDate) + "-" + doubleD(dayOfPubDate);
                }
            }
        }

        return "";
    }


    public static final String getDisplayTimeForPhotoList(long time){
        Calendar now = Calendar.getInstance();
        long todaytime0 =  (now.getTimeInMillis() -
                (now.get(Calendar.HOUR_OF_DAY)*60*60*1000) -
                (now.get(Calendar.MINUTE)*60*1000) -
                (now.get(Calendar.SECOND)*1000) ) ;

        Calendar date = Calendar.getInstance();
        date.setTimeInMillis(time);

        //times是当前时间与输入时间的比较差值
        long times = now.getTimeInMillis() - time;

        //times000是今天0点时刻与输入时间的比较差值
        long times000 = todaytime0 - time;

        if (times >= 0) {
            if (times000 < 0) { // 当天
                return TODAY;
            }
            else if (times000 >= 0 && times000 < DAY_SECOND*1000) {   // 昨天
                return YESTERDAY;
            } else if (times000 >= DAY_SECOND*1000 && times000 < TWO_DAY_SECOND*1000) { // 前天
                return BEFOREY_YESTERDAY;
            }
        }else{
            if (times000 < 0) {
                if(isSameDay(now.getTimeInMillis(), time)){
                    return TODAY;
                }
            }
        }

        int yearOfPubDate = date.get(Calendar.YEAR);
        int monOfPubDate = date.get(Calendar.MONTH)+1;
        int dayOfPubDate = date.get(Calendar.DAY_OF_MONTH);
        int yearOfToday = now.get(Calendar.YEAR);
        if (yearOfToday != yearOfPubDate) {
            return yearOfPubDate + YEAR + doubleD(monOfPubDate) + MONTH + doubleD(dayOfPubDate) + DAY ;
        } else {
            return doubleD(monOfPubDate) + MONTH + doubleD(dayOfPubDate) + DAY ;
        }

    }

    public static final String getDisplayTimeforpassive(long time){
        //当前的时间
        Calendar now = Calendar.getInstance();
        //要计算的时间
        Calendar d = Calendar.getInstance();
        d.setTimeInMillis(time);

        long nowTime = now.getTimeInMillis();
//      //times000是今天0点时刻与输入时间的比较差值
//      //times是当前时间与输入时间的比较差值

        long todaytime0 =  (nowTime -
                (now.get(Calendar.HOUR_OF_DAY)*60*60*1000) -
                (now.get(Calendar.MINUTE)*60*1000) -
                (now.get(Calendar.SECOND)*1000) ) ;

        long times = nowTime - d.getTimeInMillis();

        long times000 = todaytime0 - d.getTimeInMillis();


        if (times < 0) {
            int yearOfPubDate = d.get(Calendar.YEAR);
            int monOfPubDate = d.get(Calendar.MONTH) + 1;
            int dayOfPubDate = d.get(Calendar.DATE);
            int yearOfToday = now.get(Calendar.YEAR);
            int monOfToday = now.get(Calendar.MONTH) + 1;
            if (yearOfToday != yearOfPubDate) {
                return yearOfPubDate + "-" + doubleD(monOfPubDate) + "-"
                        + doubleD(dayOfPubDate);
            } else if(monOfPubDate != monOfToday) {
                return doubleD(d.get(Calendar.MONTH) + 1) + "-" + doubleD(d.get(Calendar.DATE))
                        + " " + doubleD(d.get(Calendar.HOUR_OF_DAY)) + COLON
                        + doubleD(d.get(Calendar.MINUTE));
            } else {
                return TODAY + doubleD(d.get(Calendar.HOUR_OF_DAY)) + COLON
                        + doubleD(d.get(Calendar.MINUTE));
            }
        }
        times = times / 1000;

        if(times >= 0 && times000 < 0) {
            int hourOfPubDate = d.get(Calendar.HOUR_OF_DAY);
            int minOfPubDate = d.get(Calendar.MINUTE);
            return TODAY + doubleD(hourOfPubDate) + COLON
                    + doubleD(minOfPubDate);
        }/*

		if (times >= 0 && times < 60) {
			return JUST_MINS;// "刚刚";
		} else if (times >= 60 && times < 60 * 60) {
			return times / 60 + MINS_AGO;// "分钟前";
		} else if (times000 < 0) {
			return times / (60 * 60) + HOURS_AGO;// "小时前";
		}*/ else if (times000 >= 0 && times000 < 60 * 60 * 24 * 1000) {

            int hourOfPubDate = d.get(Calendar.HOUR_OF_DAY);
            int minOfPubDate = d.get(Calendar.MINUTE);
            return YESTERDAY + doubleD(hourOfPubDate) + COLON
                    + doubleD(minOfPubDate);
        } else if (times000 >= 60 * 60 * 24 * 1000
                && times000 < 60 * 60 * 24 * 2 * 1000) {

            int hourOfPubDate = d.get(Calendar.HOUR_OF_DAY);
            int minOfPubDate = d.get(Calendar.MINUTE);
            return BEFOREY_YESTERDAY+ doubleD(hourOfPubDate) + COLON
                    + doubleD(minOfPubDate);
        } else if (times000 >= 60 * 60 * 24 * 2 * 1000) {

            int yearOfPubDate = d.get(Calendar.YEAR);
            int monOfPubDate = d.get(Calendar.MONTH) + 1;
            int dayOfPubDate = d.get(Calendar.DATE);
            int yearOfToday = now.get(Calendar.YEAR);
            if (yearOfToday != yearOfPubDate) {
                return yearOfPubDate + "-" + doubleD(monOfPubDate) + "-"
                        + doubleD(dayOfPubDate) ;
            } else {
                return doubleD(monOfPubDate) + "-" + doubleD(dayOfPubDate)
                        +" "+ doubleD(d.get(Calendar.HOUR_OF_DAY)) + COLON
                        + doubleD(d.get(Calendar.MINUTE));
            }
        }

        return "";
    }

// TODO Remove unused code found by UCDetector
// 	public static final String getDisplayTime2(Date d) {
//
// 		Date now = new Date();
//
// 		long between = (now.getTime() - d.getTime()) / 1000;// 除以1000是为了转换成秒
//
// 		long day = between / (24 * 3600);
//
// 		long hour = between % (24 * 3600) / 3600;
//
// 		long min = between % 3600 / 60;
//
// 	//	long second = between % 60 / 60;
//
// 		if (day > 0) {
// 			if (day == 1) {
// 				return YESTERDAY + d.getHours() + HOUR + COLON + d.getMinutes()
// 						+ MIN;
// 			} else if (day == 2) {
// 				return BEFOREY_YESTERDAY + d.getHours() + HOUR + COLON
// 						+ d.getMinutes() + MIN;
// 			} else if (day < 30) {
// 				return day + DAYS_AGO;
// 			} else if (day >= 30) {
// 				return day / 30 + MONTH_AGO;
// 			}
// 		} else if (day <= 0 && hour >= 1) {
// 			return hour + HOURS_AGO;
// 		} else if (min > 0) {
// 			return min + MINS_AGO;
// 		} else {
// 			return JUST_MINS;
// 		}
// 		return "";
// 	}

    /**
     * 判断两个时间戳是否同一天
     */
    public static boolean isSameDay(long time, long anotherTime) {
        Calendar current = Calendar.getInstance();
        current.setTimeInMillis(time);

        Calendar last = Calendar.getInstance();
        last.setTimeInMillis(anotherTime);

        if ((current.get(Calendar.YEAR) == last.get(Calendar.YEAR))
                && (current.get(Calendar.DAY_OF_YEAR) == last.get(Calendar.DAY_OF_YEAR))) {
            return true;
        }

        return false;
    }

    /**
     * 判断两个时间戳是否同一年
     */
    public static boolean isSameYear(long time, long anotherTime) {
        Calendar current = Calendar.getInstance();
        current.setTimeInMillis(time);

        Calendar last = Calendar.getInstance();
        last.setTimeInMillis(anotherTime);

        if (current.get(Calendar.YEAR) == last.get(Calendar.YEAR)) {
            return true;
        }
        return false;
    }

    public static boolean isNowYear(long time){
        return isSameYear(time, System.currentTimeMillis());
    }

    public static String getYear(long time){
        Calendar current = Calendar.getInstance();
        current.setTimeInMillis(time);
        int year = current.get(Calendar.YEAR);
        return String.valueOf(year);
    }
    /**
     * 计算给定日期，到现在差多少个小时。
     *
     * @param d
     * @return
     */
//	public static long getHourOffset(Date d) {
//		Date now = new Date();
//
//		long between = (now.getTime() - d.getTime()) / 1000;// 除以1000是为了转换成秒
//		return between % (24 * 3600) / 3600;
//	}
//
//	public static long getHourOffset(int d) {
//		Date dd = new Date(d * 1000L);
//		Date now = new Date();
//
//		long between = (now.getTime() - dd.getTime()) / 1000;// 除以1000是为了转换成秒
//		return between / 3600;
//	}

//	public static final SimpleDateFormat sdf = new SimpleDateFormat(
//			"yyyy-MM-dd HH:mm", Locale.CHINA);
//	public static final SimpleDateFormat birth = new SimpleDateFormat(
//			"yyyy-MM-dd");
//	public static final SimpleDateFormat sdf2 = new SimpleDateFormat(
//			"yyyy-MM-dd-HHmmss", Locale.CHINA);
    public static final SimpleDateFormat hhmm = new SimpleDateFormat(
            "HH:mm", Locale.CHINA);
//	/**
//	 * 兼容评论回复时间是8位数的错误，去掉年字段
//	 */
//	public static final SimpleDateFormat sdf_withoutYear = new SimpleDateFormat(
//			"MM月dd日 HH:mm", Locale.CHINA);

    /**
     * 当前是否在指定时间范围内。ms为单位
     * @param start
     * @param end
     * @return
     */
    public static boolean isInTimeNow(int start, int end) {
        Calendar calendar = new ThreadLocal<Calendar>() {
            protected Calendar initialValue() {
                return Calendar.getInstance();
            }
        }.get();
        long current = System.currentTimeMillis();
        calendar.setTimeInMillis(current);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        long originToday = calendar.getTimeInMillis();
        long distance = current - originToday;
        if(start <= distance && distance <= end) {
            return true;
        }

        return false;
    }

    public static final SimpleDateFormat sdf2 = new SimpleDateFormat(
            "yyyy-MM-dd-HHmmss", Locale.CHINA);

    public static String getDateStringWithoutSpace(long time) {
        Date d = new Date(time);
        return sdf2.format(d);
    }

    /**
     * 上传照片默认描述用的时间
     */
    public static final String getDisplayTimeForUploadDes() {
        //当前的时间
        Calendar now = Calendar.getInstance();
        return "上传于 "+doubleD(now.get(Calendar.MONTH) + 1) + "月" + doubleD(now.get(Calendar.DATE))
                + "日" +" ";

    }
}
