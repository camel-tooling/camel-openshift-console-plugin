import * as React from 'react';
import { Card, CardBody, CardTitle, Content } from '@patternfly/react-core';
import {
  K8sGroupVersionKind,
  K8sResourceKind,
  ResourceLink,
} from '@openshift-console/dynamic-plugin-sdk';
import { Link } from 'react-router-dom-v5-compat';
import { useTranslation } from 'react-i18next';

type CamelAppOwnerResourceProps = {
  obj: K8sResourceKind;
  gvk: K8sGroupVersionKind;
};

const CamelAppOwnerResource: React.FC<CamelAppOwnerResourceProps> = ({
  obj: camelAppOwner,
  gvk: ownerGvk,
}) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  return (
    <Card>
      <CardTitle>{camelAppOwner.kind}</CardTitle>
      <CardBody>
        <ul className="list-group">
          <li className="list-group-item">
            <div className="row">
              <span className="col-xs-5">
                <ResourceLink
                  groupVersionKind={ownerGvk}
                  name={camelAppOwner.metadata.name}
                  namespace={camelAppOwner.metadata.namespace}
                />
              </span>
              <span className="col-xs-4 text-right">
                <Content>
                  <Link
                    to={`/dev-monitoring/ns/${camelAppOwner.metadata.namespace}?dashboard=dashboard-k8s-resources-workload&workload=${camelAppOwner.metadata.name}&type=ALL_OPTIONS_KEY`}
                  >
                    {t('View dashboards')}
                  </Link>
                </Content>
              </span>
            </div>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
};

export default CamelAppOwnerResource;
