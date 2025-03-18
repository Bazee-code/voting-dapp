import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
const IDL = require('../target/idl/votingdapp.json')

const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")

describe('Voting dapp', () => {
  it('Initialize poll', async () => {
    const context = await startAnchor("", [{name: "votingdapp", programId: votingAddress}], []);
    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Votingdapp>(
      IDL,
      provider
    )

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your favorite car brand ?",
      new anchor.BN(0),
      new anchor.BN(1721246480)
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le',8)],
      votingAddress
    );
    
    // add confirmation of poll address first before fetching
    // await votingProgram.provider.connection.getAccountInfo(pollAddress);

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log('poll',poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.pollDescription).toEqual("What is your favorite car brand ?");
    expect(poll.pollStartTime.toNumber()).toBeLessThan(poll.pollEndTime.toNumber())

  })
})