import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import * as anchor from '@coral-xyz/anchor'
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {Votingdapp} from '@/../anchor/target/types/votingdapp';
import { Program } from "@coral-xyz/anchor";

const IDL = require('@/../anchor/target/idl/votingdapp.json')

export const OPTIONS = GET;

export async function GET(request: Request) {
  const actionMetaData: ActionGetResponse =  {
    title: "Vote for your favorite german car",
    description: "Vote between Mercedes and BMW",
    label: "Vote",
    icon : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCe6DzzLlyfdgwpKc-myexHs-SUZHCnj-CiQ&s",
    links : {
      actions : [
        {
          label : "Vote for Merc",
          href : "/api/hello?candidate=merc",
          type : "external-link"
        },
        {
          label : "Vote for BMW",
          href : "/api/hello?candidate=bmw",
          type : "external-link"
        }
      ]
    }
  };

  return Response.json(actionMetaData, {headers : ACTIONS_CORS_HEADERS})
}

export async function POST(request: Request){
  const url = new URL(request.url);

  const candidate =  url.searchParams.get("candidate");
  console.log('candidate',candidate);

  if(candidate !== "Merc" && candidate !== "BMW"){
    return new Response("Invalid candidate", {status : 400, headers : ACTIONS_CORS_HEADERS})
  }

  const connection = new Connection('http://127.0.0.1:8899', "confirmed");
  const body: ActionPostRequest = await request.json();
  let voter = new PublicKey(body.account);
  const program: Program<Votingdapp> = new Program(IDL, {connection})

  try {
    voter = new PublicKey(body.account)
  }
  catch(e){
    return new Response("Invalid account", {status : 400, headers : ACTIONS_CORS_HEADERS})
  }

  // grab instruction
  const instruction = program.methods.vote("Merc", new anchor.BN(1)).
  accounts({
    signer : voter
  }).
  instruction();

  const blockhash = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: voter,
    blockhash : blockhash.blockhash,
    lastValidBlockHeight : blockhash.lastValidBlockHeight
  }).add(await instruction);

  const response = await createPostResponse({
    fields : {
      transaction : transaction,
      type : "transaction"
    }
  });

  return Response.json(response, {headers: ACTIONS_CORS_HEADERS})
}
