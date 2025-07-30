import * as React from 'react';
import { Card, CardBody, CardTitle, Spinner, Content } from '@patternfly/react-core';
import { K8sResourceKind, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { podGVK } from '../../const';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import { useCamelAppPods } from './useCamelAppResources';
import { getPodStatus } from './podStatus';
import { useTranslation } from 'react-i18next';
import { isHawtioEnabled, useHawtioConsolePlugin } from './useHawtio';

type CamelAppPodsProps = {
  obj: K8sResourceKind;
};

type Resources = {
  name: string;
  status: string;
  hawtioEnabled: boolean;
};

const CamelAppPods: React.FC<CamelAppPodsProps> = ({ obj: camelInt }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  const pods: Resources[] = [];

  const { CamelAppPods, loaded: loadedPods } = useCamelAppPods(
    camelInt.metadata.namespace,
    camelInt.kind,
    camelInt.spec.selector,
  );

  const { available: availableHawtioConsolePlugin } = useHawtioConsolePlugin();

  if (loadedPods && CamelAppPods.length > 0) {
    CamelAppPods.forEach((pod) => {
      pods.push({
        name: pod.metadata.name,
        status: getPodStatus(pod),
        hawtioEnabled: availableHawtioConsolePlugin && isHawtioEnabled(pod),
      });
    });
  }
  if (!loadedPods) {
    return (
      <Card>
        <CardTitle>Pods</CardTitle>
        <CardBody>
          <Spinner />
        </CardBody>
      </Card>
    );
  }

  if (loadedPods && pods.length == 0) {
    return <></>;
  }

  return (
    <Card>
      <CardTitle>Pods</CardTitle>
      <CardBody>
        <ul className="list-group">
          {pods.map((resource, i) => {
            return (
              <li key={i} className="list-group-item container-fluid">
                <div className="row">
                  <span className="col-xs-5">
                    <Content>
                      <ResourceLink
                        groupVersionKind={podGVK}
                        name={resource.name}
                        namespace={camelInt.metadata.namespace}
                      />
                    </Content>
                  </span>
                  <span className="col-xs-3">
                    <Content>
                      <Status title={resource.status || 'N/A'} status={resource.status} />
                    </Content>
                  </span>
                  {resource.hawtioEnabled ? (
                    <>
                      <span className="col-xs-2 text-right">
                        <Content>
                          <a
                            href={`/k8s/ns/${camelInt.metadata.namespace}/pods/${resource.name}/logs`}
                          >
                            {t('View Logs')}
                          </a>
                        </Content>
                      </span>
                      <span className="col-xs-2 text-right">
                        <Content>
                          <a
                            href={`/k8s/ns/${camelInt.metadata.namespace}/pods/${resource.name}/hawtio`}
                          >
                            {t('View Hawtio')}
                          </a>
                        </Content>
                      </span>
                    </>
                  ) : (
                    <span className="col-xs-4 text-right">
                      <Content>
                        <a
                          href={`/k8s/ns/${camelInt.metadata.namespace}/pods/${resource.name}/logs`}
                        >
                          {t('View Logs')}
                        </a>
                      </Content>
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
};

export default CamelAppPods;
