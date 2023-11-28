import type { ClientDate, FlooredDates, GetNameOfDay } from '@/components/TheTable/types';

export const months = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек'
];

export const getNameOfDay: GetNameOfDay = (day = 1) => {
  const dayNameMap = {
    minus: 'назад',
    yesterday: 'вчера',
    today: 'сегодня',
    tomorrow: 'завтра',
    one: 'день',
    few: 'дня',
    many: 'дней'
  };

  const stringDay = String(Math.abs(day));

  if (day === -1) {
    return dayNameMap['yesterday'];
  }

  if (day === 0) {
    return dayNameMap['today'];
  }

  if (day === 1) {
    return dayNameMap['tomorrow'];
  }

  const endOfDayName: GetNameOfDay = (day = 1) => {
    if (day === 1) {
      return dayNameMap['one'];
    } else if (day === 2 || day === 3 || day === 4) {
      return dayNameMap['few'];
    } else if (day === 0 || (day >= 5 && day <= 9)) {
      return dayNameMap['many'];
    } else {
      return dayNameMap['many'];
    }
  };

  const getPositiveNameOfDay: GetNameOfDay = (day = 1) => {
    if (day === 2 || day === 3 || day === 4) {
      return dayNameMap['few'];
    } else if (day >= 5 && day <= 20) {
      return dayNameMap['many'];
    } else if (day > 20) {
      if (stringDay[stringDay.length - 2] === '1') {
        return dayNameMap['many'];
      } else {
        return endOfDayName(+stringDay[stringDay.length - 1]);
      }
    } else {
      return dayNameMap['many'];
    }
  };

  if (day > 1) {
    return `${getPositiveNameOfDay(day)}`;
  } else {
    return `${getPositiveNameOfDay(Math.abs(day))} ${dayNameMap['minus']}`;
  }
};

function getFlooredDates(date: ClientDate): FlooredDates {
  const startDate: number = new Date(date.start_date).getTime() / 1000 / 60 / 60 / 24;
  const endDate: number = new Date(date.end_date).getTime() / 1000 / 60 / 60 / 24;
  const now: number = new Date().getTime() / 1000 / 60 / 60 / 24;

  const startDateFloor: number = Math.floor(startDate);
  const endDateFloor: number = Math.floor(endDate);
  const nowFloor: number = Math.floor(now);

  return { startDateFloor, endDateFloor, nowFloor };
}

export const getStartOrEndText = (date: ClientDate, behavior?: keyof ClientDate): string => {
  const { startDateFloor, endDateFloor, nowFloor } = getFlooredDates(date);

  switch (behavior) {
    case 'start_date': {
      if (startDateFloor === nowFloor || startDateFloor === nowFloor + 1) {
        return 'Начинается';
      } else if (startDateFloor > nowFloor + 1) {
        return 'Начинается через';
      } else {
        return 'Началось';
      }
    }
    case 'end_date': {
      if (endDateFloor === nowFloor || endDateFloor === nowFloor + 1) {
        return 'Заканчивается';
      } else if (endDateFloor > nowFloor) {
        return 'Заканчивается через';
      } else {
        return 'Закончилось';
      }
    }
    default: {
      if (startDateFloor === endDateFloor) {
        if (startDateFloor === nowFloor) {
          return 'Начинается и заканчивается';
        } else if (startDateFloor > nowFloor) {
          return 'Начинается и заканчивается через';
        } else if (startDateFloor < nowFloor) {
          return 'Началось и закончилось';
        }
      }

      if (startDateFloor === nowFloor) {
        return 'Начинается';
      }

      if (endDateFloor === nowFloor) {
        return 'Заканчивается';
      }

      if (startDateFloor > nowFloor) {
        if (startDateFloor > nowFloor + 1) {
          return 'Начинается через';
        } else {
          return 'Начинается';
        }
      } else {
        if (endDateFloor > nowFloor) {
          if (endDateFloor > nowFloor + 1) {
            return 'Заканчивается через';
          } else {
            return 'Заканчивается';
          }
        } else {
          return 'Закончилось';
        }
      }
    }
  }
};

export const getNumberOfDays = (date: ClientDate, behavior?: keyof ClientDate): number => {
  const { startDateFloor, endDateFloor, nowFloor } = getFlooredDates(date);

  switch (behavior) {
    case 'start_date': {
      return startDateFloor - nowFloor;
    }
    case 'end_date': {
      return endDateFloor - nowFloor;
    }
    default: {
      if (startDateFloor === endDateFloor) {
        return startDateFloor - nowFloor;
      }

      if (startDateFloor > nowFloor) {
        return startDateFloor - nowFloor;
      } else {
        return endDateFloor - nowFloor;
      }
    }
  }
};
