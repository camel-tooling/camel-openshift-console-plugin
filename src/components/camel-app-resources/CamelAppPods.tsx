import * as React from 'react';
import { Card, CardBody, CardTitle, Spinner, TextContent } from '@patternfly/react-core';
import { CamelAppKind } from '../../types';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { podGVK } from '../../const';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import { useCamelAppPods } from './useCamelAppResources';
import { getPodStatus } from '../../utils';
import { useTranslation } from 'react-i18next';

type CamelAppPodsProps = {
  obj: CamelAppKind;
};

type Resources = {
  name: string;
  status: string;
};

const CamelAppPods: React.FC<CamelAppPodsProps> = ({ obj: camelInt }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  const pods: Resources[] = [];

  const { CamelAppPods, loaded: loadedPods } = useCamelAppPods(
    camelInt.metadata.namespace,
    camelInt.kind,
    camelInt.spec.selector,
  );
  if (loadedPods && CamelAppPods.length > 0) {
    CamelAppPods.forEach((pod) => {
      pods.push({
        name: pod.metadata.name,
        status: getPodStatus(pod),
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
                    <TextContent>
                      <ResourceLink
                        groupVersionKind={podGVK}
                        name={resource.name}
                        namespace={camelInt.metadata.namespace}
                      />
                    </TextContent>
                  </span>
                  <span className="col-xs-4">
                    <TextContent>
                      <Status title={resource.status || 'N/A'} status={resource.status} />
                    </TextContent>
                  </span>
                  <span className="col-xs-3 text-right">
                    <TextContent>
                      <a
                        href={`/k8s/ns/${camelInt.metadata.namespace}/pods/${resource.name}/logs`}
                      >
                        {t('View Logs')}
                      </a>
                    </TextContent>
                  </span>
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
