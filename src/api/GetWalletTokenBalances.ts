import Moralis from "moralis";

export async function getWalletTokenBalances(address: string) {
    
  try {
    await Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    });

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: "0x1",
      address: address,
    });

    console.log(response.raw);

    return response.raw;
  } catch (e) {
    console.error(e);
  }
}

// TODO: Add wallet connect
