
module governance::governance {
    use blob_store::blob::Blob;
    use sui::clock::{Self, Clock};
    use std::string::{String};
    use sui::table::{Self, Table};


    const ENOTDAOMEMBER: u64 = 10;
    const ENOTVALIDPROPOSAL: u64 = 11;
    public struct Proposal has key, store {
        id: UID,
        name: String,
        blob: Blob,
        accepted: bool,
        min_threshold: u64,
        weight: u64,
        last_voting_time: u64
    }

    public struct ProposalList has key, store {
        id: UID,
        list: Table<address, Proposal>
    }

    public struct Users has key, store {
        id: UID,
        list: Table<address, u64>
    }


    public entry fun create_proposal(name: String, blob: Blob, proposal_list: &mut ProposalList, min_threshold: u64, users: &Users, ctx: &mut TxContext) {
        assert!(table::contains(&users.list, tx_context::sender(ctx)), ENOTDAOMEMBER);
        let new_proposal = Proposal {
            id: object::new(ctx),
            name,
            blob,
            accepted: false,
            min_threshold,
            weight: 0,
            last_voting_time: 0
        };
        table::add(&mut proposal_list.list, object::uid_to_address(&new_proposal.id), new_proposal);
    }

    public entry fun vote(proposal_list: &mut ProposalList, proposal: address, users: &Users, clock: &Clock, ctx: &mut TxContext) {
        assert!(table::contains(&users.list, tx_context::sender(ctx)), ENOTDAOMEMBER);
        assert!(table::contains(&proposal_list.list, proposal), ENOTVALIDPROPOSAL);
        let proposal = table::borrow_mut(&mut proposal_list.list, proposal);
        let vote_weight = table::borrow(&users.list, tx_context::sender(ctx));
        proposal.weight = proposal.weight + *vote_weight;
        proposal.last_voting_time = clock::timestamp_ms(clock);
    }

    public entry fun approve_proposal() {

    }

    public entry fun add_user_dao() {

    }

    public entry fun remove_user_dao() {
        
    }


}

