import { initializeKeypair } from "./initializeKeypair";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

async function createNewMint(
  connection: web3.Connection,
  payer: web3.Keypair,
  mintAuthority: web3.PublicKey,
  freezeAuthority: web3.PublicKey,
  decimals: number
): Promise<web3.PublicKey> {
  const tokenMint = await token.createMint(
    connection,
    payer,
    mintAuthority,
    freezeAuthority,
    decimals
  );

  console.log(`The token mint account address is ${tokenMint}`);
  console.log(
    `Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet`
  );

  return tokenMint;
}

async function createTokenAccount(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  owner: web3.PublicKey
) {
  const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    owner
  );

  console.log(
    `Token Account: https://explorer.solana.com/address/${tokenAccount.address}?cluster=devnet`
  );

  return tokenAccount;
}

async function mintTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  destination: web3.PublicKey,
  authority: web3.Keypair,
  amount: number
) {
  const mintInfo = await token.getMint(connection, mint);

  const transactionSignature = await token.mintTo(
    connection,
    payer,
    mint,
    destination,
    authority,
    amount * 10 ** mintInfo.decimals
  );

  console.log(
    `Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );
}

async function transferTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  source: web3.PublicKey,
  destination: web3.PublicKey,
  owner: web3.PublicKey,
  amount: number,
  mint: web3.PublicKey
) {
  const mintInfo = await token.getMint(connection, mint);

  const transactionSignature = await token.transfer(
    connection,
    payer,
    source,
    destination,
    owner,
    amount * 10 ** mintInfo.decimals
  );

  console.log(
    `Transfer Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );
}

async function burnTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  account: web3.PublicKey,
  mint: web3.PublicKey,
  owner: web3.Keypair,
  amount: number
) {
  const mintInfo = await token.getMint(connection, mint);

  const transactionSignature = await token.burn(
    connection,
    payer,
    account,
    mint,
    owner,
    amount * 10 ** mintInfo.decimals
  );

  console.log(
    `Burn Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );
}

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
