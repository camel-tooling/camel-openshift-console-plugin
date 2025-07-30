import * as React from 'react';
import { CamelAppKind, CamelAppStatusPod } from '../../types';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Content,
  ContentVariants,
  Title,
  Card,
  CardHeader,
  CardBody,
} from '@patternfly/react-core';
import { podGVK } from '../../const';
import {
  ResourceLink,
  ResourceStatus,
  Timestamp,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from 'react-i18next';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import { formatDuration } from '../../date-utils';
import { Table, Tbody } from '@patternfly/react-table';

type CamelAppStatusPodProps = {
  obj: CamelAppKind;
  pod: CamelAppStatusPod;
};

const hasRuntime = (camelPod: CamelAppStatusPod) =>
  camelPod.runtime &&
  (camelPod.runtime.camelVersion ||
    camelPod.runtime.runtimeProvider ||
    camelPod.runtime.runtimeVersion);
const hasRuntimeExchanges = (camelPod: CamelAppStatusPod) =>
  camelPod.runtime?.exchange ? true : false;
const hasObserve = (camelPod: CamelAppStatusPod) =>
  camelPod.observe && Object.keys(camelPod.observe).length > 0;
const hasStatusMessage = (camelPod: CamelAppStatusPod) => (camelPod.reason ? true : false);

const CamelAppStatusPod: React.FC<CamelAppStatusPodProps> = ({ obj: camelInt, pod: camelPod }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');
  // Golang time.Time is in nanoseconds
  // TODO: add tooltip with date
  const now = Date.now();
  const uptimeTimestamp = Date.parse(camelPod.uptimeTimestamp);
  const duration = now - uptimeTimestamp;
  const durationFull = formatDuration(duration, t, {
    omitSuffix: false,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <Title headingLevel="h4">
            <h4>
              <ResourceLink
                displayName={camelPod.name}
                groupVersionKind={podGVK}
                name={camelPod.name}
                namespace={camelInt.metadata.namespace}
              >
                <ResourceStatus additionalClassNames="hidden-xs">
                  <Status status={camelPod.status} />
                </ResourceStatus>
              </ResourceLink>
            </h4>
          </Title>
        </CardHeader>
        <CardBody>
          <DescriptionList
            columnModifier={{
              default: '1Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Internal IP')}:</DescriptionListTerm>
              <DescriptionListDescription>
                <Content component={ContentVariants.p}>{camelPod.internalIp}</Content>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Uptime')}:</DescriptionListTerm>
              <DescriptionListDescription>
                <Content component={ContentVariants.p}>{durationFull}</Content>
              </DescriptionListDescription>
            </DescriptionListGroup>

            {hasStatusMessage(camelPod) ? (
              <DescriptionListGroup>
                <DescriptionListTerm>{t('Status message')}:</DescriptionListTerm>
                <DescriptionListDescription>
                  <Content component={ContentVariants.p}>
                    <YellowExclamationTriangleIcon />
                    &nbsp;&nbsp;{camelPod.reason}
                  </Content>
                </DescriptionListDescription>
              </DescriptionListGroup>
            ) : (
              <></>
            )}

            {hasRuntime(camelPod) ? (
              <DescriptionListGroup>
                <DescriptionListTerm>{t('Runtime')}:</DescriptionListTerm>
                <DescriptionListDescription>
                  <Table>
                    <Tbody>
                      <tr>
                        <td>{t('Camel Version')}:</td>
                        <td>{camelPod.runtime.camelVersion}</td>
                      </tr>
                      <tr>
                        <td>{t('Runtime Provider')}:</td>
                        <td>{camelPod.runtime.runtimeProvider}</td>
                      </tr>
                      <tr>
                        <td>{t('Runtime Version')}:</td>
                        <td>{camelPod.runtime.runtimeVersion}</td>
                      </tr>
                    </Tbody>
                  </Table>
                </DescriptionListDescription>
              </DescriptionListGroup>
            ) : (
              <></>
            )}
            {hasRuntimeExchanges(camelPod) ? (
              <DescriptionListGroup>
                <DescriptionListTerm>{t('Exchange')}:</DescriptionListTerm>
                <DescriptionListDescription>
                  <Table>
                    <Tbody>
                      <tr>
                        <td>{t('Last message')}:</td>
                        <td>
                          <Timestamp timestamp={camelPod.runtime.exchange.lastTimestamp} />
                        </td>
                      </tr>
                      <tr>
                        <td>{t('succeed')}:</td>
                        <td>
                          {camelPod.runtime.exchange.succeed
                            ? camelPod.runtime.exchange.succeed
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('pending')}:</td>
                        <td>
                          {camelPod.runtime.exchange.pending
                            ? camelPod.runtime.exchange.pending
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('failed')}</td>
                        <td>
                          {camelPod.runtime.exchange.failed ? camelPod.runtime.exchange.failed : 0}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('total')}:</td>
                        <td>
                          {camelPod.runtime.exchange.total ? camelPod.runtime.exchange.total : 0}
                        </td>
                      </tr>
                    </Tbody>
                  </Table>
                </DescriptionListDescription>
              </DescriptionListGroup>
            ) : (
              <></>
            )}

            {hasObserve(camelPod) ? (
              <DescriptionListGroup>
                <DescriptionListTerm>{t('Endpoints')}:</DescriptionListTerm>
                <DescriptionListDescription>
                  <Table>
                    <Tbody>
                      <tr>
                        <td>{t('Health')}:</td>
                        <td>
                          {camelPod.observe.healthEndpoint}:{camelPod.observe.healthPort}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('Metrics')}:</td>
                        <td>
                          {camelPod.observe.metricsEndpoint}:{camelPod.observe.metricsPort}
                        </td>
                      </tr>
                    </Tbody>
                  </Table>
                </DescriptionListDescription>
              </DescriptionListGroup>
            ) : (
              <></>
            )}
          </DescriptionList>
        </CardBody>
      </Card>
    </>
  );
};

export default CamelAppStatusPod;
