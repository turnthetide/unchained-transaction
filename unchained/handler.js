/**
 * Copyright 2017-2018 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

'use strict'

const crypto = require('crypto')

const UnchainedPayload = require('./payload')

const _hash = (x) =>
    crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)

const UNCHAINED_FAMILY = 'unchained'
const UNCHAINED_NAMESPACE = _hash(UNCHAINED_FAMILY).substring(0, 6)

const _makeUnchainedAddress = (x) => UNCHAINED_NAMESPACE + _hash(x)

const {TransactionHandler} = require('sawtooth-sdk/processor/handler')
const {InvalidTransaction} = require('sawtooth-sdk/processor/exceptions')

class UnchainedHandler extends TransactionHandler {
    constructor() {
        super(UNCHAINED_FAMILY, ['1.0'], [UNCHAINED_NAMESPACE])
    }

    apply(transactionProcessRequest, context) {
        let payload = UnchainedPayload.fromBytes(transactionProcessRequest.payload)
        let header = transactionProcessRequest.header
        let account = header.signerPublicKey

        let address = _makeUnchainedAddress(payload.id)

        let data = _serialize(payload)

        let entries = {
            [address]: data
        }
        return this.context.setState(entries, this.timeout)
    }
}

module.exports = UnchainedHandler
