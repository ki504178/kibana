/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CoreSetup, SavedObjectsClientContract } from '../../../../../src/core/server';
import { CollectorFetchContext } from '../../../../../src/plugins/usage_collection/server';
import { CollectorDependencies } from './types';
import {
  DetectionsUsage,
  fetchDetectionsUsage,
  defaultDetectionsUsage,
  fetchDetectionsMetrics,
} from './detections';
import { EndpointUsage, getEndpointTelemetryFromFleet } from './endpoints';

export type RegisterCollector = (deps: CollectorDependencies) => void;
export interface UsageData {
  detections: DetectionsUsage;
  endpoints: EndpointUsage | {};
  detectionMetrics: {};
}

export async function getInternalSavedObjectsClient(core: CoreSetup) {
  return core.getStartServices().then(async ([coreStart]) => {
    return coreStart.savedObjects.createInternalRepository();
  });
}

export const registerCollector: RegisterCollector = ({
  core,
  endpointAppContext,
  kibanaIndex,
  signalIndex,
  ml,
  usageCollection,
}) => {
  if (!usageCollection) {
    return;
  }
  const collector = usageCollection.makeUsageCollector<UsageData>({
    type: 'security_solution',
    schema: {
      detections: {
        detection_rules: {
          custom: {
            enabled: { type: 'long' },
            disabled: { type: 'long' },
          },
          elastic: {
            enabled: { type: 'long' },
            disabled: { type: 'long' },
          },
        },
        ml_jobs: {
          custom: {
            enabled: { type: 'long' },
            disabled: { type: 'long' },
          },
          elastic: {
            enabled: { type: 'long' },
            disabled: { type: 'long' },
          },
        },
      },
      detectionMetrics: {
        detection_rules: {
          detection_rule_usage: {
            query: {
              enabled: { type: 'long', _meta: { description: 'Number of query rules enabled' } },
              disabled: { type: 'long', _meta: { description: 'Number of query rules disabled' } },
              alerts: {
                type: 'long',
                _meta: { description: 'Number of alerts generated by query rules' },
              },
              cases: {
                type: 'long',
                _meta: { description: 'Number of cases attached to query detection rule alerts' },
              },
            },
            threshold: {
              enabled: {
                type: 'long',
                _meta: { description: 'Number of threshold rules enabled' },
              },
              disabled: {
                type: 'long',
                _meta: { description: 'Number of threshold rules disabled' },
              },
              alerts: {
                type: 'long',
                _meta: { description: 'Number of alerts generated by threshold rules' },
              },
              cases: {
                type: 'long',
                _meta: {
                  description: 'Number of cases attached to threshold detection rule alerts',
                },
              },
            },
            eql: {
              enabled: { type: 'long', _meta: { description: 'Number of eql rules enabled' } },
              disabled: { type: 'long', _meta: { description: 'Number of eql rules disabled' } },
              alerts: {
                type: 'long',
                _meta: { description: 'Number of alerts generated by eql rules' },
              },
              cases: {
                type: 'long',
                _meta: { description: 'Number of cases attached to eql detection rule alerts' },
              },
            },
            machine_learning: {
              enabled: {
                type: 'long',
                _meta: { description: 'Number of machine_learning rules enabled' },
              },
              disabled: {
                type: 'long',
                _meta: { description: 'Number of machine_learning rules disabled' },
              },
              alerts: {
                type: 'long',
                _meta: { description: 'Number of alerts generated by machine_learning rules' },
              },
              cases: {
                type: 'long',
                _meta: {
                  description: 'Number of cases attached to machine_learning detection rule alerts',
                },
              },
            },
            threat_match: {
              enabled: {
                type: 'long',
                _meta: { description: 'Number of threat_match rules enabled' },
              },
              disabled: {
                type: 'long',
                _meta: { description: 'Number of threat_match rules disabled' },
              },
              alerts: {
                type: 'long',
                _meta: { description: 'Number of alerts generated by threat_match rules' },
              },
              cases: {
                type: 'long',
                _meta: {
                  description: 'Number of cases attached to threat_match detection rule alerts',
                },
              },
            },
            elastic_total: {
              enabled: { type: 'long', _meta: { description: 'Number of elastic rules enabled' } },
              disabled: {
                type: 'long',
                _meta: { description: 'Number of elastic rules disabled' },
              },
              alerts: {
                type: 'long',
                _meta: { description: 'Number of alerts generated by elastic rules' },
              },
              cases: {
                type: 'long',
                _meta: { description: 'Number of cases attached to elastic detection rule alerts' },
              },
            },
            custom_total: {
              enabled: { type: 'long', _meta: { description: 'Number of custom rules enabled' } },
              disabled: { type: 'long', _meta: { description: 'Number of custom rules disabled' } },
              alerts: {
                type: 'long',
                _meta: { description: 'Number of alerts generated by custom rules' },
              },
              cases: {
                type: 'long',
                _meta: { description: 'Number of cases attached to custom detection rule alerts' },
              },
            },
          },
          detection_rule_detail: {
            type: 'array',
            items: {
              rule_name: {
                type: 'keyword',
                _meta: { description: 'The name of the detection rule' },
              },
              rule_id: {
                type: 'keyword',
                _meta: { description: 'The UUID id of the detection rule' },
              },
              rule_type: {
                type: 'keyword',
                _meta: { description: 'The type of detection rule. ie eql, query..' },
              },
              rule_version: { type: 'long', _meta: { description: 'The version of the rule' } },
              enabled: {
                type: 'boolean',
                _meta: { description: 'If the detection rule has been enabled by the user' },
              },
              elastic_rule: {
                type: 'boolean',
                _meta: { description: 'If the detection rule has been authored by Elastic' },
              },
              created_on: {
                type: 'keyword',
                _meta: { description: 'When the detection rule was created on the cluster' },
              },
              updated_on: {
                type: 'keyword',
                _meta: { description: 'When the detection rule was updated on the cluster' },
              },
              alert_count_daily: {
                type: 'long',
                _meta: { description: 'The number of daily alerts generated by a rule' },
              },
              cases_count_daily: {
                type: 'long',
                _meta: { description: 'The number of daily cases generated by a rule' },
              },
            },
          },
        },
        ml_jobs: {
          type: 'array',
          items: {
            job_id: { type: 'keyword' },
            open_time: { type: 'keyword' },
            create_time: { type: 'keyword' },
            finished_time: { type: 'keyword' },
            state: { type: 'keyword' },
            data_counts: {
              bucket_count: { type: 'long' },
              empty_bucket_count: { type: 'long' },
              input_bytes: { type: 'long' },
              input_record_count: { type: 'long' },
              last_data_time: { type: 'long' },
              processed_record_count: { type: 'long' },
            },
            model_size_stats: {
              bucket_allocation_failures_count: { type: 'long' },
              model_bytes: { type: 'long' },
              model_bytes_exceeded: { type: 'long' },
              model_bytes_memory_limit: { type: 'long' },
              peak_model_bytes: { type: 'long' },
            },
            timing_stats: {
              average_bucket_processing_time_ms: { type: 'long' },
              bucket_count: { type: 'long' },
              exponential_average_bucket_processing_time_ms: { type: 'long' },
              exponential_average_bucket_processing_time_per_hour_ms: { type: 'long' },
              maximum_bucket_processing_time_ms: { type: 'long' },
              minimum_bucket_processing_time_ms: { type: 'long' },
              total_bucket_processing_time_ms: { type: 'long' },
            },
            datafeed: {
              datafeed_id: { type: 'keyword' },
              state: { type: 'keyword' },
              timing_stats: {
                average_search_time_per_bucket_ms: { type: 'long' },
                bucket_count: { type: 'long' },
                exponential_average_search_time_per_hour_ms: { type: 'long' },
                search_count: { type: 'long' },
                total_search_time_ms: { type: 'long' },
              },
            },
          },
        },
      },
      endpoints: {
        total_installed: { type: 'long' },
        active_within_last_24_hours: { type: 'long' },
        os: {
          type: 'array',
          items: {
            full_name: { type: 'keyword' },
            platform: { type: 'keyword' },
            version: { type: 'keyword' },
            count: { type: 'long' },
          },
        },
        policies: {
          malware: {
            active: { type: 'long' },
            inactive: { type: 'long' },
            failure: { type: 'long' },
          },
        },
      },
    },
    isReady: () => kibanaIndex.length > 0,
    fetch: async ({ esClient }: CollectorFetchContext): Promise<UsageData> => {
      const internalSavedObjectsClient = await getInternalSavedObjectsClient(core);
      const savedObjectsClient = (internalSavedObjectsClient as unknown) as SavedObjectsClientContract;
      const [detections, detectionMetrics, endpoints] = await Promise.allSettled([
        fetchDetectionsUsage(kibanaIndex, esClient, ml, savedObjectsClient),
        fetchDetectionsMetrics(kibanaIndex, signalIndex, esClient, ml, savedObjectsClient),
        getEndpointTelemetryFromFleet(savedObjectsClient, endpointAppContext, esClient),
      ]);

      return {
        detections: detections.status === 'fulfilled' ? detections.value : defaultDetectionsUsage,
        detectionMetrics: detectionMetrics.status === 'fulfilled' ? detectionMetrics.value : {},
        endpoints: endpoints.status === 'fulfilled' ? endpoints.value : {},
      };
    },
  });

  usageCollection.registerCollector(collector);
};
