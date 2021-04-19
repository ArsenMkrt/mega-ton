import { TONClient } from 'ton-client-web-js';
import ConverterApi from './ConverterApi';
import SmartContract from "./ton-contracts/SmartContract";
import TransferAbi from "./ton-contracts/Transfer.abi.json";

var TonProviderFactory = {
    create(servers) {
        const _provider = {
            _tonClient: null,
            _servers: servers,
            _dictionaryId: 1,
            _mnemonicWordCount: 12,
            _hdPath: "m/44'/396'/0'/0/0"
        };

        const _getClient = async () => {
            if (!_provider._tonClient)
                _provider._tonClient = await TONClient.create({ servers: _provider._servers });
            return _provider._tonClient;
        };

        const generateMnemonic = async () => {
            var client = await _getClient()
            const phrase = await client.crypto.mnemonicFromRandom({
                dictionary: _provider._dictionaryId,
                wordCount: _provider._mnemonicWordCount
            });
            return phrase;
        };

        const generateKeys = async (seed) => {
            const client = await _getClient();

            var result = await client.crypto.mnemonicDeriveSignKeys({
                dictionary: _provider._dictionaryId,
                wordCount: _provider._mnemonicWordCount,
                phrase: seed,
                path: _provider._hdPath
            });

            return result;
        };

        const getDeployData = async (keys) => {
            const client = await _getClient();

            const contract = SmartContract.SafeMultisig;
            var param = {
                abi: contract.abi,
                imageBase64: contract.image,
                initParams: {},
                publicKeyHex: keys.public,
                workchainId: 0,
            };
            var result = await client.contracts.getDeployData(param);

            return result;
        };

        const calcDeployFees = async (keys) => {
            const client = await _getClient();
            const contract = SmartContract.SafeMultisig;
            const pkg = { abi: contract.abi, imageBase64: contract.image };
            const constructorParams = { owners: [`0x${keys.public}`], reqConfirms: 1 };

            return await client.contracts.calcDeployFees({
                package: pkg,
                constructorParams,
                initParams: {},
                keyPair: keys,
                emulateBalance: true,
                newaccount: true
            });
        };

        const deployContract = async (keys) => {
            const client = await _getClient();
            const contract = SmartContract.SafeMultisig;
            const pkg = { abi: contract.abi, imageBase64: contract.image };
            const constructorParams = { owners: [`0x${keys.public}`], reqConfirms: 1 };

            const data = {
                package: pkg,
                constructorParams,
                initParams: {},
                keyPair: keys
            };
            const deployMessage = await client.contracts.createDeployMessage(data);
            const processingState = await client.contracts.sendMessage(deployMessage.message);
            return await client.contracts.waitForDeployTransaction(deployMessage, processingState);
        };

        const _createPayload = async (client, comment) => {
            if (!comment)
                return '';
            
            const msg = ConverterApi.hexEncode(comment);
            const payload = (await client.contracts.createRunBody({
                abi: TransferAbi,
                function: 'transfer',
                params: {comment: msg},
                internal: true
              })).bodyBase64;
            return payload;
        };

        const calcTransactionFees = async (keys, fromAddress, toAddress, ammount, comment) => {
            const client = await _getClient();

            const input = {
                dest: toAddress,
                value: ammount,
                bounce: false,
                allBalance: false,
                payload: await _createPayload(client, comment)
            };
            const contract = SmartContract.SafeMultisig;

            return await client.contracts.calcRunFees({
                address: fromAddress,
                functionName: 'submitTransaction',
                abi: contract.abi,
                input: input,
                keyPair: keys
            });
        };


        const sendTransaction = async (keys, fromAddress, toAddress, ammount, comment) => {
            const client = await _getClient();

            const input = {
                dest: toAddress,
                value: ammount,
                bounce: false,
                allBalance: false,
                payload: await _createPayload(client, comment)
            };

            const contract = SmartContract.SafeMultisig;
            const runMessage = await client.contracts.createRunMessage(
                {
                    address: fromAddress,
                    abi: contract.abi,
                    functionName: 'submitTransaction',
                    input,
                    keyPair: keys
                });
            const processingState = await client.contracts.sendMessage(runMessage.message);

            const trnsaction = await client.contracts.waitForRunTransaction(runMessage, processingState);

            return trnsaction;
        };

        const getAccountData = async (address) => {
            const client = await _getClient();
            const data = await client.queries.accounts.query({ id: { in: address } }, 'id, balance(format: DEC), code_hash');

            return data;
        };

        const onAccountChange = async (address, onChange) => {
            const client = await _getClient();
            const filter = { id: { in: address } };

            var result = client.queries.accounts.subscribe(filter, 'id, balance(format: DEC), code_hash', (e, d) => {
                onChange(d);
            });
            return result;
        };

        const getSmartContracts = async () => {
            const smartContracts = [
                SmartContract.SafeMultisig
            ];

            return smartContracts;
        };

        return {
            generateMnemonic,
            generateKeys,
            getDeployData,
            getAccountData,
            onAccountChange,
            calcDeployFees,
            calcTransactionFees,
            //deploySafeMultisig,
            deployContract,
            sendTransaction,
            getSmartContracts
        }
    }
}

export default TonProviderFactory;