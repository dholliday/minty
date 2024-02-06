import * as web3 from "@solana/web3.js";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const umi = createUmi(connection);

async function m() {
  const mint = generateSigner(umi);
  console.log("MINT ACCOUNT");
  console.log(mint);

  const authority = generateSigner(umi);
  console.log("AUTHORITY ACCOUNT");
  console.log(authority);

  await createV1(umi, {
    mint,
    authority,
    name: "ABC",
    uri: "https://github.com/dholliday/bigdex/blob/dff53f703c4bbd687b1433e1fadcd5e7296cec14/public/token/token_image.png",
    sellerFeeBasisPoints: percentAmount(0),
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);
}

m()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
