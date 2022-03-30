/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

'use strict';

// Origin: helix .live site
const ORIGIN_HOSTNAME = 'main--helix-demo--stefan-guggisberg.hlx.live';

addEventListener('fetch', (event) => {
  return event.respondWith(handleEvent(event));
});

const handleEvent = async (event) => {
  const url = new URL(event.request.url);
  url.hostname = ORIGIN_HOSTNAME;
  const req = new Request(url, event.request);
  req.headers.set('x-forwarded-host', req.headers.get('host'));
  // set the following header if push invalidation is configured
  // (see https://www.hlx.live/docs/setup-byo-cdn-push-invalidation#cloudflare)
  req.headers.set('x-push-invalidation', 'enabled');
  let resp = await fetch(req, {
    cf: {
      // cf doesn't cache html by default: need to override the default behaviour by setting "cacheEverything: true"
      cacheEverything: true,
    },
  });
  resp = new Response(resp.body, resp);
  resp.headers.delete('age');
  resp.headers.delete('x-robots-tag');
  return resp;
};
