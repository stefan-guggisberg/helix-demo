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
  event.respondWith(handleRequest(event.request));
});

/**
 * Request handler
 * 
 * @param {Request} req
 * @returns {Promise<Response>}
 */
async function handleRequest(req) {
  const url = new URL(req.url);

  const { method, body } = req;
  const headers = new Headers(req.headers);
  // set x-forwarded-host header (for visibility in the coralogix logs)
  headers.set('x-forwarded-host', req.headers.get('host'));
  // proxy request to origin
  return await fetch(`${ORIGIN}${url.pathname}${url.search}`, { method, headers, body });
}
