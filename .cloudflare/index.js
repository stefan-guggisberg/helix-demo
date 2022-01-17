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

const ORIGIN = 'https://main--helix-demo--stefan-guggisberg.hlx.live';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request, event));
});

/**
 * Request handler
 * 
 * @param {Request} req
 * @param {FetchEvent} event
 * @returns {Promise<Response>}
 */
 async function handleRequest(req, event) {
  const { method, body } = req;
  const headers = new Headers(req.headers);
  // set x-forwarded-host header (for visibility in the coralogix logs)
  headers.set('x-forwarded-host', req.headers.get('host'));
  const url = new URL(req.url);
  const originUrl = `${ORIGIN}${url.pathname}${url.search}`;
  // proxy request to origin
  // cf doesn't cache html by default: need to override the default behaviour by setting "cacheEverything: true"
  return await fetch(originUrl, { method, headers, body, cf: { cacheEverything: true } });
  //return await fetch(originUrl, { method, headers, body, cf: { cacheKey: req.url, cacheEverything: true } });
}
/*
async function handleRequest(req, event) {
  const url = new URL(req.url);

  const { method, body } = req;
  if (method === 'POST' && req.headers.get('X-Method') === 'PURGE') {
    const result = await caches.default.delete(req, { ignoreMethod: true });
    return new Response(`Purge succeeded: ${result}\n\n`, { status: 200  });
  }
  const headers = new Headers(req.headers);
  // set x-forwarded-host header (for visibility in the coralogix logs)
  headers.set('x-forwarded-host', req.headers.get('host'));

  // cache lookup
  let resp = await caches.default.match(req);
  if (!resp) {
    // proxy request to origin
    resp =  await fetch(`${ORIGIN}${url.pathname}${url.search}`, { method, headers, body });
    // use waitUntil so you can return the response without blocking on writing to cache
    event.waitUntil(caches.default.put(req, resp.clone()))
  }
  return resp;
}
*/
