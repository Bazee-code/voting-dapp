import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
const IDL = require('../target/idl/votingdapp.json')

const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")

describe('Voting dapp', () => {

  let context;
  let provider;
  let votingProgram: anchor.Program<Votingdapp>;

  beforeAll(async () => {
     context = await startAnchor("", [{name: "votingdapp", programId: votingAddress}], []);
     provider = new BankrunProvider(context);

     votingProgram = new Program<Votingdapp>(
      IDL,
      provider
    )

  })

  it('Initialize poll', async () => {
    
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
 
    // await votingProgram.account.poll
    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log('pollAddy',pollAddress);
    // console.log('poll', votingProgram.account.poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.pollDescription).toEqual("What is your favorite car brand ?");
    expect(poll.pollStartTime.toNumber()).toBeLessThan(poll.pollEndTime.toNumber())

  });

  it('Initialize candidate', async () => {
     await votingProgram.methods.initializeCandidate(
      "Merc",
      new anchor.BN(1),
     ).rpc();
     await votingProgram.methods.initializeCandidate(
      "BMW",
      new anchor.BN(1),
     ).rpc();

     const [mercAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le',8), Buffer.from("Merc")],
      votingAddress
    );

    const [bmwAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le',8), Buffer.from("BMW")],
      votingAddress
    );

     const mercCandidate = await votingProgram.account.candidate.fetch(mercAddress)
     const bmwCandidate = await votingProgram.account.candidate.fetch(bmwAddress)


     console.log('merc',mercCandidate);
     console.log('bmw',bmwCandidate);

    // expect(mercCandidate.candidateName).toEqual("Merc");
    expect(mercCandidate.candidateVotes.toNumber()).toEqual(0);
    // expect(bmwCandidate.candidateName).toEqual("BMW");
    expect(bmwCandidate.candidateVotes.toNumber()).toEqual(0)
  })

  it('vote', async() => {
    await votingProgram.methods.vote(
      'Merc',
      new anchor.BN(1)
    ).rpc();

    const [mercAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le',8), Buffer.from("Merc")],
      votingAddress
    );

    const mercCandidate = await votingProgram.account.candidate.fetch(mercAddress)

    expect(mercCandidate.candidateVotes.toNumber()).toEqual(1);
  });
})