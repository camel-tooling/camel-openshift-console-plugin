import * as React from 'react';
import { CamelAppKind } from '../../types';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Grid,
  GridItem,
  PageSection,
  Title,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import {
  GreenCheckCircleIcon,
  K8sGroupVersionKind,
  K8sResourceConditionStatus,
  ResourceLink,
  Timestamp,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import { camelAppGVK } from '../../const';
import CamelAppStatusPod from './CamelAppStatusPod';
import CamelAppHealth from '../camel-list-page/CamelAppHealth';
import { PopoverCamelHealth } from './CamelAppHealthPopover';
import { formatDuration } from '../../date-utils';
import { Table, Tbody } from '@patternfly/react-table';

type CamelAppDetailsProps = {
  obj: CamelAppKind;
};

type CamelAppDetails = {
  groupVersionKind: K8sGroupVersionKind;
  name: string;
  namespace: string;
  version: string;
  buildTimestamp: string;
  runtimeFramework: string;
  runtimeVersion: string;
  frameworkVersion: string;
  healthEndpoints: string[];
  metricsEndpoint: string;
};

const monitoredCondition = (camelInt: CamelAppKind) => {
  const monitoredConditions = camelInt.status?.conditions?.filter(
    (contidition) => contidition.type == 'Monitored',
  );
  if (monitoredConditions.length > 0) {
    return monitoredConditions[0];
  }
  return;
};
const healthyCondition = (camelInt: CamelAppKind) => {
  const healthConditions = camelInt.status?.conditions?.filter(
    (contidition) => contidition.type == 'Healthy',
  );
  if (healthConditions.length > 0) {
    return healthConditions[0];
  }
  return;
};

const CamelAppDetails: React.FC<CamelAppDetailsProps> = ({ obj: camelInt }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  const monitored = monitoredCondition(camelInt);
  const healthy = healthyCondition(camelInt);

  return (
    <>
      <PageSection>
        <Title headingLevel="h2">{t('Camel Application Details')}</Title>
      </PageSection>
      <PageSection>
        <DescriptionList
          columnModifier={{
            default: '1Col',
            md: '2Col',
            lg: '2Col',
            xl: '2Col',
          }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>{t('Resource')}:</DescriptionListTerm>
            <DescriptionListDescription>
              <ResourceLink
                displayName={camelInt.metadata.name}
                groupVersionKind={camelAppGVK}
                name={camelInt.metadata.name}
                namespace={camelInt.metadata.namespace}
              />
            </DescriptionListDescription>
            <DescriptionListTerm>{t('Image')}:</DescriptionListTerm>
            <DescriptionListDescription>
              {camelInt.status?.image ? camelInt.status.image : 'unknown'}
            </DescriptionListDescription>
            <DescriptionListTerm>{t('Monitored')}:</DescriptionListTerm>
            <DescriptionListDescription>
              {monitored && monitored?.status == K8sResourceConditionStatus.True ? (
                <>
                  <GreenCheckCircleIcon />
                  &nbsp;&nbsp;True
                </>
              ) : (
                <>
                  <YellowExclamationTriangleIcon />
                  &nbsp;&nbsp;False&nbsp;&nbsp;({monitored.message})
                </>
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>
              <PopoverCamelHealth popoverBody={t('Health') + ' :'} condition={healthy} />
            </DescriptionListTerm>
            <DescriptionListDescription>
              <CamelAppHealth
                health={
                  camelInt.status?.sliExchangeSuccessRate?.status
                    ? camelInt.status.sliExchangeSuccessRate.status
                    : ''
                }
              />
              {camelInt.status?.sliExchangeSuccessRate ? (
                <>
                  <DescriptionListTerm>{t('Percentage of success rate')}:</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Table>
                      <Tbody>
                        {camelInt.status?.sliExchangeSuccessRate.lastTimestamp ? (
                          <tr>
                            <td>{t('Last message')}:</td>
                            <td>
                              <Timestamp
                                timestamp={camelInt.status.sliExchangeSuccessRate.lastTimestamp}
                              />
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )}
                        <tr>
                          <td>{t('Sampling interval')}:</td>
                          <td>
                            {formatDuration(
                              camelInt.status.sliExchangeSuccessRate.samplingInterval / 1000000,
                              t,
                              { omitSuffix: true },
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>{t('Failed exchanges')}:</td>
                          <td>
                            {camelInt.status.sliExchangeSuccessRate.samplingIntervalFailed | 0}
                          </td>
                        </tr>
                        <tr>
                          <td>{t('Total exchanges')}:</td>
                          <td>{camelInt.status.sliExchangeSuccessRate.samplingIntervalTotal}</td>
                        </tr>
                        <tr>
                          <td>{t('Success percentage')}:</td>
                          <td>{camelInt.status.sliExchangeSuccessRate.successPercentage} %</td>
                        </tr>
                      </Tbody>
                    </Table>
                  </DescriptionListDescription>
                </>
              ) : (
                <></>
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </PageSection>
      <PageSection>
        <Divider />
        <PageSection>
          <Title headingLevel="h3">{t('Pods')}</Title>
        </PageSection>
        <Grid hasGutter sm={12} md={6} lg={6} xl={6} xl2={4}>
          {camelInt.status?.pods
            ? camelInt.status.pods.map((pod, i) => {
                return (
                  <GridItem key={i}>
                    <CamelAppStatusPod obj={camelInt} pod={pod} />
                  </GridItem>
                );
              })
            : ''}
        </Grid>
      </PageSection>
    </>
  );
};

export default CamelAppDetails;
