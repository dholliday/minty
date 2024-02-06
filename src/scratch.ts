import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  percentAmount,
  signerIdentity,
  createSignerFromKeypair,
  publicKey,
} from "@metaplex-foundation/umi";
import * as web3 from "@solana/web3.js";

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const umi = createUmi(connection);

const atp = umi.programs.has(
  publicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
);

console.log(atp);
