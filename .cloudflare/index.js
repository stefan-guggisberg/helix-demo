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

addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  url.hostname = 'main--helix-demo--stefan-guggisberg.hlx.live';
  const req = new Request(url, event.request);
  // set x-forwarded-host header (for visibility in the coralogix logs)
  req.headers.set('x-forwarded-host', req.headers.get('host'));
  event.respondWith(
    fetch(req, { 
      cf: {
        cacheKey: event.request.url,
        // cf doesn't cache html by default: need to override the default behaviour by setting "cacheEverything: true"
        cacheEverything: true,
      },
    })
  );
});

/*
// using the Cache API
addEventListener('fetch', (event) => {
  if (event.request.method === 'POST'
    && event.request.headers.get('X-Method') === 'PURGE') {
    const result = await caches.default.delete(event.request, { ignoreMethod: true });
    event.respondWith(new Response(`Purging ${event.request.url} succeeded: ${result}\n\n`, { status: 200  }));
    return;
  }

  const url = new URL(event.request.url);
  url.hostname = 'main--helix-demo--stefan-guggisberg.hlx.live';
  const req = new Request(url, event.request);
  // set x-forwarded-host header (for visibility in the coralogix logs)
  req.headers.set('x-forwarded-host', req.headers.get('host'));

  // cache lookup
  let resp = await caches.default.match(event.request);
  if (!resp) {
    // proxy request to origin
    resp =  await fetch(req);
    // use waitUntil so you can return the response without blocking on writing to cache
    event.waitUntil(caches.default.put(event.request, resp.clone()))
  }
  event.respondWith(resp);
});
*/
