import * as web3 from "@solana/web3.js";
import * as bs58 from "bs58";
import * as fs from "fs";
import {
  generateSigner,
  percentAmount,
  signerIdentity,
  createSignerFromKeypair,
  publicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createV1,
  TokenStandard,
  printSupply,
} from "@metaplex-foundation/mpl-token-metadata";
import dotenv from "dotenv";
dotenv.config();

const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
const umi = createUmi(connection);

async function m() {
  const latestBlockHash = await connection.getLatestBlockhash();
  console.log(latestBlockHash);
  const mint = generateSigner(umi);
  fs.writeFileSync(
    ".mint.env",
    `MINT_PRIVATE_KEY=[${mint.secretKey.toString()}]`
  );
  console.log("MINT ACCOUNT");
  console.log(mint);

  // Using initialised keypair stored in local .env file
  // const authoritySecret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
  // const authoritySecretKey = Uint8Array.from(authoritySecret);
  // const authorityKeypair =
  //   umi.eddsa.createKeypairFromSecretKey(authoritySecretKey);
  // const authorityKeypairSigner = createSignerFromKeypair(umi, authorityKeypair);

  // Using my Phantom Wallet Address on mainnet-beta
  const authoritySecret = process.env.SOLANA_MAIN_WALLET_PRIVATE_KEY as string;
  const authoritySecretDecode = bs58.decode(authoritySecret);
  const authoritySecretKey = Uint8Array.from(authoritySecretDecode);
  const authorityKeypair =
    umi.eddsa.createKeypairFromSecretKey(authoritySecretKey);
  const authorityKeypairSigner = createSignerFromKeypair(umi, authorityKeypair);

  console.log("AUTHORITY ACCOUNT");
  console.log(authorityKeypairSigner.publicKey);

  umi.use(signerIdentity(authorityKeypairSigner));

  console.log("📈📉📈 Creating Accounts... 📈📉📈");

  await createV1(umi, {
    mint,
    authority: authorityKeypairSigner,
    name: "BIG DEX",
    symbol: "BIGDEX",
    uri: "https://bigdex.lol/token/bigdex/token_metadata.json",
    sellerFeeBasisPoints: percentAmount(0),
    tokenStandard: TokenStandard.Fungible,
    decimals: 1,
  }).sendAndConfirm(umi);

  console.log("Created Accounts Successfully ✅");
}

m()
  .then(() => {
    console.log("✅ Finished successfully ✅");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
