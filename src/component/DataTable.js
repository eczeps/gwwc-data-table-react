import React, { useMemo } from 'react';
import MUITable from './MUITable';

function getColumns() {
  return [
    {
      accessor: 'charity',
      Header: 'Charity',
    },
    {
      accessor: 'cause',
      Header: 'Cause Area',
    },
    {
      accessor: 'totalDonations',
      Header: 'Total Donations',
    },
    {
      accessor: 'gwwcDonations',
      Header: 'GWWC Donations',
    },
    {
      accessor: 'slug',
      id: 'donate',
      Header: 'Donate',
      Cell: ({ value }) => {
        // TODO: update url
        const url = `https://app.effectivealtruism.org/donations/new/allocation?allocation[${value}]=100`;
        return <a href={url}>Donate</a>;
      },
      disableSortBy: true,
    },
    {
      accessor: 'slug',
      id: 'learnMore',
      Header: 'Learn More',
      Cell: ({ value }) => {
        // TODO: update url
        const url = `https://app.effectivealtruism.org/funds/${value}`;
        return <a href={url}>Learn More</a>;
      },
      disableSortBy: true,
    },
  ];
}

function filterEmpty(str) {
  // TODO handle null value filtering upstream in excel sheet import to firebase
  if (str == '&null') return '';
  if (str == '#N/A') return '';
  return str;
}

function createRows(organizations) {
  const data = Object.entries(organizations);
  const formattedData = data.map(([slug, item]) => ({
    slug,
    charity: filterEmpty(item['Full Name']),
    cause: filterEmpty(item['Core Cause']),
    totalDonations: filterEmpty(item['Total Donations']),
    gwwcDonations: filterEmpty(item['GWWC &dollar donated']),
    defaultSort: item['Default Sort'],
  })).filter(x => !!x['charity']);
  return formattedData.sort((a, b) => (a.defaultSort > b.defaultSort) ? 1 : -1)
}

function DataTable(props) {
  const { organizations } = props;
  const data = useMemo(() => createRows(organizations), [organizations]);
  const columns = useMemo(getColumns, []);

  return (
    <MUITable data={data} columns={columns} />
  )
}

export default DataTable;
