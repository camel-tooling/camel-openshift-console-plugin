import * as React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from "@patternfly/react-core";
import { QueryBrowser } from '@openshift-console/dynamic-plugin-sdk';



type ResourceMetricsDashboardCardProps = {
  namespace?: string;
  title: string;
  queries: string[];
};

const ResourceMetricsCard: React.FC<ResourceMetricsDashboardCardProps> = (props) => (
  <Card className="resource-metrics-dashboard__card">
    <CardHeader>
      <CardTitle>{props.title}</CardTitle>
    </CardHeader>
    <CardBody className="resource-metrics-dashboard__card-body">
      <QueryBrowser queries={props.queries} namespace={props.namespace} disableZoom hideControls />
    </CardBody>
  </Card>
);

export default ResourceMetricsCard;