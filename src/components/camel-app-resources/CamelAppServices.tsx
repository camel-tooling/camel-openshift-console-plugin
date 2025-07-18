import * as React from 'react';
import { Card, CardBody, CardTitle, Spinner } from '@patternfly/react-core';
import { K8sResourceKind, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { serviceGVK } from '../../const';
import { useCamelAppServices } from './useCamelAppResources';
import { LongArrowAltRightIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';

type CamelAppServicesProps = {
  obj: K8sResourceKind;
};

type Resources = {
  name: string;
  ports: [];
};

const CamelAppServices: React.FC<CamelAppServicesProps> = ({ obj: camelAppOwner }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  const services: Resources[] = [];

  const { CamelAppServices, loaded: loadedServices } = useCamelAppServices(
    camelAppOwner.metadata.namespace,
    camelAppOwner.metadata.name,
  );
  if (loadedServices && CamelAppServices.length > 0) {
    CamelAppServices.forEach((service) => {
      services.push({
        name: service.metadata.name,
        ports: service.spec?.ports ?? [],
      });
    });
  }

  if (!loadedServices) {
    return (
      <Card>
        <CardTitle>Services</CardTitle>
        <CardBody>
          <Spinner />
        </CardBody>
      </Card>
    );
  }

  if (loadedServices && services.length == 0) {
    return <></>;
  }

  return (
    <Card>
      <CardTitle>Services</CardTitle>
      <CardBody>
        <ul className="list-group">
          {services.map((resource, i) => {
            return (
              <li key={i} className="list-group-item">
                <ResourceLink
                  groupVersionKind={serviceGVK}
                  name={resource.name}
                  namespace={camelAppOwner.metadata.namespace}
                />
                <ul className="port-list">
                  {resource.ports.map(({ name, port, protocol, targetPort }) => (
                    <li key={name || `${protocol}/${port}`}>
                      <span className="text-muted">{t('Service port:')}</span>{' '}
                      {name || `${protocol}/${port}`}
                      &nbsp;
                      <LongArrowAltRightIcon />
                      &nbsp;
                      <span className="text-muted">{t('Pod port:')}</span> {targetPort}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
};

export default CamelAppServices;
