import { ContractSpec, Address } from '@stellar/stellar-sdk';
import { Buffer } from "buffer";
import { AssembledTransaction, Ok, Err } from './assembled-tx.js';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
  Error_,
  Result,
} from './assembled-tx.js';
import type { ClassOptions, XDR_BASE64 } from './method-options.js';

export * from './assembled-tx.js';
export * from './method-options.js';

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}


export const networks = {
    futurenet: {
        networkPassphrase: "Test SDF Future Network ; October 2022",
        contractId: "CB4W5563H62YDM27BK5AVBYVPTFXHRPPMCYIMYHT3CWITCZSY34IO2RJ",
    }
} as const

/**
    
    */
export interface Picture {
  /**
    
    */
author: string;
  /**
    
    */
canvas: string;
  /**
    
    */
number: u32;
}

/**
    
    */
export type Key = {tag: "Cursor", values: void} | {tag: "Owner", values: readonly [u32]} | {tag: "Author", values: readonly [string]} | {tag: "Authors", values: void} | {tag: "Picture", values: readonly [u32]};

/**
    
    */
export const Errors = {

}

export class Contract {
    spec: ContractSpec;
    constructor(public readonly options: ClassOptions) {
        this.spec = new ContractSpec([
            "AAAAAQAAAAAAAAAAAAAAB1BpY3R1cmUAAAAAAwAAAAAAAAAGYXV0aG9yAAAAAAAQAAAAAAAAAAZjYW52YXMAAAAAABAAAAAAAAAABm51bWJlcgAAAAAABA==",
        "AAAAAgAAAAAAAAAAAAAAA0tleQAAAAAFAAAAAAAAAAAAAAAGQ3Vyc29yAAAAAAABAAAAAAAAAAVPd25lcgAAAAAAAAEAAAAEAAAAAQAAAAAAAAAGQXV0aG9yAAAAAAABAAAAEAAAAAAAAAAAAAAAB0F1dGhvcnMAAAAAAQAAAAAAAAAHUGljdHVyZQAAAAABAAAABA==",
        "AAAAAAAAAAAAAAAEbWludAAAAAMAAAAAAAAABmNhbnZhcwAAAAAAEAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAZhdXRob3IAAAAAABAAAAABAAAD6AAAABA=",
        "AAAAAAAAAAAAAAAIZ2V0X2xpc3QAAAAAAAAAAQAAA+wAAAAEAAAAEA==",
        "AAAAAAAAAAAAAAAJZ2V0X293bmVyAAAAAAAAAQAAAAAAAAAHcGljdHVyZQAAAAAEAAAAAQAAA+gAAAAT",
        "AAAAAAAAAAAAAAALZ2V0X3BpY3R1cmUAAAAAAQAAAAAAAAAHcGljdHVyZQAAAAAEAAAAAQAAA+gAAAfQAAAAB1BpY3R1cmUA",
        "AAAAAAAAAAAAAAAOZ2V0X3BpY3R1cmVfYnkAAAAAAAEAAAAAAAAABmF1dGhvcgAAAAAAEAAAAAEAAAPoAAAH0AAAAAdQaWN0dXJlAA=="
        ]);
    }
    private readonly parsers = {
        mint: (result: XDR_BASE64): Option<string> => this.spec.funcResToNative("mint", result),
        getList: (result: XDR_BASE64): Map<u32, string> => this.spec.funcResToNative("get_list", result),
        getOwner: (result: XDR_BASE64): Option<string> => this.spec.funcResToNative("get_owner", result),
        getPicture: (result: XDR_BASE64): Option<Picture> => this.spec.funcResToNative("get_picture", result),
        getPictureBy: (result: XDR_BASE64): Option<Picture> => this.spec.funcResToNative("get_picture_by", result)
    };
    private txFromJSON = <T>(json: string): AssembledTransaction<T> => {
        const { method, ...tx } = JSON.parse(json)
        return AssembledTransaction.fromJSON(
            {
                ...this.options,
                method,
                parseResultXdr: this.parsers[method],
            },
            tx,
        );
    }
    public readonly fromJSON = {
        mint: this.txFromJSON<ReturnType<typeof this.parsers['mint']>>,
        getList: this.txFromJSON<ReturnType<typeof this.parsers['getList']>>,
        getOwner: this.txFromJSON<ReturnType<typeof this.parsers['getOwner']>>,
        getPicture: this.txFromJSON<ReturnType<typeof this.parsers['getPicture']>>,
        getPictureBy: this.txFromJSON<ReturnType<typeof this.parsers['getPictureBy']>>
    }
        /**
    * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    mint = async ({canvas, owner, author}: {canvas: string, owner: string, author: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'mint',
            args: this.spec.funcArgsToScVals("mint", {canvas, owner: new Address(owner), author}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['mint'],
        });
    }


        /**
    * Construct and simulate a get_list transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    getList = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'get_list',
            args: this.spec.funcArgsToScVals("get_list", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['getList'],
        });
    }


        /**
    * Construct and simulate a get_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    getOwner = async ({picture}: {picture: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'get_owner',
            args: this.spec.funcArgsToScVals("get_owner", {picture}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['getOwner'],
        });
    }


        /**
    * Construct and simulate a get_picture transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    getPicture = async ({picture}: {picture: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'get_picture',
            args: this.spec.funcArgsToScVals("get_picture", {picture}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['getPicture'],
        });
    }


        /**
    * Construct and simulate a get_picture_by transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    getPictureBy = async ({author}: {author: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'get_picture_by',
            args: this.spec.funcArgsToScVals("get_picture_by", {author}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['getPictureBy'],
        });
    }

}