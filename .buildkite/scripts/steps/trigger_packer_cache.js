/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const { BuildkiteClient } = require('kibana-buildkite-library');

(async () => {
  try {
    const client = new BuildkiteClient();
    const build = await client.triggerBuild('kibana-agent-packer-cache', {
      commit: 'HEAD',
      branch: 'main',
      ignore_pipeline_branch_filters: true, // Required because of a Buildkite bug
    });
    console.log(`Triggered build: ${build.web_url}`);
    process.exit(0);
  } catch (ex) {
    console.error('Buildkite API Error', ex.toString());
    if (ex.response) {
      console.error('HTTP Error Response Status', ex.response.status);
      console.error('HTTP Error Response Body', ex.response.data);
    }
    process.exit(1);
  }
})();
