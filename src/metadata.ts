import * as web3 from "@solana/web3.js";
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
  mintV1,
} from "@metaplex-foundation/mpl-token-metadata";
import dotenv from "dotenv";
dotenv.config();

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const umi = createUmi(connection);

async function m() {
  const mint = generateSigner(umi);
  console.log("MINT ACCOUNT");
  console.log(mint);

  const authoritySecret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
  const authoritySecretKey = Uint8Array.from(authoritySecret);
  const authorityKeypair =
    umi.eddsa.createKeypairFromSecretKey(authoritySecretKey);
  const authorityKeypairSigner = createSignerFromKeypair(umi, authorityKeypair);
  console.log("AUTHORITY ACCOUNT");
  console.log(authorityKeypairSigner);

  umi.use(signerIdentity(authorityKeypairSigner));

  const receiverTokenPublicKey = publicKey(
    "HpksWfTfABoBwPJ8ac8c6qvAewtNs5DyrDuZWMieCcfq"
  );

  console.log("📈📉📈 Creating Accounts... 📈📉📈");
  await createV1(umi, {
    mint,
    authority: authorityKeypairSigner,
    name: "DAVE",
    symbol: "DAVE",
    uri: "https://bigdex.lol/token/dave/token_metadata.json",
    sellerFeeBasisPoints: percentAmount(0),
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);

  console.log("Created Accounts Successfully ✅");
  console.log("💵💶💷 Minting Tokens... 💵💶💷");
  await mintV1(umi, {
    mint: mint.publicKey,
    authority: authorityKeypairSigner,
    amount: 1000000,
    tokenOwner: receiverTokenPublicKey,
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);
  console.log("Minted Tokens Successfully ✅");
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
