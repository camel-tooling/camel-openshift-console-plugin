import { K8sResourceKind, TableColumn } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import { sortResourceByCamelVersion } from './camelAppVersion';
import { sortResourceByLastMessage } from './lastMessage';

const useCamelAppColumns = (namespace): TableColumn<K8sResourceKind>[] => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');
  return [
    {
      title: t('Name'),
      id: 'name',
      sort: 'metadata.name',
      transforms: [sortable],
    },
    ...(!namespace
      ? [
          {
            title: t('Namespace'),
            id: 'namespace',
            sort: 'metadata.namespace',
            transforms: [sortable],
          },
        ]
      : []),
    {
      title: t('Status'),
      id: 'status',
      sort: 'status.phase',
      transforms: [sortable],
    },
    {
      title: t('Camel Health'),
      id: 'health',
      sort: 'status.sliExchangeSuccessRate.status',
      transforms: [sortable],
    },
    {
      title: t('Runtime Provider'),
      id: 'runtime',
      sort: 'status.pods[0].runtime.runtimeProvider',
      transforms: [sortable],
    },
    {
      title: t('Camel Version'),
      id: 'camel',
      sort: (data, direction) => data?.sort(sortResourceByCamelVersion(direction)),
      transforms: [sortable],
    },
    {
      title: t('Time since the last message'),
      id: 'lastmessage',
      sort: (data, direction) => data?.sort(sortResourceByLastMessage(direction)),
      transforms: [sortable],
    },
  ];
};

export default useCamelAppColumns;
