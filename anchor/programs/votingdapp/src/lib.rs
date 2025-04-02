#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("4qPs2V4qNKxrfWibYwMYLZzEVZn4ub2MsAUrtJykQuKx");

#[program]
pub mod votingdapp {
    use super::*;

    pub fn initialize_poll(ctx : Context<InitializePoll>, poll_id : u64, poll_description: String, poll_start_time: u64, poll_end_time: u64 ) -> Result<()> {
      let poll =  &mut ctx.accounts.poll;
      poll.poll_id = poll_id;
      poll.poll_description = poll_description;
      poll.poll_start_time = poll_start_time;
      poll.poll_end_time = poll_end_time;
      poll.total_candidates = 0;

      Ok(())
    }

    pub fn initialize_candidate(ctx: Context<InitializeCandidate>, candidate_name: String, _poll_id : u64) -> Result<()>{
      let candidate = &mut ctx.accounts.candidate;
      let poll = &mut ctx.accounts.poll;
      poll.total_candidates += 1;
      candidate.candidate_name = candidate_name;
      candidate.candidate_votes = 0;
       
      Ok(())
    }

    pub fn vote(ctx : Context<Vote>, _candidate_name : String, _poll_id : u64) -> Result<()>{
      let candidate = &mut ctx.accounts.candidate;
      candidate.candidate_votes += 1;

      Ok(())
    }
}

#[derive(Accounts)]
#[instruction(candidate_name : String, poll_id : u64)]
pub struct Vote<'info> {
  pub signer: Signer<'info>,
  #[account(
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll: Account<'info, Poll>,

  #[account(
    mut,
    seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
    bump
  )]
  pub candidate: Account<'info, Candidate>,

}

#[derive(Accounts)]
#[instruction(candidate_name : String, poll_id : u64)]
pub struct InitializeCandidate<'info> {
  #[account(mut)]
  pub signer: Signer<'info>,
  #[account(
    mut,
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll: Account<'info, Poll>,

  #[account(
    init,
    payer = signer,
    // space = 1024,
    space = 8 + Poll::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
    bump
  )]
  pub candidate: Account<'info, Candidate>,

  pub system_program: Program<'info, System>,

}

#[account]
#[derive(InitSpace)]
pub struct Candidate {
  #[max_len(32)]
  pub candidate_name : String,
  pub candidate_votes : u64,
}

#[derive(Accounts)]
#[instruction(poll_id : u64)]
pub struct InitializePoll<'info> {
  #[account(mut)]
  pub signer: Signer<'info>,
  #[account(
    init,
    payer = signer,
    space = 1024,
    // space = 8 + Poll::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll: Account<'info, Poll>,

  pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
  pub poll_id : u64,
  #[max_len(32)]
  pub poll_description : String,
  pub poll_start_time : u64,
  pub poll_end_time : u64,
  pub total_candidates : u64,
}