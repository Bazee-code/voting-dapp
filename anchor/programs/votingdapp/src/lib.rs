#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

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
}

#[derive(Accounts)]
// #instruction(poll_id : u64)
pub struct InitializePoll<'info> {
  #[account(mut)]
  pub signer: Signer<'info>,
  #[account(
    init,
    payer = signer,
    space = 1024,
    // space = 8 + Poll::INIT_SPACE,
    seeds = [b"poll".as_ref()],
    // seeds = [poll_id.to_le_bytes().as_ref()],
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