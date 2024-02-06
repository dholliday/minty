import { initializeKeypair } from "./initializeKeypair";
import * as helpers from "./utils/helpers";
import * as web3 from "@solana/web3.js";

async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const user = await initializeKeypair(connection);

  console.log("PublicKey:", user.publicKey.toBase58());

  // const mint = await createNewMint(
  //   connection,
  //   user, // We'll pay the fees
  //   user.publicKey, // We're the mint authority
  //   user.publicKey, // And the freeze authority >:)
  //   2 // Only two decimals!
  // );

  // const tokenAccount = await createTokenAccount(
  //   connection,
  //   user,
  //   mint,
  //   user.publicKey // Associating our address with the token account
  // );

  // await mintTokens(connection, user, mint, tokenAccount.address, user, 1000000);

  console.log(
    new web3.PublicKey("2fnYBGbP1joRyyp7LRqhn678A32Hr2x1FP6skQt5LPwr")
  );

  const receiverTokenAccount = await createTokenAccount(
    connection,
    user, // payer
    new web3.PublicKey("JCfEGkxmEXeWrysCuZM96UnxhPd8EHWkQFFj5Sug1S9Y"), // mint
    new web3.PublicKey("HpksWfTfABoBwPJ8ac8c6qvAewtNs5DyrDuZWMieCcfq") //receiver
  );

  await transferTokens(
    connection,
    user, // payer
    new web3.PublicKey("2fnYBGbP1joRyyp7LRqhn678A32Hr2x1FP6skQt5LPwr"), // source token account
    receiverTokenAccount.address, // destination token account
    user.publicKey,
    100,
    new web3.PublicKey("JCfEGkxmEXeWrysCuZM96UnxhPd8EHWkQFFj5Sug1S9Y") // token mint
  );
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
