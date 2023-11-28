<script setup lang="ts">
import data from '@/data.json';
import { computed, reactive, ref, watch } from 'vue';
import type {
  Client,
  ClientDate,
  ObjectWithInternalClientProps,
  SortDirection,
  SortOption,
  SortType
} from '@/components/TheTable/types';
import { getNameOfDay, getNumberOfDays, getStartOrEndText, months } from './helpers';

const initialClients: Array<Client> = reactive(data as Array<Client>);
const clients: Array<Client> = reactive([...initialClients]);
const filteredClients: Array<Client> = reactive([]);

const sortDirection: SortDirection = reactive({
  o_id: 'none',
  client_name: 'none',
  diets: 'none',
  tariff: 'none',
  address: 'none',
  phone: 'none',
  dates: 'none',
  discount: 'none',
  payment: 'none',
  payment_method: 'none',
  courier_comment: 'none',
  inner_comment: 'none',
  status: 'none'
});

function changeSortDirection(sortDirection: SortDirection, sortBy?: keyof SortDirection): void {
  for (let key of Object.keys(sortDirection)) {
    if (key === sortBy) {
      if (sortDirection[sortBy] === 'asc') {
        sortDirection[sortBy] = 'desc';
      } else if (sortDirection[sortBy] === 'desc') {
        sortDirection[sortBy] = 'asc';
      } else if (sortDirection[sortBy] === 'none') {
        sortDirection[sortBy] = 'asc';
      }
    } else {
      sortDirection[key as keyof SortDirection] = 'none';
    }
  }
}

function getSortedClientsByNumber(
  clients: Array<Client>,
  clientSortBy: keyof Client,
  sort: boolean
): void {
  clients.sort((a: Client, b: Client) =>
    sort ? (a[clientSortBy] > b[clientSortBy] ? 1 : -1) : b[clientSortBy] > a[clientSortBy] ? 1 : -1
  );
}

function clientNumberSort(sortBy: keyof SortDirection): void {
  statusSortSelected.value = '';
  let clientSortBy: keyof Client = 'o_id';

  switch (sortBy) {
    case 'o_id': {
      clientSortBy = 'o_id';
      break;
    }
    case 'discount': {
      clientSortBy = 'discount';
      break;
    }
  }

  changeSortDirection(sortDirection, sortBy);

  if (sortDirection[sortBy] === 'asc') {
    getSortedClientsByNumber(clients, clientSortBy, true);
  } else if (sortDirection[sortBy] === 'desc') {
    getSortedClientsByNumber(clients, clientSortBy, false);
  }

  return undefined;
}

function getSortedClientsByString(
  clients: Array<Client>,
  clientSortBy: keyof Client,
  sort: boolean
): void {
  clients.sort((a: Client, b: Client) =>
    sort
      ? (a[clientSortBy] ? String(a[clientSortBy]) : '').localeCompare(
          b[clientSortBy] ? String(b[clientSortBy]) : ''
        )
      : (b[clientSortBy] ? String(b[clientSortBy]) : '').localeCompare(
          a[clientSortBy] ? String(a[clientSortBy]) : ''
        )
  );
}

function clientStringSort(sortBy: keyof SortDirection): void {
  statusSortSelected.value = '';

  let clientSortBy: keyof Client = 'client_name';

  switch (sortBy) {
    case 'client_name': {
      clientSortBy = 'client_name';
      break;
    }
    case 'address': {
      clientSortBy = 'address';
      break;
    }
    case 'payment': {
      clientSortBy = 'pay_status';
      break;
    }
    case 'payment_method': {
      clientSortBy = 'order_payed';
      break;
    }
    case 'courier_comment': {
      clientSortBy = 'courier_comment';
      break;
    }
    case 'inner_comment': {
      clientSortBy = 'inner_comment';
      break;
    }
  }

  changeSortDirection(sortDirection, sortBy);

  if (sortBy === 'payment' || sortBy === 'payment_method') {
    if (sortDirection[sortBy] === 'desc') {
      getSortedClientsByString(clients, clientSortBy, true);
    } else if (sortDirection[sortBy] === 'asc') {
      getSortedClientsByString(clients, clientSortBy, false);
    }
  } else {
    if (sortDirection[sortBy] === 'asc') {
      getSortedClientsByString(clients, clientSortBy, true);
    } else if (sortDirection[sortBy] === 'desc') {
      getSortedClientsByString(clients, clientSortBy, false);
    }
  }

  return undefined;
}

function getSortedClientsByArrayString(
  clients: Array<Client>,
  clientSortBy: keyof Client,
  withNumber: boolean,
  sort: boolean
): void {
  clients.sort((a: Client, b: Client) => {
    const arrA = a[clientSortBy] as Array<string>;
    const arrB = b[clientSortBy] as Array<string>;

    if (withNumber) {
      const valueA = arrA[0].match(/\d+/);
      const valueB = arrB[0].match(/\d+/);

      const numA = parseInt(valueA ? valueA.toString() : '');
      const numB = parseInt(valueB ? valueB.toString() : '');

      return sort ? (numA > numB ? 1 : -1) : numB > numA ? 1 : -1;
    } else {
      return sort
        ? String(arrA[0]).localeCompare(String(arrB[0]))
        : String(arrB[0]).localeCompare(String(arrA[0]));
    }
  });
}

const multiParameterColumns: Array<keyof Client> = ['diets', 'tariff', 'dates'];

function getSortedObjectWithInternalStringProps(
  arrObj: Array<ObjectWithInternalClientProps<string>>,
  withNumber: boolean,
  sort: boolean
) {
  withNumber
    ? arrObj.sort(
        (a: ObjectWithInternalClientProps<string>, b: ObjectWithInternalClientProps<string>) => {
          const valueA = a.item.match(/\d+/);
          const valueB = b.item.match(/\d+/);

          const numA = parseInt(valueA ? valueA.toString() : '');
          const numB = parseInt(valueB ? valueB.toString() : '');

          return sort ? (numA > numB ? 1 : -1) : numB > numA ? 1 : -1;
        }
      )
    : arrObj.sort(
        (a: ObjectWithInternalClientProps<string>, b: ObjectWithInternalClientProps<string>) => {
          return sort ? a.item.localeCompare(b.item) : b.item.localeCompare(a.item);
        }
      );
}

function getSortedClientByArrayString(
  clients: Array<Client>,
  clientSortBy: keyof Client,
  withNumber: boolean,
  sort: boolean
): void {
  clients.forEach((client) => {
    const arr = client[clientSortBy] as Array<string>;

    if (arr.length > 1) {
      const arrObj: Array<ObjectWithInternalClientProps<string>> = arr.map((item, index) => {
        return {
          index,
          item
        };
      });

      withNumber
        ? getSortedObjectWithInternalStringProps(arrObj, true, sort)
        : getSortedObjectWithInternalStringProps(arrObj, false, sort);

      const newKeysArray: Array<number> = arrObj.map((item) => item.index);

      multiParameterColumns.map((column) => {
        const columnArr: Array<string | ClientDate> = client[column] as Array<string | ClientDate>;
        const newArr: Array<string | ClientDate> = [];

        newKeysArray.map((key) => {
          newArr.push(columnArr[key]);
        });

        (client[column] as Array<string | ClientDate>) = newArr;
      });
    }
  });
}

const clientsArraySort = (sortBy: keyof SortDirection): void => {
  statusSortSelected.value = '';
  let clientSortBy: keyof Client = 'diets';

  switch (sortBy) {
    case 'diets': {
      clientSortBy = 'diets';
      break;
    }
    case 'tariff': {
      clientSortBy = 'tariff';
      break;
    }
  }

  changeSortDirection(sortDirection, sortBy);

  switch (sortBy) {
    case 'diets': {
      if (sortDirection[sortBy] === 'asc') {
        getSortedClientByArrayString(clients, clientSortBy, true, true);
        getSortedClientsByArrayString(clients, clientSortBy, true, true);
      } else if (sortDirection[sortBy] === 'desc') {
        getSortedClientByArrayString(clients, clientSortBy, true, false);
        getSortedClientsByArrayString(clients, clientSortBy, true, false);
      }

      return undefined;
    }
    case 'tariff': {
      if (sortDirection[sortBy] === 'asc') {
        getSortedClientByArrayString(clients, clientSortBy, false, true);
        getSortedClientsByArrayString(clients, clientSortBy, false, true);
      } else if (sortDirection[sortBy] === 'desc') {
        getSortedClientByArrayString(clients, clientSortBy, false, false);
        getSortedClientsByArrayString(clients, clientSortBy, false, false);
      }

      return undefined;
    }
  }
};

function getSortedObjectWithInternalDateProps(
  arrObj: Array<ObjectWithInternalClientProps<ClientDate>>,
  sortDate: keyof ClientDate,
  sort: boolean
) {
  arrObj.sort(
    (
      a: ObjectWithInternalClientProps<ClientDate>,
      b: ObjectWithInternalClientProps<ClientDate>
    ) => {
      const aDays = getNumberOfDays(a.item, sortDate);
      const bDays = getNumberOfDays(b.item, sortDate);

      return sort ? (aDays > bDays ? 1 : -1) : bDays > aDays ? 1 : -1;
    }
  );
}

function getSortedClientByArrayDates(
  clients: Array<Client>,
  clientSortBy: keyof Client,
  sortDate: keyof ClientDate,
  sort: boolean
): void {
  clients.forEach((client) => {
    const arr = client[clientSortBy] as Array<ClientDate>;

    if (arr.length > 1) {
      const arrObj: Array<ObjectWithInternalClientProps<ClientDate>> = arr.map((item, index) => {
        return {
          index,
          item
        };
      });

      getSortedObjectWithInternalDateProps(arrObj, sortDate, sort);

      const newKeysArray: Array<number> = arrObj.map((item) => item.index);

      multiParameterColumns.map((column) => {
        const columnArr: Array<string | ClientDate> = client[column] as Array<string | ClientDate>;
        const newArr: Array<string | ClientDate> = [];

        newKeysArray.map((key) => {
          newArr.push(columnArr[key]);
        });

        (client[column] as Array<string | ClientDate>) = newArr;
      });
    }
  });
}

function getSortedClientsByArrayDates(
  clients: Array<Client>,
  clientSortBy: keyof Client,
  sortDate: keyof ClientDate,
  sortType: SortType,
  sort: boolean
): void {
  clients.sort((a: Client, b: Client) => {
    const valA = a[clientSortBy] as Array<ClientDate>;
    const valB = b[clientSortBy] as Array<ClientDate>;

    const valADays = getNumberOfDays(valA[0], sortDate);
    const valBDays = getNumberOfDays(valB[0], sortDate);

    switch (sortType) {
      case 'start': {
        if (valADays >= 0 && valBDays >= 0) {
          return valADays < valBDays ? 1 : -1;
        } else {
          return valADays < valBDays ? 1 : -1;
        }
      }
      case 'end-today':
      case 'end-tomorrow':
      case 'end': {
        if (valADays >= 0 && valBDays >= 0) {
          return valADays > valBDays ? 1 : -1;
        } else {
          return valADays < valBDays ? 1 : -1;
        }
      }
      case 'ended': {
        if (valADays < 0 && valBDays < 0) {
          return valADays < valBDays ? 1 : -1;
        } else {
          return valADays > valBDays ? 1 : -1;
        }
      }
      default: {
        return sort ? (valADays > valBDays ? 1 : -1) : valADays < valBDays ? 1 : -1;
      }
    }
  });

  if (sortType === '') {
    return undefined;
  }

  const startClients = clients.filter((client) => {
    const clientDates = client[clientSortBy] as Array<ClientDate>;
    const clientDays = getNumberOfDays(clientDates[0], sortDate);

    switch (sortType) {
      case 'start': {
        return clientDays > 1;
      }
      case 'end-today': {
        return clientDays === 0;
      }
      case 'end-tomorrow': {
        return clientDays === 1;
      }
      case 'end': {
        return clientDays > 1;
      }
      case 'ended': {
        return clientDays < -1;
      }
      default: {
        break;
      }
    }
  });

  const endClients = clients.filter((client) => {
    const clientDates = client[clientSortBy] as Array<ClientDate>;
    const clientDays = getNumberOfDays(clientDates[0], sortDate);

    switch (sortType) {
      case 'start': {
        return clientDays <= 1;
      }
      case 'end-today': {
        return clientDays !== 0;
      }
      case 'end-tomorrow': {
        return clientDays !== 1;
      }
      case 'end': {
        return clientDays <= 1;
      }
      case 'ended': {
        return clientDays >= -1;
      }
      default: {
        break;
      }
    }
  });

  const newClients: Array<Client> = [];

  startClients.forEach((client) => {
    newClients.push(client);
  });

  endClients.forEach((client) => {
    newClients.push(client);
  });

  clients.splice(0, clients.length, ...newClients);
}

const clientsDateArraySort = (sortBy: keyof SortDirection, sortType?: SortType): void => {
  statusSortSelected.value = sortType ? sortType : '';

  let clientSortBy: keyof Client = 'dates';
  let sortDate: keyof ClientDate;

  if (sortBy === 'dates') {
    changeSortDirection(sortDirection, sortBy);
  }

  switch (sortType) {
    case 'start': {
      sortDate = 'start_date';
      sortDirection[sortBy] = 'desc';

      getSortedClientByArrayDates(clients, clientSortBy, sortDate, false);
      getSortedClientsByArrayDates(clients, clientSortBy, sortDate, sortType, false);

      return undefined;
    }
    case 'end-today': {
      sortDate = 'end_date';
      sortDirection[sortBy] = 'asc';

      getSortedClientByArrayDates(clients, clientSortBy, sortDate, false);
      getSortedClientsByArrayDates(clients, clientSortBy, sortDate, sortType, false);

      return undefined;
    }
    case 'end-tomorrow': {
      sortDate = 'end_date';
      sortDirection[sortBy] = 'asc';

      getSortedClientByArrayDates(clients, clientSortBy, sortDate, false);
      getSortedClientsByArrayDates(clients, clientSortBy, sortDate, sortType, false);

      return undefined;
    }
    case 'end': {
      sortDate = 'end_date';
      sortDirection[sortBy] = 'asc';

      getSortedClientByArrayDates(clients, clientSortBy, sortDate, false);
      getSortedClientsByArrayDates(clients, clientSortBy, sortDate, sortType, false);

      return undefined;
    }
    case 'ended': {
      sortDate = 'end_date';
      sortDirection[sortBy] = 'asc';

      getSortedClientByArrayDates(clients, clientSortBy, sortDate, false);
      getSortedClientsByArrayDates(clients, clientSortBy, sortDate, sortType, false);

      return undefined;
    }
    default: {
      if (sortDirection[sortBy] === 'asc') {
        sortDate = 'end_date';

        getSortedClientByArrayDates(clients, clientSortBy, sortDate, true);
        getSortedClientsByArrayDates(clients, clientSortBy, sortDate, '', true);
      } else if (sortDirection[sortBy] === 'desc') {
        sortDate = 'end_date';

        getSortedClientByArrayDates(clients, clientSortBy, sortDate, false);
        getSortedClientsByArrayDates(clients, clientSortBy, sortDate, '', false);
      }

      return undefined;
    }
  }
};

const clientStatusSort = (sortBy: keyof SortDirection, sortType?: SortType): void => {
  changeSortDirection(sortDirection, sortBy);

  switch (sortType) {
    case 'start': {
      clientsDateArraySort('status', sortType);
      sortDirection[sortBy] = 'desc';

      return undefined;
    }
    case 'end-today':
    case 'end-tomorrow':
    case 'end':
    case 'ended': {
      clientsDateArraySort('status', sortType);
      sortDirection[sortBy] = 'asc';

      return undefined;
    }
    default: {
      statusSortSelected.value = '';

      if (sortDirection[sortBy] === 'asc') {
        clientsDateArraySort('status');
      } else if (sortDirection[sortBy] === 'desc') {
        clientsDateArraySort('status');
      }

      return undefined;
    }
  }
};

function getFilteredClientsByArrayDates(
  clients: Array<Client>,
  filteredClients: Array<Client>,
  clientSortBy: keyof Client,
  sortDate: keyof ClientDate,
  sortType: SortType
): void {
  if (sortType === '') {
    filteredClients.splice(0, clients.length, ...clients);
    clients.splice(0, clients.length, ...filteredClients);

    return undefined;
  }

  const newClients = clients.filter((client: Client) => {
    const clientDates = client[clientSortBy] as Array<ClientDate>;
    const clientDays = getNumberOfDays(clientDates[0], sortDate);

    switch (sortType) {
      case 'start': {
        return clientDays > 1;
      }
      case 'end-today': {
        return clientDays === 0;
      }
      case 'end-tomorrow': {
        return clientDays === 1;
      }
      case 'end': {
        return clientDays > 1;
      }
      case 'ended': {
        return clientDays < -1;
      }
      default: {
        break;
      }
    }
  });

  filteredClients.splice(0, clients.length, ...newClients);
  clients.splice(0, clients.length, ...filteredClients);

  return undefined;
}

function clientStatusFilter(sortBy: keyof SortDirection, sortType?: SortType): void {
  resetFilterSelected();
  statusFilterSelected.value = sortType ? sortType : '';

  let clientSortBy = 'dates' as keyof Client;
  let sortDate: keyof ClientDate = 'start_date';

  switch (sortType) {
    case 'start': {
      clientsDateArraySort('status', sortType);
      statusSortSelected.value = '';
      sortDate = 'start_date';
      sortDirection[sortBy] = 'desc';

      getFilteredClientsByArrayDates(clients, filteredClients, clientSortBy, sortDate, sortType);

      return undefined;
    }
    case 'end-today': {
      clientsDateArraySort('status', sortType);
      statusSortSelected.value = '';
      sortDate = 'end_date';
      sortDirection[sortBy] = 'asc';

      getFilteredClientsByArrayDates(clients, filteredClients, clientSortBy, sortDate, sortType);

      return undefined;
    }
    case 'end-tomorrow': {
      clientsDateArraySort('status', sortType);
      statusSortSelected.value = '';
      sortDate = 'end_date';
      sortDirection[sortBy] = 'asc';

      getFilteredClientsByArrayDates(clients, filteredClients, clientSortBy, sortDate, sortType);

      return undefined;
    }
    case 'end': {
      clientsDateArraySort('status', sortType);
      statusSortSelected.value = '';
      sortDate = 'end_date';
      sortDirection[sortBy] = 'asc';

      getFilteredClientsByArrayDates(clients, filteredClients, clientSortBy, sortDate, sortType);

      return undefined;
    }
    case 'ended': {
      clientsDateArraySort('status', sortType);
      statusSortSelected.value = '';
      sortDate = 'end_date';
      sortDirection[sortBy] = 'asc';

      getFilteredClientsByArrayDates(clients, filteredClients, clientSortBy, sortDate, sortType);

      return undefined;
    }
    default: {
      getFilteredClientsByArrayDates(clients, filteredClients, clientSortBy, sortDate, '');

      return undefined;
    }
  }
}

const statusSortSelected = ref<SortType>('');
const statusFilterSelected = ref<SortType>('');
const statusSelected = ref<SortType>('');

const statusSortOptions = ref<Array<SortOption>>([
  { text: 'Начинается через Х дней', value: 'start' },
  { text: 'Заканчивается сегодня', value: 'end-today' },
  { text: 'Заканчивается завтра', value: 'end-tomorrow' },
  { text: 'Заканчивается через Х дней', value: 'end' },
  { text: 'Закончилось Х дней назад', value: 'ended' }
]);

const getStatus = computed(() => {
  return (datesItem: ClientDate, statusSortSelected?: SortType) => {
    switch (statusSortSelected) {
      case 'start': {
        return `${getStartOrEndText(datesItem, 'start_date')} ${
          getNumberOfDays(datesItem, 'start_date') === -1 ||
          getNumberOfDays(datesItem, 'start_date') === 0 ||
          getNumberOfDays(datesItem, 'start_date') === 1
            ? ''
            : Math.abs(getNumberOfDays(datesItem, 'start_date'))
        } ${getNameOfDay(getNumberOfDays(datesItem, 'start_date'))}`;
      }
      case 'end-today':
      case 'end-tomorrow':
      case 'end':
      case 'ended': {
        return `${getStartOrEndText(datesItem, 'end_date')} ${
          getNumberOfDays(datesItem, 'end_date') === -1 ||
          getNumberOfDays(datesItem, 'end_date') === 0 ||
          getNumberOfDays(datesItem, 'end_date') === 1
            ? ''
            : Math.abs(getNumberOfDays(datesItem, 'end_date'))
        } ${getNameOfDay(getNumberOfDays(datesItem, 'end_date'))}`;
      }
      default: {
        return `${getStartOrEndText(datesItem)} ${
          getNumberOfDays(datesItem) === -1 ||
          getNumberOfDays(datesItem) === 0 ||
          getNumberOfDays(datesItem) === 1
            ? ''
            : Math.abs(getNumberOfDays(datesItem))
        } ${getNameOfDay(getNumberOfDays(datesItem))}`;
      }
    }
  };
});

const getDates = computed(() => {
  return (datesItem: ClientDate) => {
    return `${new Date(datesItem.start_date).getDate()}.${
      months[new Date(datesItem.start_date).getMonth()]
    }-${new Date(datesItem.end_date).getDate()}.${
      months[new Date(datesItem.end_date).getMonth()]
    } (${
      (new Date(datesItem.end_date).getTime() - new Date(datesItem.start_date).getTime()) /
        1000 /
        60 /
        60 /
        24 +
      1
    })`;
  };
});

const getPaymentMethod = computed(() => {
  return (orderPayed: number) => {
    return +orderPayed > 0 ? 'Наличные' : 'Онлайн оплата';
  };
});

const getDebtOrOverpayment = computed(() => {
  return (clientItem: Client) => {
    return `${
      Number((clientItem.order_sum - +clientItem.order_payed).toFixed(2)) >= 0
        ? 'Долг:'
        : 'Переплата:'
    } ${Math.abs(Number(clientItem.order_sum - +clientItem.order_payed)).toFixed(2)} р.`;
  };
});

const getCost = computed(() => {
  return (clientItem: Client) => {
    return Number(clientItem.order_sum.toFixed(2));
  };
});

function resetFilterSelected() {
  statusFilterSelected.value = '';
  changeSortDirection(sortDirection);
  clients.splice(0, clients.length, ...initialClients);
}

watch(statusSortSelected, (newStatusSortSelected) => {
  if (newStatusSortSelected) {
    clientStatusSort('status', newStatusSortSelected as SortType);
    statusSelected.value = newStatusSortSelected;
  }
});

watch(statusFilterSelected, (newStatusFilterSelected) => {
  if (newStatusFilterSelected) {
    clientStatusFilter('status', newStatusFilterSelected as SortType);
    statusSelected.value = newStatusFilterSelected;
  }
});
</script>

<template>
  <table class="table">
    <caption class="table__caption">
      Таблица с информацией о заказах
    </caption>

    <thead class="table__head">
      <tr class="table__head-row">
        <th scope="col" :class="sortDirection['o_id']" @click="clientNumberSort('o_id')">Id</th>
        <th
          scope="col"
          :class="sortDirection['client_name']"
          @click="clientStringSort('client_name')"
        >
          Имя клиента
        </th>
        <th scope="col" :class="sortDirection['diets']" @click="clientsArraySort('diets')">
          Диеты
        </th>
        <th scope="col" :class="sortDirection['tariff']" @click="clientsArraySort('tariff')">
          Тарифы
        </th>
        <th scope="col" :class="sortDirection['address']" @click="clientStringSort('address')">
          Адрес
        </th>
        <th scope="col" :class="sortDirection['phone']" @click="clientStringSort('phone')">
          Телефон
        </th>
        <th scope="col" :class="sortDirection['dates']" @click="clientsDateArraySort('dates')">
          Даты
        </th>
        <th scope="col" :class="sortDirection['discount']" @click="clientNumberSort('discount')">
          Скидка
        </th>
        <th scope="col" :class="sortDirection['payment']" @click="clientStringSort('payment')">
          Оплата
        </th>
        <th
          scope="col"
          :class="sortDirection['payment_method']"
          @click="clientStringSort('payment_method')"
        >
          Способ оплаты
        </th>
        <th
          scope="col"
          :class="sortDirection['courier_comment']"
          @click="clientStringSort('courier_comment')"
        >
          Комментарий курьера
        </th>
        <th
          scope="col"
          :class="sortDirection['inner_comment']"
          @click="clientStringSort('inner_comment')"
        >
          Внутренний комментарий
        </th>
        <th scope="col" :class="sortDirection['status']" @click="clientStatusSort('status')">
          Статус
        </th>
      </tr>

      <tr class="table__sort-row">
        <td colspan="13" class="table__sort-status">
          <label for="sort-status" class="table__sort-status-label">Сортировка по статусу:</label>
          <select
            name="sort-status"
            id="sort-status"
            class="table__sort-status-select"
            v-model="statusSortSelected"
          >
            <option
              class="table__sort-status-option table__sort-status-option_disabled"
              disabled
              value=""
            >
              Выберите один пункт
            </option>
            <option
              class="table__sort-status-option"
              v-for="option in statusSortOptions"
              :value="option.value"
              :key="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </td>
      </tr>

      <tr class="table__filter-row">
        <td colspan="13" class="table__filter-status">
          <label for="filter-status" class="table__filter-status-label">Фильтр по статусу:</label>
          <select
            name="filter-status"
            id="filter-status"
            class="table__filter-status-select"
            v-model="statusFilterSelected"
          >
            <option
              class="table__filter-status-option table__filter-status-option_disabled"
              disabled
              value=""
            >
              Выберите один пункт
            </option>
            <option
              class="table__filter-status-option"
              v-for="option in statusSortOptions"
              :value="option.value"
              :key="option.value"
            >
              {{ option.text }}
            </option>
          </select>
          <a href="#" class="table__filter-reset" @click="resetFilterSelected">Сброс</a>
        </td>
      </tr>
    </thead>

    <tbody class="table__body">
      <tr v-for="clientItem in clients" :key="clientItem.o_id" class="table__body-row">
        <th scope="row" class="table__o-id">{{ clientItem.o_id }}</th>
        <td class="table__client-name">{{ clientItem.client_name }}</td>
        <td class="table__diets">
          <span v-for="(dietsItem, key) in clientItem.diets" :key="key">
            {{ dietsItem }}
          </span>
        </td>
        <td class="table__tariff">
          <span v-for="(tariffItem, key) in clientItem.tariff" :key="key">
            {{ tariffItem }}
          </span>
        </td>
        <td>{{ clientItem.address }}</td>
        <td>{{ clientItem.phone }}</td>
        <td class="table__dates">
          <span v-for="(datesItem, key) in clientItem.dates" :key="key">
            {{ getDates(datesItem) }}
          </span>
        </td>
        <td>{{ clientItem.discount ? clientItem.discount : '' }}</td>
        <td
          class="table__payment"
          :class="[
            clientItem.pay_status === 'Оплачен' ? 'table__payment_paid' : 'table__payment_unpaid'
          ]"
        >
          <span>Стоим.: {{ getCost(clientItem) }} р.</span>
          <span>{{ clientItem.pay_status }}</span>
          <span>{{ getDebtOrOverpayment(clientItem) }}</span>
        </td>
        <td class="table__payment-method">
          {{ getPaymentMethod(+clientItem.order_payed) }}
        </td>
        <td class="table__courier-comment">
          <span>
            <img src="../../assets/delivery-icon.png" alt="Доставка" />
            {{ clientItem.courier_comment }}
          </span>
        </td>
        <td class="table__inner-comment">
          <span>
            <img src="../../assets/comment-icon.png" alt="Комментарий" />
            {{ clientItem.inner_comment }}
          </span>
        </td>
        <td class="table__status">
          <span v-for="(datesItem, key) in clientItem.dates" :key="key">
            {{ getStatus(datesItem, statusSelected) }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
// colors
$id-bg-color: #99ff99;
$payment-bg-color: #ff9999;
$comment-bg-color: #fff5f5;
$status-bg-light-color: #eaebff;
$status-bg-color: #d3d6ff;
$font-sec-color: #2369b1;
$font-reset-color: #d2113d;
$odd-row-color: #fff;
$even-row-color: #f2f2f2;
$odd-comment-color: #eaebff;
$even-comment-color: #d3d6ff;
$table-border-color: #dee2e6;
$td-dot-color: #989898;
$td-dash1-color: #e0cbea;
$td-dash2-color: #ffc4c4;

// fonts
$font-caption-size: 16px;
$font-sort-size: 14px;
$font-payment-size: 8.5px;
$font-status-size: 10px;

.table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border: 1px solid $table-border-color;
  background-color: $odd-row-color;
  line-height: 1;

  &__caption {
    caption-side: top;
    text-align: center;
    font-size: $font-caption-size;
    line-height: 2;
  }

  &__head {
    background-color: $odd-row-color;

    &-row {
      & th,
      & td {
        padding: 5px 3px;
      }

      & > th {
        border: 1px solid $table-border-color;
        background-color: $even-row-color;
        font-weight: 700;
        transition: all 0.3s;

        &.asc {
          padding-left: 0;
          padding-right: 0;
          background-color: rgba($id-bg-color, 0.5);
          border: 1px solid $payment-bg-color;

          &::after {
            content: ' \2191';
          }
        }

        &.desc {
          padding-left: 0;
          padding-right: 0;
          background-color: rgba($font-sec-color, 0.5);
          border: 1px solid $payment-bg-color;

          &.desc::after {
            content: ' \2193';
          }
        }

        &.none::after {
          content: '';
          background: none;
        }
      }

      & > th:hover {
        transform: scale(1.05);
        background-color: rgba($even-row-color, 0.2);
      }

      & > th:nth-child(1) {
        width: 3%;
      }

      & > th:nth-child(2) {
        width: 7.7%;
      }

      & > th:nth-child(3) {
        width: 7%;
      }

      & > th:nth-child(4) {
        width: 7%;
      }

      & > th:nth-child(5) {
        width: 9.5%;
      }

      & > th:nth-child(6) {
        width: 7%;
      }

      & > th:nth-child(7) {
        width: 6%;
      }

      & > th:nth-child(8) {
        width: 4.3%;
      }

      & > th:nth-child(9) {
        width: 7.4%;
      }

      & > th:nth-child(10) {
        width: 7.5%;
      }

      & > th:nth-child(11) {
        width: 10.5%;
      }

      & > th:nth-child(12) {
        width: 14.1%;
      }

      & > th:nth-child(13) {
        width: 9%;
      }
    }
  }

  &__sort,
  &__filter {
    &-row {
      background-color: $odd-row-color;

      & td {
        padding: 10px;
      }
    }

    &-status {
      font-size: $font-sort-size;

      &-label {
        padding-right: 5px;
      }

      &-select {
        padding: 3px;
        width: auto;
        border: 1px solid $odd-comment-color;
        border-radius: 10px;
        font-size: $font-sort-size;

        &:focus {
          border: 1px solid $id-bg-color;
          box-shadow: 0 0 3pt 2pt $id-bg-color;
        }
      }

      &-option {
        border: none;
      }
    }
  }

  &__filter {
    &-reset {
      text-decoration: none;
      color: $font-reset-color;
      background-color: $comment-bg-color;
      border: 1px solid $payment-bg-color;
      border-radius: 10px;
      padding: 3px 10px;
      margin-left: 10px;
      font-size: $font-sort-size;
      line-height: normal;
    }
  }

  &__body {
    & tr:nth-child(odd) {
      background-color: $odd-row-color;
    }

    & tr:nth-child(even) {
      background-color: $even-row-color;
    }

    & tr:nth-child(odd) > td.table__status {
      background-color: $status-bg-light-color;
    }

    & tr:nth-child(even) > td.table__status {
      background-color: $status-bg-color;
    }

    &-row {
      border: 1px solid $table-border-color;
      text-align: center;

      & > th {
        background-color: $id-bg-color;
      }

      & > th,
      & > td {
        padding: 3px;
        border: 1px solid $table-border-color;
        font-weight: 500;
      }

      & > td > span {
        font-weight: 500;
      }
    }
  }

  &__o-id,
  &__client-name {
    color: $font-sec-color;
  }

  &__diets,
  &__tariff,
  &__dates,
  &__status {
    & > span {
      display: block;
      border-bottom: 1px dotted $td-dot-color;
      padding: 5px 0;

      &:first-child {
        padding-top: 0;
        padding-bottom: 5px;
      }

      &:last-child {
        border-bottom: none;
        padding-top: 5px;
        padding-bottom: 0;
      }
    }
  }

  &__payment {
    & > span {
      display: block;
      font-size: $font-payment-size;
      line-height: 1.7;
    }

    &_paid {
      background-color: $id-bg-color;
    }

    &_unpaid {
      background-color: $payment-bg-color;
    }
  }

  &__payment-method {
    text-align: left;
  }

  &__courier-comment,
  &__inner-comment {
    text-align: left;

    & > span {
      display: block;
      padding: 3px;
      white-space: pre-wrap;
    }
  }

  &__courier-comment {
    & > span {
      border: 1px dashed $td-dash1-color;
    }
  }

  &__inner-comment {
    & > span {
      border: 1px dashed $td-dash2-color;
      background-color: $comment-bg-color;
    }
  }

  &__status {
    font-size: $font-status-size;
  }
}
</style>
