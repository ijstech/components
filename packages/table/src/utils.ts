import { TableColumnElement } from './tableColumn';

export const paginate = <Type>(array: Type[], pageSize: number, pageNumber: number): Type[] => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export const getColumnIndex = (columns: TableColumnElement[], key: string) => {
  const finded = columns.findIndex(column => column.fieldName === key);
  return finded;
}

export const getColumnKey = (columns: TableColumnElement[], columnIdx: number) => {
  const column = columns[columnIdx];
  return column ? column.fieldName : '';
}

export const getSorter = (columns: TableColumnElement[], key: string) => {
  const findedColumn = columns.find(column => column.fieldName === key);
  return findedColumn ? findedColumn.sorter : null;
}

export const getValueByPath = function(object: any, prop: string) {
  prop = prop || '';
  const paths = prop.split('.');
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
};

export const orderBy = (list: any, sortConfig: any, columns: TableColumnElement[]) => {
  if (!sortConfig.length) return list;
  const sortFn = (a: any, b: any) => {
    let sorterCond: any;
    for (const config of sortConfig) {
      const { key, direction } = config;
      const sortDirection = direction === 'asc' ? 1 : -1;
      const sorter = getSorter(columns, key);
      const value = sorter ? sorter(a, b) * sortDirection : (a[key] > b[key] ? 1 : (a[key] < b[key] ? -1 : 0)) * sortDirection;
      sorterCond = sorterCond || value;
    }
    return sorterCond || 0
  }

  return list.sort((a: any, b: any) => sortFn(a, b));
}

export const filterBy = (list: any[], value: any, columnKey: string | number) => {
  let searchTerms: any[] = [];
  if (value) {
    if (Array.isArray(value) && value.length) {
      searchTerms = value.map(val => "^" + val + "$");
    } else {
      searchTerms.push("^" + value)
    }
  }
  const searchRegex = new RegExp(searchTerms.join('|'), 'g');
  const dataList = [...list];
  return dataList.filter(data => {
    return data[columnKey].match(searchRegex);
  });
}